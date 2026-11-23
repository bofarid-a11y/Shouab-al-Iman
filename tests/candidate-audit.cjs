const fs=require('fs');const {JSDOM,VirtualConsole}=require('jsdom');const assert=require('assert');
const path = process.argv[2];
if (!path) throw new Error('Gebruik: node tests/candidate-audit.cjs /pad/naar/uitgepakte-candidate/lesson.html');
const html=fs.readFileSync(path,'utf8');
let issues=[]; let checks=0;
for (const lang of ['NL','AR']) for (const grade of [3,4,5,6,7,8]) {
 const errors=[]; const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(html,{url:`https://test.invalid/lesson.html?grade=G${grade}&lang=${lang}`,runScripts:'dangerously',virtualConsole:vc,beforeParse(w){w.matchMedia=()=>({matches:true,addEventListener(){},removeEventListener(){}});w.HTMLMediaElement.prototype.pause=function(){w.audioPaused=true};w.HTMLMediaElement.prototype.play=function(){w.audioPlayed=this.getAttribute('src');return Promise.resolve()}}});
 const d=dom.window.document, q=s=>d.querySelector(s);
 try {
  assert.equal(d.documentElement.lang,lang.toLowerCase());assert.equal(q('#grade').value,String(grade));
  assert(q('#story').textContent.trim());assert.equal(d.querySelectorAll('#quizOptions input').length,3);
  assert(q('#checkAnswer').textContent.trim()); assert(q('#needHelp').textContent.trim()); assert(q('#activityDone').textContent.trim());
  assert(q('#activitySkip').textContent.trim()); assert(!q('#foot')); assert(q('#sub').textContent.includes(lang === 'NL' ? 'Proefles' : 'تجريبي'));
  assert(!d.body.textContent.includes('CUR001 · v0.4 CANDIDATE')); assert(!d.body.textContent.includes('niet-goedgekeurde demonstratie'));
  q('#activityDone').click(); assert(q('#feedback').textContent.trim()); q('#activitySkip').click(); assert(q('#feedback').textContent.trim());
  assert(q('#evaluate').href.includes(`reviewGrade=${grade}&reviewLang=${lang}`));
  q('#checkAnswer').click();assert(q('#feedback').textContent.trim());
  d.querySelectorAll('#quizOptions input')[1].checked=true; q('#checkAnswer').click();assert(!q('#tryAgain').hidden);assert(q('#feedback').textContent.trim());
  q('#tryAgain').click();assert(!d.querySelector('input[name=lessonChoice]:checked'));
  d.querySelectorAll('#quizOptions input')[0].checked=true; q('#checkAnswer').click();assert(!q('#reflection').hidden);assert(q('#feedback').textContent.trim());
  const recorded=JSON.parse(q('#recordedStories').textContent);assert.equal(recorded[`${grade}-${lang}`],q('#story').textContent);
  assert(fs.existsSync(require('path').join(require('path').dirname(path),`assets/lesson-audio/CUR001-L01-G${grade}-${lang}-07x.mp3`)));
  q('#speak').click();assert.equal(dom.window.audioPlayed,`assets/lesson-audio/CUR001-L01-G${grade}-${lang}-07x.mp3`);assert(!q('#storyAudio').hidden);
  q('#grade').value=String(grade===3?4:3);q('#grade').dispatchEvent(new dom.window.Event('change'));assert(q('#storyAudio').hidden);assert(!q('#storyAudio').getAttribute('src'));
  assert.deepEqual(errors,[]);checks++;
 }catch(e){issues.push(`${grade}-${lang}: ${e.message}; JS errors: ${errors.join('; ')}`)}
 dom.window.close();
}
console.log(JSON.stringify({variantsPassed:checks,issues},null,2));if(issues.length)process.exitCode=1;
