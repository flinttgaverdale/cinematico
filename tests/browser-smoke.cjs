// Browser smoke tests: run with a local HTTP server on port 4173.
// npm install --no-save playwright && npx playwright install chromium
// node tests/browser-smoke.cjs
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const BASE = process.env.CINEMATICO_TEST_URL || 'http://127.0.0.1:4173/';
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const viewport of [{width:1280,height:900},{width:390,height:844}]) {
      const context = await browser.newContext({viewport,serviceWorkers:'block'});
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(BASE, {waitUntil:'domcontentloaded'});
      // Create is the landing experience. The full studio must be opt-in and retained.
      assert.equal(await page.locator('body').getAttribute('data-workspace'), 'explore');
      assert.ok(await page.locator('#simpleChords').isVisible(), 'Create progression is primary on first visit');
      assert.ok(!(await page.locator('#circle').isVisible()), 'Reference study is hidden while composing');
      assert.equal(await page.locator('[data-quick-intent]').count(), 4, 'Only four quick directions');
      assert.equal(await page.locator('[data-quick-intent="esperanza"]').getAttribute('aria-pressed'), 'true');
      assert.equal((await page.locator('[data-quick-intent="esperanza"]').innerText()).trim(),'Apertura / esperanza','Initial action must convey a musical intention rather than opening a file');
      assert.ok((await page.locator('#simpleIntentHelp').innerText()).includes('no una orden para abrir algo'),'A short explanation must be available without opening help');
      await page.locator('[data-quick-intent="suspense"]').click();
      assert.ok((await page.locator('#simpleIntentHelp').innerText()).includes('Aplaza'),'Short meaning updates with the selected intention');
      await page.locator('[data-quick-intent="esperanza"]').click();
      assert.equal(await page.locator('[data-quick-intent="esperanza"]').getAttribute('aria-pressed'),'true');
      assert.ok(!(await page.locator('#simpleMood').isVisible()), 'Fifteen detailed nuances are progressive disclosure');
      assert.deepEqual(await page.locator('#simpleMood optgroup').evaluateAll(groups=>groups.map(g=>g.label)),
        ['Luz y expansión','Calma y cercanía','Melancolía y sombra','Tensión e incertidumbre','Cambio y asombro'],
        'Optional nuances are grouped by expressive proximity without adding more decisions');
      assert.equal(await page.locator('#simpleMood option').count(),15,'All previous nuanced directions remain available');
      assert.equal(await page.locator('#simpleChords').inputValue(), '', 'Example chords are placeholders, not assumed user music');
      await page.locator('#workspaceAdvanced').click();
      assert.equal(await page.locator('body').getAttribute('data-workspace'), 'advanced');
      assert.equal(await page.locator('body').getAttribute('data-study'),'home','Advanced studio opens its three-way menu');
      assert.ok(await page.locator('#advancedNavigation').isVisible(),'Advanced area selection is visible');
      assert.ok(!(await page.locator('#userChords').isVisible()),'Progression does not open automatically');
      assert.ok(!await page.locator('#circle').isVisible(), 'Reference study is also optional');
      assert.equal(await page.locator('[data-study-open]').count(),3,'Study is organized around three focused tasks');
      assert.equal(await page.locator('[data-study-open][aria-pressed="true"]').count(),0,'No study area preselected');
      assert.notEqual(await page.evaluate(()=>document.activeElement.id),'userChords','Do not focus the progression or open mobile keyboard');
      assert.equal(await page.locator('#save').count(),0,'No notebook button in a composing companion');
      assert.equal(await page.locator('#savedList').count(),0,'No notebook management UI');
      assert.ok(!await page.locator('#studyVoicesDetails').evaluate(el=>el.open),'Own voice lab begins collapsed');
      await page.locator('[data-study-open="inspire"]').click();
      assert.ok(await page.locator('#circle').isVisible(),'Circle of fifths is available when requested');
      assert.ok(await page.locator('.reference-flow').isVisible(),'Independent reference section remains');
      assert.ok(await page.locator('#keyCaption').isVisible(), 'Reference key must be visible');
      assert.ok(await page.locator('#composer').count(), 'Composer reference selector must exist');
      assert.ok(await page.locator('#userTonalReading').count(), 'Tonal analysis panel must exist');
      // Deep composer-lens regression: independent reference, transposed and changing automatically.
      assert.equal(await page.locator('.composer-path-card').count(),2);
      for(const composer of ['williams','herrmann','zimmer','giacchino','elfman','silvestri','horner','shore','morricone','newman','goransson']){
        await page.locator('#composer').selectOption(composer);
        assert.equal(await page.locator('.composer-path-card').count(),2,composer);
        assert.ok((await page.locator('#composerExplorations').innerText()).includes('Dos caminos para explorar'),composer);
        assert.equal(await page.locator('#composerHere').inputValue(),composer);
      }
      await page.locator('#composer').selectOption('silvestri');
      const originalRoute=await page.locator('.composer-path-card').first().innerText();
      assert.ok(originalRoute.includes('Cmaj7#11'),originalRoute);
      await page.locator('#quickKey').selectOption('G');
      assert.ok((await page.locator('.composer-path-card').first().innerText()).includes('Gmaj7#11'));
      assert.ok(!(await page.locator('.composer-path-card').first().innerText()).includes('Cmaj7#11'));
      await page.locator('#quickKey').selectOption('C');
      await page.locator('#composerHere').selectOption('horner');
      assert.ok((await page.locator('.composer-path-card').first().innerText()).includes('Em'),'Horner transforms a C triad to Em');
      assert.equal(await page.locator('#composer').inputValue(),'horner');
      assert.equal(await page.locator('.composer-path-operator').count(),6,'Both Horner paths show three precise transformations');
      assert.deepEqual(await page.locator('.composer-path-card').first().locator('.composer-path-operator').allTextContents(),['P','L','R']);
      await page.locator('.composer-path-card').first().locator('.composer-path-analysis summary').click();
      const detail=await page.locator('.composer-path-card').first().locator('.composer-path-analysis').innerText();
      assert.ok(detail.includes('E♭ → E'),'Paralela moves only minor to major third');
      assert.ok(detail.includes('C → B'),'L moves only a semitone');
      assert.ok(detail.includes('E → D'),'R moves only a whole tone');
      assert.ok(detail.includes('no se han supuesto octavas'),'Do not invent real voicings');
      assert.ok((await page.locator('.composer-path-contrast').innerText()).length>30);
      // Deterministic Web Audio adapter: verifies user-initiated play/stop, not acoustic realism.
      await page.evaluate(()=>{
        window.__previewStats={opened:0,closed:0,notes:0};
        window.AudioContext=class FakeAudioContext{
          currentTime=0;destination={};
          constructor(){window.__previewStats.opened++;}
          createGain(){return {gain:{value:0,setValueAtTime(){},linearRampToValueAtTime(){}},connect(){}};}
          createOscillator(){window.__previewStats.notes++;return {type:'',frequency:{value:0},connect(){},start(){},stop(){}};}
          resume(){return Promise.resolve();}
          close(){window.__previewStats.closed++;return Promise.resolve();}
        };
      });
      assert.equal(await page.locator('.composer-audio-button').count(),2);
      await page.locator('[data-composer-preview="0"]').click();
      assert.equal(await page.locator('[data-composer-preview="0"]').getAttribute('aria-pressed'),'true');
      assert.ok((await page.locator('#composerListenStatus').innerText()).includes('Escuchando camino 1'));
      assert.equal(await page.evaluate(()=>window.__previewStats.notes),16,'Four chords, four simultaneous tones per event');
      await page.locator('[data-composer-preview="1"]').click();
      assert.equal(await page.locator('[data-composer-preview="0"]').getAttribute('aria-pressed'),'false');
      assert.equal(await page.locator('[data-composer-preview="1"]').getAttribute('aria-pressed'),'true');
      assert.equal(await page.evaluate(()=>window.__previewStats.closed),1);
      await page.locator('[data-composer-preview="1"]').click();
      assert.equal(await page.locator('[data-composer-preview="1"]').getAttribute('aria-pressed'),'false');
      assert.equal(await page.evaluate(()=>window.__previewStats.closed),2);
      await page.locator('[data-composer-preview="0"]').click();
      await page.locator('#quickKey').selectOption('G');
      assert.equal(await page.evaluate(()=>window.__previewStats.closed),3,'Reference changes must stop old preview');
      assert.equal(await page.locator('[data-composer-preview="0"]').getAttribute('aria-pressed'),'false');
      await page.locator('#quickKey').selectOption('C');

      assert.ok((await page.locator('.composer-path-contrast').innerText()).includes('P–L–R frente a R–L–P'),'Horner A/B must reveal transformation order');
      await page.locator('#composer').selectOption('giacchino');
      const giacchinoContrast=await page.locator('.composer-path-contrast').innerText();
      assert.ok(giacchinoContrast.includes('misma secuencia de fundamentales'),'Giacchino paths share chord roots');
      assert.ok(giacchinoContrast.includes('extensiones de color'),'Giacchino difference is extension color');
      await page.locator('#composerEqualChordDuration').check();
      assert.ok((await page.locator('.composer-audio-actions').first().innerText()).includes('10 s'),'Five chords take ten seconds at a fixed two-second harmonic pulse');
      await page.locator('#composerEqualChordDuration').uncheck();
      assert.ok((await page.locator('.composer-audio-actions').first().innerText()).includes('8 s'),'Default A/B returns to matched phrase duration');
      await page.locator('#composer').selectOption('horner');

      assert.equal(await page.locator('#userChords').inputValue(),'',"Reference exercises must not overwrite the user progression");

      await page.locator('#workspaceExplore').click();
      await page.locator('#simpleChords').fill('Am F C G');
      await page.locator('[data-quick-intent="contraste"]').click();
      assert.equal(await page.locator('[data-quick-intent="contraste"]').getAttribute('aria-pressed'),'true');
      assert.equal(await page.locator('#simpleMood').inputValue(),'contraste');
      await page.locator('#simpleExplore').click();
      assert.equal(await page.locator('.simple-path').count(),3);
      assert.equal(await page.locator('.simple-start-chips').count(),1,'Source progression is shown once, not copied into each alternative');
      assert.equal(await page.locator('.simple-path .simple-chips .new').count(),9,'Only three added chords per path');
      assert.equal(await page.locator('.simple-path details[open]').count(),0,'Detailed theory starts collapsed');
      assert.equal(await page.locator('[data-simple-preview]').count(),3,'A neutral listening option for each alternative');
      const notesBefore=await page.evaluate(()=>window.__previewStats.notes);
      await page.locator('[data-simple-preview="0"]').click();
      assert.equal(await page.locator('[data-simple-preview="0"]').getAttribute('aria-pressed'),'true');
      assert.equal(await page.evaluate(()=>window.__previewStats.notes)-notesBefore,20,
        'Two original chords and three new chords, four synthesized voices each');
      assert.ok((await page.locator('#simpleListenStatus').innerText()).includes('últimos 2 acordes'));
      const closedBefore=await page.evaluate(()=>window.__previewStats.closed);
      await page.locator('[data-simple-preview="1"]').click();
      assert.equal(await page.evaluate(()=>window.__previewStats.closed),closedBefore+1,
        'Switching proposal must stop the previous playback');
      assert.equal(await page.locator('[data-simple-preview="0"]').getAttribute('aria-pressed'),'false');
      await page.locator('[data-quick-intent="suspense"]').click();
      assert.equal(await page.evaluate(()=>window.__previewStats.closed),closedBefore+2,
        'Changing direction must stop playback immediately');
      assert.equal(await page.locator('.simple-path').count(),0,'Changed intent invalidates stale proposals');
      assert.equal(await page.locator('[data-quick-intent="suspense"]').getAttribute('aria-pressed'),'true');
      await page.locator('#simpleNuances summary').click();
      await page.locator('#simpleMood').selectOption('misterio');
      assert.equal(await page.locator('[data-quick-intent][aria-pressed="true"]').count(),0,'Custom nuance is not misrepresented by one of four presets');
      // Direct navigation must carry unsent edits into advanced mode.
      await page.locator('#simpleChords').fill('Dm G7 C');
      await page.locator('#workspaceAdvanced').click();
      assert.equal(await page.locator('#userChords').inputValue(), 'Dm G7 C');
      assert.equal(await page.locator('body').getAttribute('data-study'),'home','Ordinary access returns to area selection');
      assert.ok(!await page.locator('#userChords').isVisible(),'Synced unsent progression remains hidden until selected');
      assert.notEqual(await page.evaluate(()=>document.activeElement.id),'userChords','No automatic focus after sync');
      await page.locator('[data-study-open="chords"]').click();
      assert.ok(await page.locator('#userChords').isVisible(),'Progression editor opens only on request');
      assert.ok(!(await page.locator('#circle').isVisible()),'Reference wheel stays out of the progression workflow');
      await page.locator('#studyTonalDetails > summary').click();
      assert.ok((await page.locator('#userTonalReading').innerText()).includes('Do') || (await page.locator('#userTonalReading').innerText()).includes('C mayor'), 'Cadential tonal hypothesis must render when expanded');
      await page.locator('#workspaceExplore').click();
      await page.locator('#simpleChords').fill('Am F C G');
      await page.locator('#simpleExplore').click();
      assert.equal(await page.locator('.simple-path').count(), 3);
      const noOverflow=await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+2);
      assert.ok(noOverflow,'Create should not overflow its viewport width');
      await page.locator('.simple-path [data-open-advanced]').first().click();
      assert.equal(await page.locator('body').getAttribute('data-workspace'), 'advanced');
      assert.equal(await page.locator('body').getAttribute('data-study'),'chords','Explicit Choose and analyze goes to chords');
      assert.ok(await page.locator('#userChords').isVisible(),'Explicit analytical request shows the progression');
      assert.equal((await page.locator('#userChords').inputValue()).split(' ').length, 7);
      assert.equal((await page.locator('#simpleChords').inputValue()).split(' ').length, 7);
      assert.equal(await page.locator('#save').count(),0);
      assert.equal(await page.locator('#savedList').count(),0);
      // A user playing an instrument does not have to manage saved ideas.
      await page.locator('#workspaceExplore').click();
      await page.locator('#simpleChords').fill('C G Am F');
      await page.locator('#simpleExplore').click();
      assert.equal(await page.locator('.simple-path').count(), 3);
      await page.locator('#simpleNuances').evaluate(el=>{el.open=true});
      await page.locator('#simpleMood').selectOption('calma');
      assert.equal(await page.locator('.simple-path').count(), 0, 'Old paths must be cleared');
      await page.locator('#simpleChords').fill('H invalid');
      await page.locator('#simpleExplore').click();
      assert.equal(await page.locator('.simple-path').count(), 0);
      assert.ok((await page.locator('#simpleFeedback').innerText()).length > 0);
      await page.locator('#simpleChords').fill(Array(6).fill('Am').join(' '));
      await page.locator('#simpleExplore').click();
      assert.equal(await page.locator('.simple-path').count(), 3);
      assert.equal(await page.locator('.simple-path [data-open-advanced]:disabled').count(), 3);
      // Contextual harmonic interpretation: accepted color in cinematic mode, strict classical review.
      await page.locator('#workspaceAdvanced').click();
      assert.equal(await page.locator('body').getAttribute('data-study'),'home');
      await page.locator('[data-study-open="chords"]').click();
      await page.locator('#userChords').fill('G7 Cmaj7');
      await page.locator('#userAnalyze').click();
      await page.locator('#studyVoicesDetails > summary').click();
      await page.locator('#labVoiceCount').selectOption('4');
      await page.locator('#labVoiceStyle').selectOption('cinematic');
      assert.ok((await page.locator('#labVoiceOutput .vl-tone-note').innerText()).includes('séptima mayor'),'Retained major seventh must be explained');
      await page.locator('#labVoiceStyle').selectOption('classical');
      assert.equal(await page.locator('#labVoiceOutput .vl-tone-note').count(),0,'Classical style should not mark the held leading tone as accepted color');
      assert.ok((await page.locator('#labVoiceOutput').textContent()).includes('sensible sin resolución ascendente'),'Classical view must disclose strict tension');
      await page.locator('#labVoiceCount').selectOption('3');
      await page.locator('#labVoiceStyle').selectOption('cinematic');
      assert.ok((await page.locator('#labVoiceOutput .vl-tone-note').innerText()).includes('séptima mayor'),'The three-voice laboratory shares the same contextual analysis');
      await page.locator('#labVoiceStyle').selectOption('classical');
      assert.equal(await page.locator('#labVoiceOutput .vl-tone-note').count(),0);
      await page.locator('#userChords').fill('Cadd9 Fmaj7');
      await page.locator('#userAnalyze').click();
      assert.ok(!(await page.locator('#labVoiceOutput').textContent()).includes('sensible sin resolución ascendente'),'A diatonic I–IV must not be mistaken for a V/IV');
      // New chromatic slash-bass notation must reach the visible voice laboratory intact.
      await page.locator('#userChords').fill('C/Bb G7sus4 G7 C');
      await page.locator('#userAnalyze').click();
      assert.ok((await page.locator('#userChords').inputValue()).includes('C/Bb'));
      assert.ok(!(await page.locator('#userFeedback').innerText()).includes('Acorde no reconocido'),
        'An independent bass is valid, not a syntax error');
      const actualLab=await page.locator('#labVoiceOutput').textContent();
      const actualFeedback=await page.locator('#userFeedback').textContent();
      assert.ok(actualLab.includes('C/Bb'),
        'The voice laboratory should display the original slash chord. Actual lab: '+actualLab.slice(0,500)+' | Feedback: '+actualFeedback);
      await page.locator('#userChords').fill('Bb C/Bb F/A G(sus4) G C(sus4) C');
      await page.locator('#userAnalyze').click();
      assert.ok(!(await page.locator('#userFeedback').innerText()).includes('Acorde no reconocido'),
        'Printed score notation G(sus4) must be parsed, not treated as malformed');
      assert.ok((await page.locator('#labVoiceOutput').textContent()).includes('G(sus4)'),
        'The printed suspension symbol must survive exact notation round-trip');
      await page.locator('[data-study-open="tools"]').click();
      const neoDetail=page.locator('.study-tool').filter({has:page.locator('#neoOperation')});
      await neoDetail.locator('summary').first().click();
      await page.locator('#neoOperation').selectOption('S');
      assert.ok((await page.locator('#neoResult').innerText()).includes('SLIDE'),
        'SLIDE must render two voice movements without a browser exception');
      assert.deepEqual(errors, [], 'Browser errors: ' + errors.join('; '));
      await context.close();
      console.log('PASS browser',viewport.width,'px');
    }
  } finally { await browser.close(); }
})().catch(err=>{console.error(err);process.exitCode=1;});
