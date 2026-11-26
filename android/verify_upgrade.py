#!/usr/bin/env python3
"""Validate a pair of signed APKs, optionally install and update on a test device."""

import argparse
import hashlib
import os
from pathlib import Path
import re
import subprocess


ACTIVITY = "io.github.flinttgaverdale.cinematico.MainActivity"


def run(*command):
    return subprocess.run(command, check=True, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT).stdout


def executable(directory, name):
    return directory / (name + (".exe" if os.name == "nt" else ""))


def apk_info(apk, tools):
    info = run(str(executable(tools, "aapt")), "dump", "badging", str(apk))
    match = re.search(r"^package: name='([^']+)' versionCode='([0-9]+)' versionName='([^']*)'", info, re.M)
    if not match:
        raise ValueError(f"No se encontró ID y versión en {apk.name}")
    package, code, version = match.groups()
    java = Path(os.environ["JAVA_HOME"]) / "bin" if os.environ.get("JAVA_HOME") else Path()
    signed = run(str(executable(java, "java")), "-jar", str(tools / "lib/apksigner.jar"),
                 "verify", "--print-certs", str(apk))
    fingerprints = re.findall(r"^Signer #\d+ certificate SHA-256 digest: ([a-f0-9]{64})$", signed, re.M)
    if len(fingerprints) != 1:
        raise ValueError(f"Se requiere un único firmante verificable en {apk.name}")
    return package, int(code), version, fingerprints[0]


def check_on_device(args, package, codes, adb):
    def device(*command):
        return run(str(adb), "-s", args.serial, *command)

    if device("get-state").strip() != "device":
        raise ValueError("El dispositivo debe estar conectado y autorizado")
    try:
        installed = device("shell", "pm", "path", package)
    except subprocess.CalledProcessError as error:
        if error.returncode != 1 or error.stdout.strip():
            raise
    else:
        if "package:" in installed:
            raise ValueError("La app ya está instalada. Usa un dispositivo de prueba con este paquete ausente.")

    def confirm_version(code):
        state = device("shell", "dumpsys", "package", package)
        installed_code = re.search(r"\bversionCode=(\d+)\b", state)
        if not installed_code or int(installed_code.group(1)) != code:
            raise ValueError(f"El dispositivo no informa el código esperado {code}")
        launched = device("shell", "am", "start", "-W", "-n", f"{package}/{ACTIVITY}")
        if not re.search(r"^Status:\s*ok\b", launched, re.M) or "Error:" in launched:
            raise ValueError("Android no confirmó el arranque de la actividad de Cinemático")

    device("install", str(args.baseline))
    confirm_version(codes[0])
    if args.interactive:
        prompt = "Abre Estudio avanzado. Comprueba Crear y el audio en modo avión. Vuelve al Estudio avanzado y escribe OK: "
        if input(prompt).strip().lower() != "ok":
            raise ValueError("La aceptación manual de la primera instalación quedó pendiente")

    device("install", "-r", str(args.candidate))
    confirm_version(codes[1])
    print("PASS instalación, actualización sin desinstalar y arranque en el dispositivo elegido")
    if args.interactive:
        prompt = "Comprueba que se conserva Estudio avanzado. Prueba Crear y el audio en modo avión. Escribe OK: "
        if input(prompt).strip().lower() != "ok":
            raise ValueError("La comprobación manual de datos y audio de la actualización quedó pendiente")
        print("PASS confirmación manual de datos conservados y audio sin conexión")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("baseline", type=Path)
    parser.add_argument("candidate", type=Path)
    parser.add_argument("--sdk", type=Path, default=os.environ.get("ANDROID_HOME") or os.environ.get("ANDROID_SDK_ROOT"))
    parser.add_argument("--build-tools", default="35.0.0")
    parser.add_argument("--serial", help="Instala el par en este dispositivo de prueba autorizado")
    parser.add_argument("--interactive", action="store_true", help="Solicita confirmación de audio offline y conservación del espacio")
    args = parser.parse_args()
    if not args.sdk:
        parser.error("Indica --sdk o ANDROID_HOME")
    if args.interactive and not args.serial:
        parser.error("--interactive requiere --serial")
    tools = args.sdk / "build-tools" / args.build_tools
    first, second = [apk_info(apk, tools) for apk in (args.baseline, args.candidate)]
    if first[0] != second[0] or first[3] != second[3]:
        raise ValueError("Los APK deben tener el mismo ID de paquete y certificado")
    if second[1] <= first[1]:
        raise ValueError("El código de versión del candidato debe superar el inicial")
    print(f"PASS preflight {first[0]} {first[2]} ({first[1]}) → {second[2]} ({second[1]})")
    print(f"Certificado SHA-256 {first[3]}")
    for apk in (args.baseline, args.candidate):
        print(f"APK SHA-256 {hashlib.sha256(apk.read_bytes()).hexdigest()}  {apk.name}")
    if args.serial:
        check_on_device(args, first[0], (first[1], second[1]), executable(args.sdk / "platform-tools", "adb"))


if __name__ == "__main__":
    try:
        main()
    except subprocess.CalledProcessError as error:
        raise SystemExit(error.stdout.strip() or str(error)) from None
    except ValueError as error:
        raise SystemExit(str(error)) from None
