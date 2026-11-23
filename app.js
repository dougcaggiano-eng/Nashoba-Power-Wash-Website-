(function(){
'use strict';
var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
var $ = function(s,r){return (r||document).querySelector(s)};
var $$ = function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};

/* ---------------- service data (from BUSINESS_PROFILE) ---------------- */
var SERVICES = [
 {id:'house-wash', part:'siding', kind:'siding', short:'House wash', title:['House','Wash.'], sub:'Vinyl siding',
  line:'Rinsed first. Foamed from the ground up. Rinsed from the top down.',
  meta:[['Typical time','about 3–4 hours'],['Surface','vinyl siding']],
  steps:[
   ['look','Walk-through and game plan','We agree on exactly which sides and areas get washed. I also check the siding: heavily oxidized, broken or old unpainted siding can be damaged by washing, so I\'ll tell you up front.'],
   ['rinse','Pre-rinse everything','Siding, windows and plants get wet down with plain water first. Putting the cleaning solution on a dry surface can react badly and leave permanent marks.'],
   ['foam','Foam on, from the ground up','A bleach solution goes on through a foam cannon, working bottom to top so it doesn\'t leave uneven streaks. Tight spots get a pump sprayer for precision.'],
   ['dwell','Let it work','The solution sits long enough to kill the mold and loosen the grime instead of just blasting at it.'],
   ['rinse','Rinse from the top down','I rinse from the roofline down, spraying almost parallel to the siding so the solution gets kicked off clean.'],
   ['final','Protect what\'s around it','Windows, plants and every run-off point get a thorough final rinse so nothing builds up or leaves those annoying window stains.']
  ],
  care:['Fabric (cushions, awnings, flags) is kept away from the cleaning solution.','Windows are rinsed so they don\'t streak or stain.','Working near a pool? Some dirt may get in, and I\'ll tell you first.']},
 {id:'patio', part:'patio', kind:'pavers', short:'Patio', title:['Patio','Restored.'], sub:'Paver patio cleaning & restoration',
  line:'My favorite job. Every joint cleaned out, then re-sanded.',
  meta:[['Cleaning','same day'],['Restoration','2–3 days (drying time)']],
  steps:[
   ['look','Clear it and plan it','Furniture comes off and we go over exactly what you want: a clean, or a full restoration with new polymeric sand.'],
   ['rinse','Pre-rinse and treat','The pavers get wet down, then the mold and grime get treated so they release instead of smearing.'],
   ['surface','Surface cleaner pass','A rounded surface cleaner runs over the pavers for an even clean with no wand stripes.'],
   ['blast','Blast the joints','The mold and old sand come out of every joint. This is what makes it look brand new.'],
   ['dry','Let it dry, fully','For a restoration the patio has to dry completely before sanding. That\'s why it takes 2–3 days.'],
   ['sand','Sweep in polymeric sand','Polymeric sand gets swept into the joints and set, locking the pavers in and holding back weeds.']
  ],
  care:['Plants around the patio are rinsed so cleaning solution doesn\'t sit on them.','Pavers dry fully before sanding so the sand sets properly.']},
 {id:'deck', part:'deck', kind:'boards', short:'Deck', title:['Composite','Deck.'], sub:'Composite deck cleaning',
  line:'The right amount of pressure, and no more.',
  meta:[['Typical time','about 2–3 hours'],['Surface','composite decking']],
  steps:[
   ['look','Check the boards','I look over the deck first. A chewed-up or failing wooden deck can be damaged further by washing, so I won\'t wash one.'],
   ['rinse','Pre-rinse','The deck and the plants around it get wet down with water first.'],
   ['foam','Treat mold and grime','Problem areas are treated with a pump sprayer so the solution goes only where it\'s needed.'],
   ['surface','Careful, controlled clean','The boards are cleaned with controlled pressure along the grain.'],
   ['final','Thorough rinse','Boards, railings and the ground below get a full rinse.']
  ],
  care:['Plants and nearby surfaces are rinsed to protect them.','Furniture cushions are moved away from the cleaning solution.']},
 {id:'fence', part:'fence', kind:'fence', short:'Fence', title:['Fence','Cleaning.'], sub:'Fence cleaning',
  line:'A turbo nozzle, and a light touch on anything wood.',
  meta:[['Typical time','depends on length'],['Pricing','usually by the hour']],
  steps:[
   ['look','Walk the fence line','We agree on which sections and which sides get cleaned, and I check what the fence is made of.'],
   ['rinse','Pre-rinse','The fence and the plants along it get wet down first.'],
   ['blast','Turbo nozzle clean','A turbo nozzle strips the green and grime off quickly. On wood I\'m extra careful, because a little too much pressure will hurt it.'],
   ['final','Rinse the run-off','The fence line, plants and ground get a final rinse.']
  ],
  care:['Cleaning solution is kept away from wood.','Pressure is kept low on wood to avoid fuzzing or gouging.']},
 {id:'walkway', part:'walkway', kind:'concrete', short:'Walkway & stairs', title:['Walkway','& Stairs.'], sub:'Mold & grime removal',
  line:'The first thing guests see, and the first thing to go green.',
  meta:[['Typical time','quoted on site'],['Surfaces','walkways, front steps']],
  steps:[
   ['look','Plan it out','We go over exactly which paths and steps you want cleaned.'],
   ['rinse','Pre-rinse','The walkway, steps and nearby plants get wet down first.'],
   ['foam','Treat the mold','A pump sprayer puts the solution right where the mold is.'],
   ['surface','Clean the runs and the edges','Flat runs get the surface cleaner, and the step edges and risers get detailed with the wand.'],
   ['final','Final rinse','Everything is rinsed, including the low spots where water collects.']
  ],
  care:['Plants along the path are rinsed to protect them.','Run-off points are checked so solution doesn\'t pool.']},
 {id:'any-surface', part:'other', kind:'concrete', short:'Any other surface', title:['Any Other','Surface.'], sub:'Mold & grime removal, on request',
  line:'Siding and decks are the main jobs, but any surface that needs it, I can do.',
  meta:[['Examples','driveways, trim, steps, walls'],['Time','quoted on site']],
  steps:[
   ['look','Tell me exactly what you want','Be specific: which surface, which areas, and what bothers you about it.'],
   ['look','I check the surface','If washing could damage it, I\'ll tell you before we start.'],
   ['surface','The right method for the surface','Surface cleaner, turbo nozzle or a soft wash, matched to the material.'],
   ['final','Thorough rinse','Plants, windows and run-off points are rinsed so nothing is left behind.']
  ],
  care:['Each surface gets the gentlest method that does the job.']}
];
var LABELS={siding:'House wash · siding',patio:'Patio cleaning & restoration',deck:'Composite deck',fence:'Fence cleaning',walkway:'Walkway & stairs',other:'Any other surface · driveway & trim'};
var PARTS = {}; SERVICES.forEach(function(s,i){PARTS[s.part]={label:LABELS[s.part], sec:s.id, idx:i}});

/* ---------------- build service sections ---------------- */
function esc(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;')}
var host = $('#services'), html='';
SERVICES.forEach(function(s,i){
  var n=('0'+(i+1)).slice(-2), tot=('0'+SERVICES.length).slice(-2);
  html+='<section class="svc" id="'+s.id+'" data-part="'+s.part+'" data-view="'+s.part+'" data-name="'+esc(s.short)+'" aria-labelledby="h-'+s.id+'"><div class="wrap"><div class="col">'+
   '<div class="svc-head"><span class="num reveal"><b>'+n+'</b> / '+tot+'</span><div class="kicker reveal">'+esc(s.sub)+'</div>'+
   '<h2 class="display reveal" id="h-'+s.id+'"><span class="g-white" style="display:block">'+s.title[0]+'</span><span class="g-blue" style="display:block">'+s.title[1]+'</span></h2>'+
   '<p class="serif reveal">'+esc(s.line)+'</p>'+
   '<div class="meta reveal">'+s.meta.map(function(m){return '<span><em>'+m[0]+'</em>'+m[1]+'</span>'}).join('')+'</div></div>'+
   '<ol class="steps">'+s.steps.map(function(st,k){return '<li class="step" data-fx="'+st[0]+'"><div class="card panel"><span class="sn">STEP '+('0'+(k+1)).slice(-2)+'</span><h3>'+esc(st[1])+'</h3><p>'+esc(st[2])+'</p></div></li>'}).join('')+'</ol>'+
   '<div class="care panel reveal"><h4>How I protect your property</h4><ul>'+s.care.map(function(c){return '<li>'+esc(c)+'</li>'}).join('')+'</ul></div>'+
   '<div class="svc-end">'+
    '<!-- TODO (Doug): replace with real '+esc(s.short)+' before/after photos (labels stay just "Before" / "After"). -->'+
    '<div class="ba reveal todo" data-kind="'+s.kind+'"><div class="layer before"></div><div class="layer after"></div><div class="bar"></div><span class="tag b">Before</span><span class="tag a">After</span><span class="soon">Real job photo coming soon</span><input type="range" min="0" max="100" value="50" aria-label="Drag to compare before and after, '+esc(s.short)+'"></div>'+
    '<div class="row"><a class="btn" href="#quote" data-pick="'+s.part+'">Get your free quote</a><button class="btn ghost back" type="button">↑ Back to the house</button></div>'+
   '</div></div></div></section>';
});
host.outerHTML = html;

/* part buttons + form checkboxes */
var pb=$('#partButtons'), pc=$('#partChecks');
Object.keys(PARTS).forEach(function(k){
  var li=document.createElement('li'); li.innerHTML='<button type="button" data-goto="'+k+'">'+PARTS[k].label+'</button>'; pb.appendChild(li);
  var l=document.createElement('label'); l.innerHTML='<input type="checkbox" name="parts" value="'+k+'"> '+PARTS[k].label; pc.appendChild(l);
});
function pick(part){var c=$('#partChecks input[value="'+part+'"]'); if(c) c.checked=true;}

/* header menus: Services + Locations */
var svcMenu=$('#svcMenu'), townMenu=$('#townMenu');
SERVICES.forEach(function(s,i){var li=document.createElement('li');
  li.innerHTML='<button type="button" class="menu-item" data-svc="'+s.part+'"><span class="n">'+('0'+(i+1)).slice(-2)+'</span><span>'+esc(s.short)+'<small>'+esc(s.sub)+'</small></span></button>';
  svcMenu.appendChild(li);});
$$('.towns span:not(.more)').forEach(function(sp){var t=sp.textContent, li=document.createElement('li');
  li.innerHTML='<button type="button" class="menu-item" data-town="'+esc(t)+'"><span>'+esc(t)+(sp.classList.contains('home')?'<small>Home base</small>':'')+'</span></button>';
  townMenu.appendChild(li);});
var tabBtns=$$('.tab-btn');
function menuOf(b){return document.getElementById(b.getAttribute('aria-controls'));}
function closeMenus(except){tabBtns.forEach(function(b){if(b===except)return; b.setAttribute('aria-expanded','false'); menuOf(b).hidden=true;});}
function toggleMenu(b){var open=b.getAttribute('aria-expanded')!=='true'; closeMenus(b); b.setAttribute('aria-expanded',String(open)); menuOf(b).hidden=!open;}
document.addEventListener('keydown',function(e){if(e.key==='Escape'){var o=tabBtns.filter(function(b){return b.getAttribute('aria-expanded')==='true'})[0]; closeMenus(); if(o) o.focus();}});

/* before/after sliders */
$$('.ba').forEach(function(b){var r=$('input',b); var f=function(){b.style.setProperty('--pos',r.value+'%')}; r.addEventListener('input',f); f();});

/* form (demo) */
$('#qform').addEventListener('submit',function(e){
  e.preventDefault(); var f=e.target, msg=$('#formMsg');
  if(!f.checkValidity()){msg.textContent='Please fill in your name, email, town, the details box and the water-source checkbox.'; f.reportValidity&&f.reportValidity(); return;}
  msg.textContent='Thanks! This is a preview, so nothing was sent yet. Once the form is connected, Doug will get your request.';
});
$('#yr').textContent=new Date().getFullYear();

/* reveal */
if('IntersectionObserver' in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}})},{rootMargin:'0px 0px -8% 0px'});
  $$('.reveal').forEach(function(el){io.observe(el)});
} else $$('.reveal').forEach(function(el){el.classList.add('in')});

/* rail */
var sections=$$('main section'), rail=$('#rail');
sections.forEach(function(s){var a=document.createElement('a'); a.href='#'+s.id; a.innerHTML=s.getAttribute('data-name')+'<i></i>'; rail.appendChild(a);});
var orbitUI=$('#orbit');
var railLinks=$$('a',rail), counter=$('#counter'), header=$('#top'), hint=$('#hint'), tapPrompt=$('#tapPrompt');
var promptHidden=false; function hidePrompt(){if(!promptHidden){promptHidden=true; tapPrompt.classList.add('off');}}
function setHdr(){document.documentElement.style.setProperty('--hdr',header.offsetHeight+'px');}
addEventListener('resize',setHdr); setHdr();

/* ---------------- navigation: glide when close, jump instantly when far ---------------- */
function go(el,instant){
  if(!el) return;
  var y=Math.max(0,el.getBoundingClientRect().top+pageYOffset-10);
  if(instant||RM||Math.abs(y-pageYOffset)>innerHeight*2.5){
    var h=document.documentElement, pv=h.style.scrollBehavior; h.style.scrollBehavior='auto';
    window.scrollTo(0,y); h.style.scrollBehavior=pv; readScroll();
  } else window.scrollTo({top:y,behavior:'smooth'});
}

/* ---------------- choose a service: show only that one ---------------- */
var focused=null, chip=$('#focusChip'), svcSecs=SERVICES.map(function(s){return document.getElementById(s.id)});
function setFocus(part){
  focused=part||null;
  SERVICES.forEach(function(s,i){svcSecs[i].classList.toggle('hide',!!focused && s.part!==focused);});
  railLinks.forEach(function(a,i){a.hidden=sections[i].classList.contains('hide');});
  $$('[data-svc]',svcMenu).forEach(function(b){b.classList.toggle('on',b.getAttribute('data-svc')===focused);});
  chip.hidden=!focused; if(focused) $('#focusName').textContent=SERVICES[PARTS[focused].idx].short;
  readScroll();
}
// picked on the 3D house or the hero buttons: glide down into that service
function goTo(part){pick(part); setFocus(part); go(document.getElementById(PARTS[part].sec)); hidePrompt();}
// picked from the Services tab: skip straight there
function focusOn(part){pick(part); setFocus(part); go(document.getElementById(PARTS[part].sec),true); hidePrompt();}
function showAll(){var cur=focused&&document.getElementById(PARTS[focused].sec); setFocus(null); if(cur) go(cur,true);}
function pickTown(t){
  $$('.towns span').forEach(function(sp){sp.classList.toggle('picked',sp.textContent===t);});
  var sel=$('#qform select[name=town]'), has=$$('option',sel).some(function(o){return o.textContent===t;});
  sel.value=has?t:'Other (nearby)';
  var yes=$('#townYes'); yes.hidden=false;
  yes.textContent=t==='Westford'?'Westford is home base. You\'re right next door.':'Yes, I work in '+t+'. Travel is built into your quote, so there are no surprise fees.';
  go($('#area'),true); hidePrompt();
}

document.addEventListener('click',function(e){
  var tb=e.target.closest('.tab-btn'); if(tb){toggleMenu(tb);return;}
  if(!e.target.closest('.menu')||e.target.closest('[data-close]')) closeMenus();
  var sv=e.target.closest('[data-svc]'); if(sv){closeMenus(); focusOn(sv.getAttribute('data-svc')); return;}
  var tw=e.target.closest('[data-town]'); if(tw){closeMenus(); pickTown(tw.getAttribute('data-town')); return;}
  if(e.target.closest('[data-showall]')){closeMenus(); showAll(); return;}
  var g=e.target.closest('[data-goto]'); if(g){goTo(g.getAttribute('data-goto'));return;}
  var p=e.target.closest('[data-pick]'); if(p){pick(p.getAttribute('data-pick'));}
  if(e.target.closest('.back')){go($('#home'));return;}
  var a=e.target.closest('a[href^="#"]'), id=a&&a.getAttribute('href').slice(1);
  if(id){var t=document.getElementById(id); if(t){e.preventDefault(); go(t);}}
});

/* ---------------- scroll state ---------------- */
var state={view:'hero', part:null, fx:null, clean:{}, sand:0};
Object.keys(PARTS).forEach(function(k){state.clean[k]=0});
function readScroll(){
  var vh=innerHeight, mid=vh*0.5, active=sections[0];
  for(var i=0;i<sections.length;i++){var r=sections[i].getBoundingClientRect(); if(r.top<=mid && r.bottom>mid){active=sections[i];break;}}
  state.view=active.getAttribute('data-view')||'wide';
  state.part=active.getAttribute('data-part');
  railLinks.forEach(function(a,i){a.classList.toggle('on',sections[i]===active)});
  var si=SERVICES.findIndex(function(s){return s.id===active.id});
  counter.innerHTML = si>=0 ? '<b>'+('0'+(si+1)).slice(-2)+'</b> / '+('0'+SERVICES.length).slice(-2)+' &nbsp;'+SERVICES[si].short.toUpperCase() : '';
  header.classList.toggle('solid',scrollY>40);
  hint.classList.toggle('off',scrollY>60);
  // camera controls only while looking at the whole house (on phones, only before the hero text scrolls over)
  orbitUI.classList.toggle('off',state.view!=='hero'||(innerWidth<900&&scrollY>40));
  if(scrollY>vh*0.6) hidePrompt();
  // per-service clean progress
  state.fx=null;
  SERVICES.forEach(function(s){
    var sec=document.getElementById(s.id), steps=$$('.step',sec);
    // services that aren't picked stay dirty on the house
    if(sec.classList.contains('hide')){state.clean[s.part]=0; if(s.part==='patio') state.sand=0; return;}
    var a=steps[0].getBoundingClientRect().top - vh*0.7, b=steps[steps.length-1].getBoundingClientRect().bottom - vh*0.45;
    var p = a>0 ? 0 : (b<=0 ? 1 : (-a)/((-a)+b));
    state.clean[s.part]=Math.max(0,Math.min(1,p));
    if(s.part==='patio') state.sand=Math.max(0,Math.min(1,(p-0.8)/0.15));
    if(sec===active){
      steps.forEach(function(st){var r=st.getBoundingClientRect(); var on=r.top<vh*0.62 && r.bottom>vh*0.38; st.classList.toggle('on',on); if(on) state.fx=st.getAttribute('data-fx');});
    }
  });
}
addEventListener('scroll',readScroll,{passive:true}); addEventListener('resize',readScroll);
readScroll();

/* ---------------- 3D ---------------- */
var loader=$('#loader'); function done(){loader.classList.add('done')}
setTimeout(done,2500);
var canvas=$('#stage'), renderer=null;
try{ if(window.THREE){ renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:true,alpha:false,powerPreference:'high-performance'}); } }catch(err){renderer=null}
if(!renderer){document.documentElement.classList.add('nogl'); tapPrompt.style.display='none'; done(); return;}

var MOBILE=innerWidth<900;
var DPR=Math.min(window.devicePixelRatio||1, MOBILE?1.5:2);
renderer.setPixelRatio(DPR);
renderer.outputEncoding=THREE.sRGBEncoding;
renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.12;
renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.setClearColor(0x7ea8d8,1);
var scene=new THREE.Scene();
var camera=new THREE.PerspectiveCamera(34,innerWidth/innerHeight,0.1,500);

/* ---------- helpers ---------- */
var seed=7; function rnd(){seed|=0;seed=seed+0x6D2B79F5|0;var t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}
function C(h){return new THREE.Color(h).convertSRGBToLinear();}
var MAXANI=renderer.capabilities.getMaxAnisotropy();
function canvasTex(w,h,draw,data){var c=document.createElement('canvas');c.width=w;c.height=h;var x=c.getContext('2d');draw(x,w,h);
  var t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=Math.min(8,MAXANI);if(!data)t.encoding=THREE.sRGBEncoding;return t;}
function rep(t,x,y){var c=t.clone();c.repeat.set(x,y);c.needsUpdate=true;return c;}
function noiseFill(x,w,h,base,amp,n){var id=x.getImageData(0,0,w,h),d=id.data;for(var i=0;i<d.length;i+=4){var v=(rnd()-.5)*amp;d[i]=Math.max(0,Math.min(255,d[i]+v));d[i+1]=Math.max(0,Math.min(255,d[i+1]+v));d[i+2]=Math.max(0,Math.min(255,d[i+2]+v));}x.putImageData(id,0,0);}

/* ---------- procedural textures ---------- */
var T={};
// grey-taupe brick pavers, 2m x 2m per tile
T.pavers=canvasTex(512,512,function(x,w,h){x.fillStyle='#4d4943';x.fillRect(0,0,w,h);var bw=51.2,bh=25.6;
  for(var r=0;r<20;r++){var off=(r%2)*bw/2;for(var c=-1;c<11;c++){var g=118+rnd()*34|0,b=g-6-rnd()*8|0;x.fillStyle='rgb('+(g+6)+','+g+','+b+')';x.fillRect(c*bw+off+1.5,r*bh+1.5,bw-3,bh-3);}}
  noiseFill(x,w,h,0,22);});
// red-brown face brick, 2m x 1m per tile
T.brick=canvasTex(512,256,function(x,w,h){x.fillStyle='#a99a87';x.fillRect(0,0,w,h);var bw=56.9,bh=19.7;var cols=['#8a4a33','#9a5a3d','#7b3f2c','#a4653f','#87503a','#6f3a2a'];
  for(var r=0;r<13;r++){var off=(r%2)*bw/2;for(var c=-1;c<10;c++){x.fillStyle=cols[rnd()*cols.length|0];x.fillRect(c*bw+off+2,r*bh+2,bw-4,bh-4);}}
  noiseFill(x,w,h,0,26);});
// stucco / painted render
T.stucco=canvasTex(256,256,function(x,w,h){x.fillStyle='#f2f0ec';x.fillRect(0,0,w,h);noiseFill(x,w,h,0,26);});
T.stuccoB=canvasTex(256,256,function(x,w,h){x.fillStyle='#808080';x.fillRect(0,0,w,h);noiseFill(x,w,h,0,120);},true);
// lawn (late-day golden green), 4m tile
T.grass=canvasTex(512,512,function(x,w,h){x.fillStyle='#6f7a38';x.fillRect(0,0,w,h);
  for(var i=0;i<9000;i++){var g=rnd();x.strokeStyle=g<.5?'rgba(132,140,62,.55)':(g<.8?'rgba(86,98,40,.6)':'rgba(160,150,80,.45)');x.beginPath();var px=rnd()*w,py=rnd()*h;x.moveTo(px,py);x.lineTo(px+(rnd()-.5)*3,py-3-rnd()*5);x.stroke();}
  noiseFill(x,w,h,0,18);});
// composite deck boards (run along x), 2m tile
T.deck=canvasTex(512,512,function(x,w,h){x.fillStyle='#3b3029';x.fillRect(0,0,w,h);var bh=36;for(var r=0;r<15;r++){var g=rnd()*16;x.fillStyle='rgb('+(118+g|0)+','+(98+g|0)+','+(82+g|0)+')';x.fillRect(0,r*bh+2,w,bh-4);
  for(var k=0;k<40;k++){x.fillStyle='rgba(60,45,35,.18)';x.fillRect(rnd()*w,r*bh+4+rnd()*(bh-8),20+rnd()*60,1);}}noiseFill(x,w,h,0,14);});
// wood privacy fence, vertical boards, 2m x 2m
T.fence=canvasTex(512,512,function(x,w,h){x.fillStyle='#5d4632';x.fillRect(0,0,w,h);var bw=36;for(var c=0;c<15;c++){var g=rnd()*22;x.fillStyle='rgb('+(170+g|0)+','+(138+g|0)+','+(104+g|0)+')';x.fillRect(c*bw+1.5,0,bw-3,h);
  for(var k=0;k<30;k++){x.fillStyle='rgba(110,80,55,.22)';x.fillRect(c*bw+3+rnd()*(bw-6),rnd()*h,1,30+rnd()*90);}}noiseFill(x,w,h,0,12);});
// solar panel
T.solar=canvasTex(256,128,function(x,w,h){x.fillStyle='#c9ccd1';x.fillRect(0,0,w,h);x.fillStyle='#0d1830';x.fillRect(3,3,w-6,h-6);x.strokeStyle='rgba(150,170,200,.35)';x.lineWidth=1;
  for(var i=1;i<12;i++){x.beginPath();x.moveTo(3+i*(w-6)/12,3);x.lineTo(3+i*(w-6)/12,h-3);x.stroke();}for(var j=1;j<6;j++){x.beginPath();x.moveTo(3,3+j*(h-6)/6);x.lineTo(w-3,3+j*(h-6)/6);x.stroke();}});
// sectional garage door
T.gdoor=canvasTex(256,256,function(x,w,h){x.fillStyle='#262b32';x.fillRect(0,0,w,h);for(var i=1;i<5;i++){x.fillStyle='#1a1e23';x.fillRect(0,i*h/5-2,w,3);x.fillStyle='#39404a';x.fillRect(0,i*h/5+1,w,1);}noiseFill(x,w,h,0,8);});
// timber front door
T.door=canvasTex(128,256,function(x,w,h){var g=x.createLinearGradient(0,0,w,0);g.addColorStop(0,'#6e3018');g.addColorStop(.5,'#8a4122');g.addColorStop(1,'#6a2d16');x.fillStyle=g;x.fillRect(0,0,w,h);
  for(var i=0;i<120;i++){x.fillStyle='rgba(40,15,5,.18)';x.fillRect(rnd()*w,rnd()*h,1,20+rnd()*60);}x.fillStyle='#c8b9a0';x.fillRect(w-22,h*.5,4,26);});
// black-framed glazing with warm interior; n = vertical panes
var WIN={};
function winTex(n){if(WIN[n])return WIN[n];WIN[n]=canvasTex(512,512,function(x,w,h){
  var g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#ffcf8c');g.addColorStop(.55,'#ffb867');g.addColorStop(1,'#e09445');x.fillStyle=g;x.fillRect(0,0,w,h);
  var rg=x.createRadialGradient(w*.5,h*.35,10,w*.5,h*.35,w*.7);rg.addColorStop(0,'rgba(255,240,210,.55)');rg.addColorStop(1,'rgba(120,60,20,.25)');x.fillStyle=rg;x.fillRect(0,0,w,h);
  // hint of interior: a back wall line + a cabinet silhouette
  x.fillStyle='rgba(120,70,30,.35)';x.fillRect(0,h*.72,w,3);x.fillStyle='rgba(90,50,25,.35)';x.fillRect(w*.15,h*.6,w*.25,h*.25);
  x.fillStyle='#111214';var f=14;x.fillRect(0,0,w,f);x.fillRect(0,h-f,w,f);x.fillRect(0,0,f,h);x.fillRect(w-f,0,f,h);
  for(var i=1;i<n;i++)x.fillRect(i*w/n-5,0,10,h);
  if(n<=2)x.fillRect(0,h*.62,w,8);});return WIN[n];}

/* ---------- grime-aware PBR material ---------- */
var GH=['uniform float uClean,uGrime,uWipe,uTop,uHover,uSel,uTime,uSand,uJoint,uRib,uDirt,uLap;uniform vec3 uRibAxis;varying vec3 vGW;varying vec3 vGN;',
'float gH(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}',
'float gN(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(mix(mix(gH(i),gH(i+vec3(1,0,0)),f.x),mix(gH(i+vec3(0,1,0)),gH(i+vec3(1,1,0)),f.x),f.y),mix(mix(gH(i+vec3(0,0,1)),gH(i+vec3(1,0,1)),f.x),mix(gH(i+vec3(0,1,1)),gH(i+vec3(1,1,1)),f.x),f.y),f.z);}',
'float gF(vec3 p){float a=.5,s=0.;for(int i=0;i<4;i++){s+=a*gN(p);p*=2.03;a*=.5;}return s;}',''].join('\n');
var GMAP=[
'float gA=0.,wet=0.;{',
' if(uRib>.5){float rb=fract(dot(vGW,uRibAxis)/.19);diffuseColor.rgb*=.72+.28*smoothstep(0.,.3,rb)*smoothstep(1.,.62,rb);}',
// vinyl lap siding in world space: 18cm boards, shadow under each overlap, dark butt edge, faint embossed grain
' if(uLap>.5){float lf=fract(vGW.y/.18);float vt=1.-abs(vGN.y);',
'  float ls=(1.035-.07*lf)*(1.-.24*smoothstep(.8,1.,lf))*mix(.62,1.,smoothstep(0.,.045,lf));',
'  ls*=.975+.05*gN(vec3(vGW.x*2.5+vGW.z*2.5,vGW.y*55.,0.));',
'  diffuseColor.rgb*=mix(1.,ls,vt);}',
' float g=gF(vGW*1.1+3.);',
' float hb=(1.-smoothstep(0.,2.6,vGW.y))*.3*(1.-abs(vGN.y));',
' float jn=uJoint*(1.-smoothstep(.06,.14,dot(diffuseColor.rgb,vec3(.333))));',
' float mask=smoothstep(.38-.24*uDirt,.68-.2*uDirt,g+hb+jn*(.55+.5*uDirt))*uGrime;',
' float st=uWipe*smoothstep(.5,.85,gN(vec3((vGW.x+vGW.z)*2.6,vGW.y*.28,0.)))*smoothstep(uTop-1.5,uTop-.05,vGW.y)*(1.-abs(vGN.y));',
' mask=max(mask,st*uGrime*.9);',
' float w=mix(gF(vGW*.55+11.),clamp(1.-vGW.y/uTop,0.,1.)*.78+gF(vGW*.9)*.28,uWipe);',
' float r=uClean*1.32-.06;float remain=smoothstep(r-.05,r+.05,w);gA=mask*remain;',
' vec3 gc=mix(vec3(.018,.03,.008),vec3(.07,.08,.03),gN(vGW*9.))*(.6+.5*gF(vGW*4.));',
' diffuseColor.rgb*=mix(vec3(1.),vec3(.46,.5,.36)*(.8+.4*gF(vGW*.7+5.)),uDirt*remain*uGrime);',
' diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.012,.03,.006),jn*uDirt*remain*uGrime);',
' diffuseColor.rgb=mix(diffuseColor.rgb,gc,gA*(.8+.15*uDirt));',
' diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.33,.27,.17),jn*uSand*(1.-gA)*.85);',
' wet=(1.-smoothstep(0.,.09,abs(w-r)))*step(.002,uClean)*step(uClean,.995)*uGrime;',
' diffuseColor.rgb*=1.-wet*.3;',
'}'].join('\n');
var GROUGH='roughnessFactor=mix(roughnessFactor,1.,gA*.5);roughnessFactor=mix(roughnessFactor,.1,wet);';
var GEM='{float rimG=pow(1.-abs(dot(normalize(normal),normalize(vViewPosition))),2.);totalEmissiveRadiance+=vec3(.12,.45,1.)*(uHover*(.10+rimG*.85)+uSel*rimG*.3*(.6+.4*sin(uTime*3.)));}';
var allMats=[];
function PM(o){
  var m=new THREE.MeshStandardMaterial({color:C(o.color!=null?o.color:0xffffff),roughness:o.rough!=null?o.rough:.85,metalness:o.metal||0,
    map:o.map||null,bumpMap:o.bump||null,bumpScale:o.bumpScale||.02,emissive:o.emMap?new THREE.Color(1,1,1):new THREE.Color(0),emissiveMap:o.emMap||null,emissiveIntensity:o.emk||1,
    envMapIntensity:o.env!=null?o.env:1,side:o.side||THREE.FrontSide});
  var u={uClean:{value:0},uGrime:{value:o.grime?1:0},uWipe:{value:o.wipe||0},uTop:{value:o.top||3.2},uHover:{value:0},uSel:{value:0},uTime:{value:0},uSand:{value:0},
    uJoint:{value:o.joint?1:0},uRib:{value:o.rib?1:0},uLap:{value:o.lap?1:0},uDirt:{value:o.dirt||0},uRibAxis:{value:new THREE.Vector3().fromArray(o.ribAxis||[1,0,0])}};
  m.userData.u=u; if(o.part) m.userData.part=o.part;
  m.onBeforeCompile=function(sh){for(var k in u) sh.uniforms[k]=u[k];
    sh.vertexShader='varying vec3 vGW;varying vec3 vGN;\n'+sh.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\nvGW=(modelMatrix*vec4(transformed,1.)).xyz;vGN=normalize((modelMatrix*vec4(objectNormal,0.)).xyz);');
    sh.fragmentShader=GH+sh.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\n'+GMAP)
      .replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\n'+GROUGH)
      .replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\n'+GEM);};
  allMats.push(m); return m;}

/* ---------- sky + image-based light ---------- */
var SUN=new THREE.Vector3(-.78,.36,.52).normalize();
function skyMaterial(linear){var cv=function(h){var c=new THREE.Color(h);return linear?c.convertSRGBToLinear():c;};
  return new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,depthTest:false,fog:false,uniforms:{top:{value:cv('#2a5a9c')},mid:{value:cv('#86afdc')},hor:{value:cv('#f1d7ae')},gnd:{value:cv('#5b5446')},sun:{value:SUN},k:{value:linear?3.:1.}},
  vertexShader:'varying vec3 vD;void main(){vD=normalize(position);vec4 p=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_Position=p.xyww;}',
  fragmentShader:'uniform vec3 top,mid,hor,gnd,sun;uniform float k;varying vec3 vD;void main(){vec3 d=normalize(vD);float y=d.y;vec3 c=y>0.?mix(mix(hor,mid,smoothstep(0.,.16,y)),top,smoothstep(.16,.9,y)):mix(hor,gnd,smoothstep(0.,-.08,y));float s=max(dot(d,sun),0.);c+=vec3(1.,.78,.5)*(pow(s,6.)*.28+pow(s,900.)*k*2.5);gl_FragColor=vec4(c,1.);}'});}
var sky=new THREE.Mesh(new THREE.SphereGeometry(400,32,16),skyMaterial(false));sky.renderOrder=-1;sky.frustumCulled=false;scene.add(sky);
// image-based light from a painted equirect sky (sky gradient + low warm sun)
(function(){var c=document.createElement('canvas');c.width=512;c.height=256;var x=c.getContext('2d');
  var g=x.createLinearGradient(0,0,0,256);g.addColorStop(0,'#2a5a9c');g.addColorStop(.3,'#6f9bd0');g.addColorStop(.47,'#c9d3d8');g.addColorStop(.5,'#f1d7ae');g.addColorStop(.53,'#7a6e58');g.addColorStop(1,'#4a4236');x.fillStyle=g;x.fillRect(0,0,512,256);
  var u=.5+Math.atan2(SUN.x,-SUN.z)/(2*Math.PI),v=.5-Math.asin(SUN.y)/Math.PI;var rg=x.createRadialGradient(u*512,v*256,1,u*512,v*256,60);
  rg.addColorStop(0,'rgba(255,240,200,1)');rg.addColorStop(.15,'rgba(255,215,150,.8)');rg.addColorStop(1,'rgba(255,200,140,0)');x.fillStyle=rg;x.fillRect(0,0,512,256);
  var t=new THREE.CanvasTexture(c);t.mapping=THREE.EquirectangularReflectionMapping;t.encoding=THREE.sRGBEncoding;
  var pm=new THREE.PMREMGenerator(renderer);scene.environment=pm.fromEquirectangular(t).texture;pm.dispose();t.dispose();})();
scene.fog=new THREE.Fog(0xd9cbb0,70,230);

var sunL=new THREE.DirectionalLight(0xffd3a0,3.1);sunL.position.copy(SUN).multiplyScalar(70);sunL.target.position.set(1,0,-1);scene.add(sunL,sunL.target);
sunL.castShadow=true;sunL.shadow.mapSize.set(MOBILE?1024:2048,MOBILE?1024:2048);
(function(c){c.left=-36;c.right=36;c.top=30;c.bottom=-30;c.near=20;c.far=150;})(sunL.shadow.camera);
sunL.shadow.bias=-.0005;sunL.shadow.normalBias=.03;sunL.shadow.radius=3;
scene.add(new THREE.HemisphereLight(0xb9d1ee,0x4d4232,.35));
var porchL=new THREE.PointLight(0xffc27a,1.1,8,2);porchL.position.set(-.8,2.85,3.35);scene.add(porchL);

/* ---------- materials ---------- */
// vinyl siding (boards drawn in the shader so they line up on every wall)
var mWall  =PM({color:0xd3d0c8,rough:.6,lap:1,part:'siding',grime:1,wipe:1,top:3.2});
var mWallG =PM({color:0xd3d0c8,rough:.6,lap:1,part:'siding',grime:1,wipe:1,top:2.9});
var mGlass =PM({color:0x08090b,emMap:winTex(4),emk:1.25,rough:.06,env:1.3,part:'siding'});
var mGlass2=PM({color:0x08090b,emMap:winTex(2),emk:1.25,rough:.06,env:1.3,part:'siding'});
var mGlass5=PM({color:0x08090b,emMap:winTex(5),emk:1.25,rough:.06,env:1.3,part:'siding'});
var mDoor  =PM({map:T.door,rough:.55,part:'siding'});
var mGDoor =PM({map:T.gdoor,rough:.55,metal:.35,part:'siding'});
var mRoofX =PM({color:0x3b3f45,rough:.48,metal:.55,rib:1,ribAxis:[1,0,0],side:THREE.DoubleSide});
var mRoofZ =PM({color:0x3b3f45,rough:.48,metal:.55,rib:1,ribAxis:[0,0,1],side:THREE.DoubleSide});
var mFascia=PM({color:0x2e3237,rough:.5,metal:.4,part:'other',grime:1});
var mCap   =PM({color:0xdcd8d1,rough:.8,part:'other',grime:1});
var mSolar =PM({map:T.solar,rough:.18,metal:.35,env:1.4});
var mConc  =PM({color:0xb9b3a8,map:rep(T.stucco,2,2),rough:.9,part:'walkway',grime:1});
var mPath  =PM({map:rep(T.pavers,.7,4.3),rough:.9,part:'walkway',grime:1,joint:1});
var mDrive =PM({map:rep(T.pavers,.5,.5),rough:.9,part:'other',grime:1,joint:1});
var mBrickW=PM({map:rep(T.brick,4,2),rough:.9,part:'other',grime:1,joint:0});
var mPaver =PM({map:rep(T.pavers,5,2.5),rough:.88,part:'patio',grime:1,joint:1,dirt:1});
var mDeck  =PM({map:rep(T.deck,3,2.75),rough:.7,part:'deck',grime:1});
var mDeckS =PM({color:0x6e5a49,rough:.7,part:'deck',grime:1});
var mRail  =PM({color:0x2b2f34,rough:.45,metal:.6,part:'deck',grime:1});
var mFence =PM({map:rep(T.fence,1,1),rough:.85,part:'fence',grime:1});
var mPost  =PM({color:0x8a6d52,rough:.85,part:'fence',grime:1});
var mGrass =PM({map:rep(T.grass,110,110),rough:1,env:.6});
var mBark  =PM({color:0x5a5048,rough:.95});
var mLeaf  =PM({color:0x4f6a33,rough:.9,env:.6});
var mLeaf2 =PM({color:0x3e5a2e,rough:.9,env:.6});
var mShrub =PM({color:0x46602f,rough:.9,env:.6});
var mTile  =PM({color:0x9a4b34,rough:.8});
var mNeigh =PM({color:0xb9a48c,rough:.9});
var mPipe  =PM({color:0x2e3237,rough:.5,metal:.4,part:'other',grime:1});
var mLamp  =new THREE.MeshBasicMaterial({color:0xfff1d6});

var pickables=[];
function add(geo,mat,x,y,z,part,ry){var m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);if(ry)m.rotation.y=ry;if(part){m.userData.part=part;pickables.push(m);}scene.add(m);return m;}
function box(w,h,d,x,y,z,mat,part,ry){return add(new THREE.BoxGeometry(w,h,d),mat,x,y,z,part,ry);}
function gable(w,h,len,x,y,z,mat,alongX){var s=new THREE.Shape();s.moveTo(-w/2,0);s.lineTo(w/2,0);s.lineTo(0,h);s.lineTo(-w/2,0);
  var g=new THREE.ExtrudeGeometry(s,{depth:len,bevelEnabled:false});g.translate(0,0,-len/2);var m=new THREE.Mesh(g,mat);if(alongX)m.rotation.y=Math.PI/2;m.position.set(x,y,z);scene.add(m);return m;}
function pitchedRoof(w,h,len,x,y,z,mat,alongX,th){ // two sloped slabs with real thickness + gable-end wall triangles
  th=th||.12;var half=w/2,ang=Math.atan2(h,half),sl=Math.hypot(half,h)+.05;var grp=new THREE.Group();
  [-1,1].forEach(function(sd){var s=new THREE.Mesh(new THREE.BoxGeometry(sl,th,len),mat);s.position.set(sd*half/2,h/2,0);s.rotation.z=-sd*ang;grp.add(s);});
  if(alongX)grp.rotation.y=Math.PI/2;grp.position.set(x,y,z);scene.add(grp);return grp;}
function gableWall(w,h,x,y,z,mat,alongX,depth){var g=gable(w,h,depth,x,y,z,mat,alongX);g.userData.part='siding';pickables.push(g);return g;}
function win(x,y,z,w,h,mat,ry){var m=add(new THREE.PlaneGeometry(w,h),mat,x,y,z,'siding',ry||0);
  var sill=box(w+.12,.05,.14,0,0,0,mFascia,'other');sill.position.set(x,y-h/2-.03,z);sill.rotation.y=ry||0;var off=new THREE.Vector3(0,0,.05).applyAxisAngle(new THREE.Vector3(0,1,0),ry||0);sill.position.add(off);return m;}

/* ---------- ground: lawn + curved paver driveway ---------- */
var ground=new THREE.Mesh(new THREE.CircleGeometry(240,64),mGrass);ground.rotation.x=-Math.PI/2;scene.add(ground);
(function(){var s=new THREE.Shape();
  s.moveTo(9.6,-4.25);s.lineTo(10.6,-3.95);s.lineTo(16.2,-3.95);s.lineTo(22,-3.95);s.lineTo(22,-30);s.lineTo(-26,-30);s.lineTo(-26,-16.5);
  s.quadraticCurveTo(4,-16.5,9.6,-4.25);
  var g=new THREE.ShapeGeometry(s,48);var m=new THREE.Mesh(g,mDrive);m.rotation.x=-Math.PI/2;m.position.y=.015;m.userData.part='other';pickables.push(m);scene.add(m);
  // soldier-course edging along the lawn curve
  var pts=[];var c=new THREE.QuadraticBezierCurve(new THREE.Vector2(-26,16.5),new THREE.Vector2(4,16.5),new THREE.Vector2(9.6,4.25));
  var cp=c.getPoints(60);for(var i=0;i<cp.length-1;i++){var a=cp[i],b=cp[i+1];var L=a.distanceTo(b);var e=new THREE.Mesh(new THREE.BoxGeometry(L+.02,.03,.22),mFascia);
    e.material=mDrive;e.position.set((a.x+b.x)/2,.03,(a.y+b.y)/2+.05);e.rotation.y=-Math.atan2(b.y-a.y,b.x-a.x);scene.add(e);}
})();

/* ---------- house (after the reference photo) ---------- */
var H=3.2;
// left wing with front-facing gable
box(6.5,H,8.5,-7.75,H/2,-.25,mWall,'siding');
gableWall(6.5,1.95,-7.75,H,-.25,mWall,false,8.5);
pitchedRoof(7.3,2.05,9.3,-7.75,H-.02,-.25,mRoofZ,false);
// main body, side gables, ridge along x
box(14,H,7,2.5,H/2,-1,mWall,'siding');
gableWall(7,2.15,2.5,H,-1,mWall,true,14);
pitchedRoof(7.8,2.25,14.6,2.7,H-.02,-1,mRoofX,true);
// right bay with flat parapet front
box(6.5,H+.25,1.45,6.25,(H+.25)/2,3.2,mWall,'siding');
box(6.7,.1,1.65,6.25,H+.3,3.2,mCap,'other');
// covered entry porch: parapet slab + square columns
box(7.6,.42,1.75,-.75,H-.05,3.35,mWall,'siding');
box(7.8,.08,1.95,-.75,H+.2,3.35,mCap,'other');
[-3.05,2.65].forEach(function(x){box(.36,H-.26,.36,x,(H-.26)/2+.2,3.98,mWall,'siding');});
[-2.4,-.2,1.6].forEach(function(x){add(new THREE.CircleGeometry(.07,12),mLamp,x,H-.27,3.35).rotation.x=Math.PI/2;});
// porch floor + step
box(7.6,.2,1.75,-.75,.1,3.35,mConc,'walkway');
box(4.6,.1,.45,-.75,.05,4.45,mConc,'walkway');
// fascia + gutters
box(.12,.18,9.3,-11.35,H-.05,-.25,mFascia,'other');box(.12,.18,9.3,-4.15,H-.05,-.25,mFascia,'other');
box(14.6,.18,.12,2.7,H-.05,-4.85,mFascia,'other');
box(.12,.2,7.6,9.82,H+.05,-1,mFascia,'other');
// downpipes
[[-4.42,4.05],[9.35,3.9],[-11.05,3.9],[9.65,-4.4]].forEach(function(p){box(.09,H,.09,p[0],H/2,p[1],mPipe,'other');});
// solar array on the front roof slope of the main body
(function(){var ang=Math.atan2(2.25,3.9);var g=new THREE.Group();for(var r=0;r<2;r++)for(var c=0;c<6;c++){var p=new THREE.Mesh(new THREE.BoxGeometry(1.0,.05,1.65),mSolar);p.position.set(c*1.05,0,r*1.7);g.add(p);}
  g.rotation.x=ang;g.position.set(3.4,H+2.25-1.0*Math.tan(ang)+.1,0);scene.add(g);})();
// glazing + doors
win(-9.7,1.75,4.02,1.3,1.6,mGlass2);
win(-6.55,1.3,4.02,2.7,2.35,mGlass);
add(new THREE.PlaneGeometry(.9,2.3),mDoor,-2.55,1.35,2.52,'siding');add(new THREE.PlaneGeometry(.9,2.3),mDoor,-1.45,1.35,2.52,'siding');
win(-3.55,1.7,2.52,.6,.8,mGlass2);
win(.85,1.4,2.52,3.1,2.4,mGlass);
win(6.0,1.32,3.94,3.9,2.4,mGlass5);
win(9.52,1.7,.2,1,1.8,mGlass2,Math.PI/2);
win(-11.02,1.75,-1.5,1.3,1.6,mGlass2,-Math.PI/2);win(-11.02,1.75,2.2,1.3,1.6,mGlass2,-Math.PI/2);
win(2.2,1.3,-4.52,3.3,2.35,mGlass,Math.PI);win(-7.75,1.3,-4.52,2.6,2.3,mGlass,Math.PI);win(6.8,1.75,-4.52,1.3,1.6,mGlass2,Math.PI);

/* detached garage */
box(4.6,2.9,5.3,13.3,1.45,1.15,mWallG,'siding');
box(4.9,.18,5.6,13.3,2.99,1.15,mCap,'other');
add(new THREE.PlaneGeometry(3.2,2.3),mGDoor,13.3,1.15,3.81,'siding');

/* entry path across the lawn */
box(1.4,.06,8.6,-.75,.03,8.9,mPath,'walkway');

/* brick boundary walls + planter */
function brickWall(x1,z1,x2,z2,h){var dx=x2-x1,dz=z2-z1,L=Math.hypot(dx,dz);var m=PM({map:rep(T.brick,L/2,h),rough:.9,part:'other',grime:1});
  var w=box(L,h,.25,(x1+x2)/2,h/2,(z1+z2)/2,m,'other',-Math.atan2(dz,dx));var cap=box(L,.06,.32,(x1+x2)/2,h+.03,(z1+z2)/2,m,'other',-Math.atan2(dz,dx));return w;}
brickWall(-16,-16,-16,7,1.9);brickWall(21,-16,21,-1,1.9);brickWall(-16,12.4,-7.5,12.4,.8);brickWall(-7.5,12.4,-7.5,10.8,.8);

/* back yard: paver patio, fire pit, composite deck, timber fence */
box(10,.08,5,2,.04,-7.1,mPaver,'patio');
var weeds=(function(){var n=150,geo=new THREE.ConeGeometry(.035,.16,5);geo.translate(0,.08,0);
  var im=new THREE.InstancedMesh(geo,new THREE.MeshStandardMaterial({color:C(0x4d6b25),roughness:.9}),n),m4=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler();
  for(var i=0;i<n;i++){var z=-9.5+Math.floor(rnd()*48)*.1+.002,x=-2.9+rnd()*9.8;var s=.5+rnd()*1.1;e.set((rnd()-.5)*.6,rnd()*6,(rnd()-.5)*.6);q.setFromEuler(e);
    m4.compose(new THREE.Vector3(x,.08,z),q,new THREE.Vector3(s,s*(.7+rnd()*.8),s));im.setMatrixAt(i,m4);}
  im.castShadow=true;scene.add(im);return im;})();
var pit=new THREE.Mesh(new THREE.CylinderGeometry(.7,.75,.42,24,1,true),PM({map:rep(T.brick,2,.5),rough:.9,side:THREE.DoubleSide}));pit.position.set(5.7,.29,-8.4);scene.add(pit);
var DX=-8,DZ=-7.3,DY=.65;
box(6,.12,5.4,DX,DY,DZ,mDeck,'deck');box(6.05,.5,5.45,DX,DY-.32,DZ,mDeckS,'deck');
[[-2.95,-2.65],[2.95,-2.65],[-2.95,2.65]].forEach(function(p){box(.07,.95,.07,DX+p[0],DY+.5,DZ+p[1],mRail,'deck');});
[[-2.97,0,.06,5.4],[0,-2.67,6,.06]].forEach(function(r){box(r[2],.06,r[3],DX+r[0],DY+.98,DZ+r[1],mRail,'deck');
  var n=Math.round(Math.max(r[2],r[3])/.14);for(var k=1;k<n;k++){var t=-.5+k/n;box(.025,.9,.025,DX+r[0]+(r[2]>1?t*r[2]:0),DY+.5,DZ+r[1]+(r[3]>1?t*r[3]:0),mRail,'deck');}});
for(var s2=0;s2<3;s2++){box(.36,.1,1.6,DX+3.2+s2*.36,DY-.2*(s2+1),DZ+1.5,mDeck,'deck');}
var FZ=-16,FH=1.85;
function fenceRun(x1,z1,x2,z2){var dx=x2-x1,dz=z2-z1,L=Math.hypot(dx,dz),ry=-Math.atan2(dz,dx);var m=PM({map:rep(T.fence,L/2,1),rough:.85,part:'fence',grime:1});
  box(L,FH,.06,(x1+x2)/2,FH/2+.05,(z1+z2)/2,m,'fence',ry);var n=Math.round(L/2.4);for(var k=0;k<=n;k++){var t=k/n;box(.12,FH+.12,.12,x1+dx*t,(FH+.12)/2,z1+dz*t-.06,mPost,'fence');}
  box(L,.08,.08,(x1+x2)/2,FH*.85,(z1+z2)/2-.07,mPost,'fence',ry);box(L,.08,.08,(x1+x2)/2,.3,(z1+z2)/2-.07,mPost,'fence',ry);}
fenceRun(-16,FZ,21,FZ);

/* ---------- vegetation ---------- */
function mergeGeos(list){var pos=[],nor=[];list.forEach(function(g){if(g.index)g=g.toNonIndexed();var p=g.attributes.position.array,n=g.attributes.normal.array;for(var i=0;i<p.length;i++){pos.push(p[i]);nor.push(n[i]);}});
  var bg=new THREE.BufferGeometry();bg.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));bg.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));return bg;}
var UP=new THREE.Vector3(0,1,0);
function gNoise(x,y,z){return .5+.25*Math.sin(x*2.1+y*1.3+z*.7)+.25*Math.sin(z*1.7-y*2.2+x*.9);}
function bareTree(x,z,s){var geos=[];
  function br(p,d,len,rad,depth){var g=new THREE.CylinderGeometry(rad*.72,rad,len,depth>3?7:5,1,true);g.translate(0,len/2,0);
    g.applyMatrix4(new THREE.Matrix4().compose(p,new THREE.Quaternion().setFromUnitVectors(UP,d),new THREE.Vector3(1,1,1)));geos.push(g);
    var e=p.clone().addScaledVector(d,len);if(depth<=0)return;var n=depth>=5?2:(rnd()<.55?2:3);
    for(var i=0;i<n;i++){var nd=d.clone();var ax=new THREE.Vector3(rnd()-.5,0,rnd()-.5).normalize();nd.applyAxisAngle(ax,.38+rnd()*.5);nd.y+=.18;nd.normalize();
      br(e,nd,len*(.7+rnd()*.14),rad*.64,depth-1);}}
  br(new THREE.Vector3(x,0,z),new THREE.Vector3(.06,1,.03).normalize(),2.4*s,.3*s,7);
  var m=new THREE.Mesh(mergeGeos(geos),mBark);scene.add(m);return m;}
bareTree(-12.4,8.6,1.25);bareTree(-21,-6,1.0);
function roundTree(x,z,s,mat){var t=new THREE.Mesh(new THREE.CylinderGeometry(.14*s,.22*s,2.4*s,6),mBark);t.position.set(x,1.2*s,z);scene.add(t);
  var geos=[];for(var i=0;i<6;i++){var g=new THREE.IcosahedronGeometry((1.3+rnd()*.7)*s,2);var p=g.attributes.position,nm=g.attributes.normal,v3=new THREE.Vector3();
    for(var k=0;k<p.count;k++){v3.set(p.getX(k),p.getY(k),p.getZ(k));var j=1+(gNoise(v3.x*.9,v3.y*.9,v3.z*.9)-.5)*.35;nm.setXYZ(k,v3.x,v3.y,v3.z);p.setXYZ(k,v3.x*j,v3.y*j,v3.z*j);}
    for(var k2=0;k2<nm.count;k2++){v3.set(nm.getX(k2),nm.getY(k2),nm.getZ(k2)).normalize();nm.setXYZ(k2,v3.x,v3.y,v3.z);}
    g.translate(x+(rnd()-.5)*2.2*s,(3+rnd()*1.6)*s,z+(rnd()-.5)*2.2*s);geos.push(g);}
  var m=new THREE.Mesh(mergeGeos(geos),mat);scene.add(m);}
roundTree(17,-20,1.3,mLeaf);roundTree(7,-22,1.5,mLeaf2);roundTree(-5,-21,1.2,mLeaf);roundTree(25,-6,1.4,mLeaf2);roundTree(26,6,1.1,mLeaf);roundTree(-24,-20,1.4,mLeaf2);
var shrubG=new THREE.IcosahedronGeometry(.5,1);[[-11.4,4.6],[-10.7,4.7],[9.9,4.4],[10.3,4.1],[-4.3,4.6]].forEach(function(p){var s=new THREE.Mesh(shrubG,mShrub);s.position.set(p[0],.38,p[1]);s.scale.set(1,.8,1);scene.add(s);});
// neighbouring houses beyond the walls (context, like the photo)
function neighbour(x,z,ry){var g=new THREE.Group();var b=new THREE.Mesh(new THREE.BoxGeometry(9,3,8),mNeigh);b.position.y=1.5;g.add(b);
  var r=new THREE.Mesh(new THREE.ConeGeometry(6.9,2.6,4,1),mTile);r.rotation.y=Math.PI/4;r.scale.set(1,1,.88);r.position.y=4.3;g.add(r);g.position.set(x,0,z);g.rotation.y=ry||0;scene.add(g);}
neighbour(-27,4,.1);neighbour(-28,-12,0);neighbour(32,-8,-.15);

/* shadows on everything that is solid */
scene.traverse(function(o){if(o.isMesh&&o!==sky&&o.material!==mLamp){o.castShadow=o!==ground;o.receiveShadow=true;}});

/* ---------------- spray particles ---------------- */
var NP=900, pPos=new Float32Array(NP*3), pA=new Float32Array(NP), pVel=new Float32Array(NP*3), pLife=new Float32Array(NP), pMax=new Float32Array(NP);
for(var q=0;q<NP;q++){pLife[q]=1;pMax[q]=1;pPos[q*3+1]=-50;}
var pGeo=new THREE.BufferGeometry(); pGeo.setAttribute('position',new THREE.BufferAttribute(pPos,3)); pGeo.setAttribute('a',new THREE.BufferAttribute(pA,1));
var pMat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,
  uniforms:{uColor:{value:new THREE.Color(0xe6f5ff)},uSize:{value:7},uPix:{value:DPR}},
  vertexShader:'attribute float a;varying float vA;uniform float uSize,uPix;void main(){vA=a;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=uSize*uPix*(10./-mv.z)*(.5+a*.7);gl_Position=projectionMatrix*mv;}',
  fragmentShader:'uniform vec3 uColor;varying float vA;void main(){vec2 c=gl_PointCoord-.5;float d=length(c);float al=smoothstep(.5,.0,d)*vA*.75;gl_FragColor=vec4(uColor,al);}'});
var pts=new THREE.Points(pGeo,pMat); pts.frustumCulled=false; scene.add(pts);

var SPRAY={
  siding:{c:[-7.75,1.6,4.1],ax:[1,0,0],span:2.4,out:[0,0,1],vert:[.5,3.0]},
  patio:{c:[1.5,.1,-7.0],ax:[1,0,.08],span:3.0,out:[0,1,0]},
  deck:{c:[-8,.75,-7.3],ax:[1,0,0],span:2.2,out:[0,1,0]},
  fence:{c:[2,1,-15.9],ax:[1,0,0],span:7,out:[0,0,1]},
  walkway:{c:[-.75,.12,7],ax:[0,0,1],span:2.4,out:[0,1,0]},
  other:{c:[7,.05,9],ax:[1,0,.2],span:4.5,out:[0,1,0]}
};
var FX={ rinse:{rate:260,speed:13,spread:.05,size:6,col:0xd8efff,grav:3,life:.55},
  final:{rate:240,speed:12,spread:.08,size:6,col:0xe3f4ff,grav:3,life:.6},
  blast:{rate:320,speed:17,spread:.025,size:5,col:0xeef8ff,grav:2,life:.45},
  surface:{rate:220,speed:9,spread:.35,size:5,col:0xe9f6ff,grav:5,life:.4},
  foam:{rate:150,speed:6,spread:.18,size:15,col:0xffffff,grav:1.2,life:.9},
  sand:{rate:120,speed:3,spread:.5,size:7,col:0xc9a877,grav:9,life:.8} };

function createWorker(scene, logoSrc, RM){
  var W={mode:'wand',nozzle:new THREE.Vector3(),head:new THREE.Vector3(),part:null};
  function M(c,r,m){return new THREE.MeshStandardMaterial({color:new THREE.Color(c).convertSRGBToLinear(),roughness:r==null?.8:r,metalness:m||0});}
  var mShirt=M(0x173a86,.88),mPants=M(0x2c3036,.9),mSkin=M(0xc58f6b,.62),mBoot=M(0x2a2420,.75),mCap=M(0x0f234f,.8),mBlack=M(0x141518,.45,.3),
      mSteel=M(0x9aa0a6,.3,.85),mYellow=M(0xe3b21c,.5),mRed=M(0xb8291f,.45,.1),mWhite=M(0xeef1f3,.35),mWood=M(0x9b7653,.75),mBristle=M(0x2a2a2a,.95),mHose=M(0x17191c,.55),mGrey=M(0x3a3e44,.5,.4);
  function sh(m){m.castShadow=true;m.receiveShadow=true;return m;}
  function cyl(rt,rb,h,mat,seg){return sh(new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg||12),mat));}
  function sph(r,mat){return sh(new THREE.Mesh(new THREE.SphereGeometry(r,16,12),mat));}
  function bx(w,h,d,mat){return sh(new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat));}

  /* ---- body ---- */
  var root=new THREE.Group();scene.add(root);
  var body=new THREE.Group();root.add(body);
  function leg(side){var hip=new THREE.Group();hip.position.set(side*.1,.92,0);body.add(hip);
    var th=cyl(.09,.074,.46,mPants);th.position.y=-.23;hip.add(th);
    var knee=new THREE.Group();knee.position.y=-.46;hip.add(knee);
    var shn=cyl(.072,.06,.4,mPants);shn.position.y=-.2;knee.add(shn);
    var boot=bx(.115,.11,.27,mBoot);boot.position.set(0,-.42,.05);knee.add(boot);
    return {hip:hip,knee:knee};}
  var LL=leg(-1),LR=leg(1);
  var pelvis=cyl(.17,.165,.18,mPants,16);pelvis.position.y=.97;pelvis.scale.z=.68;body.add(pelvis);
  var belt=cyl(.172,.172,.04,mBlack,16);belt.position.y=1.06;belt.scale.z=.69;body.add(belt);
  var torso=cyl(.205,.175,.5,mShirt,18);torso.position.y=1.32;torso.scale.z=.64;body.add(torso);
  var chest=sph(.205,mShirt);chest.scale.set(1.04,.42,.66);chest.position.y=1.55;body.add(chest);
  var neck=cyl(.048,.052,.09,mSkin);neck.position.y=1.66;body.add(neck);
  var headG=new THREE.Group();headG.position.y=1.77;body.add(headG);
  var head=sph(.104,mSkin);head.scale.set(.9,1.08,1);headG.add(head);
  var cap=sh(new THREE.Mesh(new THREE.SphereGeometry(.112,18,8,0,Math.PI*2,0,Math.PI/2),mCap));cap.position.y=.022;headG.add(cap);
  var brim=sh(new THREE.Mesh(new THREE.CylinderGeometry(.1,.1,.012,18,1,false,-Math.PI/2,Math.PI),mCap));brim.position.set(0,.026,.075);brim.scale.z=1.15;headG.add(brim);
  var shades=bx(.16,.035,.02,mBlack);shades.position.set(0,-.005,.1);headG.add(shades);

  /* ---- logo print (the real logo, background knocked out so it sits on the shirt) ---- */
  var mPrint=new THREE.MeshStandardMaterial({transparent:true,roughness:.85,alphaTest:.05});mPrint.visible=false;
  var back=new THREE.Mesh(new THREE.PlaneGeometry(.34,.167),mPrint);back.position.set(0,1.4,-.128);back.rotation.y=Math.PI;body.add(back);
  var front=new THREE.Mesh(new THREE.PlaneGeometry(.12,.059),mPrint);front.position.set(-.085,1.45,.128);body.add(front);
  var capPrint=new THREE.Mesh(new THREE.PlaneGeometry(.1,.049),mPrint);capPrint.position.set(0,.07,.098);capPrint.rotation.x=-.35;headG.add(capPrint);
  if(logoSrc){var img=new Image();img.onload=function(){var c=document.createElement('canvas');c.width=img.width;c.height=img.height;var x=c.getContext('2d');x.drawImage(img,0,0);
    var w=c.width,h=c.height,id=x.getImageData(0,0,w,h),d=id.data,seen=new Uint8Array(w*h),st=[];
    for(var i=0;i<w;i++)st.push(i,(h-1)*w+i);for(var j=0;j<h;j++)st.push(j*w,j*w+w-1);
    while(st.length){var p=st.pop();if(seen[p])continue;seen[p]=1;var k=p*4;if(d[k]+d[k+1]+d[k+2]>110)continue;d[k+3]=0;var px=p%w,py=(p/w)|0;
      if(px>0)st.push(p-1);if(px<w-1)st.push(p+1);if(py>0)st.push(p-w);if(py<h-1)st.push(p+w);}
    x.putImageData(id,0,0);var t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=4;mPrint.map=t;mPrint.visible=true;mPrint.needsUpdate=true;};img.src=logoSrc;}

  /* ---- arms (world-space limbs, solved every frame) ---- */
  function limb(r1,r2,mat){var m=cyl(r1,r2,1,mat,10);m.geometry.translate(0,.5,0);m.geometry.rotateX(Math.PI/2);scene.add(m);return m;}
  function place(m,a,b){m.position.copy(a);m.lookAt(b);m.scale.set(1,1,Math.max(.01,a.distanceTo(b)));}
  var uaL=limb(.062,.055,mShirt),uaR=limb(.062,.055,mShirt),faL=limb(.046,.04,mSkin),faR=limb(.046,.04,mSkin);
  var hL=sph(.045,mSkin),hR=sph(.045,mSkin);scene.add(hL,hR);

  /* ---- tools ---- */
  var wand=new THREE.Group();scene.add(wand);
  var gun=bx(.045,.06,.2,mBlack);gun.position.set(0,0,.03);wand.add(gun);
  var grip=bx(.04,.13,.05,mBlack);grip.position.set(0,-.08,-.03);grip.rotation.x=.25;wand.add(grip);
  var trig=bx(.012,.05,.02,mRed);trig.position.set(0,-.05,.04);wand.add(trig);
  var lance=cyl(.011,.011,.82,mSteel,8);lance.rotation.x=Math.PI/2;lance.position.z=.54;wand.add(lance);
  var fhold=cyl(.022,.022,.12,mBlack,10);fhold.rotation.x=Math.PI/2;fhold.position.z=.45;wand.add(fhold);
  var tip=cyl(.018,.014,.06,mYellow,10);tip.rotation.x=Math.PI/2;tip.position.z=.97;wand.add(tip);
  var foamG=new THREE.Group();wand.add(foamG);var bottle=cyl(.05,.05,.17,mWhite,14);bottle.position.set(0,-.07,.92);foamG.add(bottle);
  var fcap=cyl(.03,.03,.05,mBlack,10);fcap.position.set(0,-.005,.92);foamG.add(fcap);var fhorn=cyl(.03,.018,.1,mBlack,10);fhorn.rotation.x=Math.PI/2;fhorn.position.set(0,.01,1.0);foamG.add(fhorn);
  var cleaner=new THREE.Group();scene.add(cleaner);
  var dome=sh(new THREE.Mesh(new THREE.CylinderGeometry(.26,.32,.13,24),mGrey));dome.position.y=.075;cleaner.add(dome);
  var skirt=cyl(.33,.33,.03,mBlack,24);skirt.position.y=.02;cleaner.add(skirt);
  var whl=cyl(.05,.05,.04,mBlack,12);whl.rotation.z=Math.PI/2;whl.position.set(.3,.05,-.18);cleaner.add(whl);var whl2=whl.clone();whl2.position.x=-.3;cleaner.add(whl2);
  var cHandle=limb(.014,.014,mSteel),cBar=limb(.016,.016,mBlack);
  var broom=new THREE.Group();scene.add(broom);var bHead=bx(.6,.06,.08,mWood);bHead.position.y=.09;broom.add(bHead);var bBr=bx(.58,.07,.06,mBristle);bBr.position.y=.035;broom.add(bBr);
  var bHandle=limb(.013,.013,mWood);

  /* ---- pressure washer unit + hose ---- */
  var unit=new THREE.Group();scene.add(unit);
  var fr=bx(.55,.04,.45,mBlack);fr.position.y=.16;unit.add(fr);
  var eng=bx(.32,.28,.3,mRed);eng.position.set(-.05,.33,0);unit.add(eng);
  var tank=bx(.22,.1,.22,mRed);tank.position.set(-.05,.52,0);unit.add(tank);
  var pump=cyl(.06,.06,.18,mGrey,12);pump.rotation.z=Math.PI/2;pump.position.set(.2,.25,0);unit.add(pump);
  var muff=cyl(.05,.05,.12,mSteel,10);muff.rotation.x=Math.PI/2;muff.position.set(-.05,.36,.2);unit.add(muff);
  [-1,1].forEach(function(s){var wh=cyl(.13,.13,.06,mBlack,18);wh.rotation.x=Math.PI/2;wh.position.set(-.18,.13,s*.26);unit.add(wh);});
  var hb=cyl(.012,.012,.6,mBlack,8);hb.position.set(.28,.45,0);hb.rotation.z=-.5;unit.add(hb);
  var hose=new THREE.Mesh(new THREE.BufferGeometry(),mHose);hose.castShadow=true;scene.add(hose);var hoseTick=0;

  /* ---- state ---- */
  var pos=new THREE.Vector3(),prev=new THREE.Vector3(),aim=new THREE.Vector3(),yaw=0,phase=0,first=true,tmp=new THREE.Vector3(),tmp2=new THREE.Vector3(),fwd=new THREE.Vector3(),right=new THREE.Vector3();
  function wl(x,y,z){return body.localToWorld(new THREE.Vector3(x,y,z));}
  function angDamp(a,b,k){var d=Math.atan2(Math.sin(b-a),Math.cos(b-a));return a+d*k;}
  function elbow(sh,hand,side){var m=sh.clone().add(hand).multiplyScalar(.5);m.y-=.09;m.addScaledVector(right,side*.07);return m;}

  W.update=function(dt,t,o){
    var vis=!!o.active;root.visible=wand.visible=unit.visible=vis;[uaL,uaR,faL,faR,hL,hR].forEach(function(m){m.visible=vis;});
    if(!vis){cleaner.visible=broom.visible=cHandle.visible=cBar.visible=bHandle.visible=false;return;}
    var jump=first||o.part!==W.part;W.part=o.part;first=false;
    tmp.copy(o.target).add(o.off);tmp.y=o.floorY;
    prev.copy(pos);
    if(jump)pos.copy(tmp);else pos.lerp(tmp,RM?1:1-Math.pow(.04,dt));
    var spd=jump?0:prev.distanceTo(pos)/Math.max(dt,1e-3);
    root.position.copy(pos);
    var yT=Math.atan2(o.target.x-pos.x,o.target.z-pos.z);yaw=jump?yT:angDamp(yaw,yT,RM?1:1-Math.pow(.02,dt));body.rotation.y=yaw;
    fwd.set(Math.sin(yaw),0,Math.cos(yaw));right.set(Math.cos(yaw),0,-Math.sin(yaw));
    // gait + breathing
    var amp=Math.min(1,spd/1.1)*.55;phase+=dt*(2+spd*5.5);
    LL.hip.rotation.x=Math.sin(phase)*amp;LR.hip.rotation.x=-Math.sin(phase)*amp;
    LL.knee.rotation.x=Math.max(0,Math.sin(phase+1.6))*amp*1.3;LR.knee.rotation.x=Math.max(0,-Math.sin(phase+1.6))*amp*1.3;
    body.position.y=Math.abs(Math.cos(phase))*.035*amp+(RM?0:Math.sin(t*1.7)*.004);
    var mode=o.fx==='surface'?'cleaner':(o.fx==='sand'?'broom':'wand');W.mode=mode;
    var lowered=!o.fx||o.fx==='look'||o.fx==='dwell'||o.fx==='dry';
    // stance: lean a little when working
    body.rotation.x=lowered?0:(mode==='wand'?.06:.12);
    // where the hands/tool point
    if(mode==='wand'&&!lowered)tmp.copy(o.target);else if(mode==='wand'){tmp.copy(pos).addScaledVector(fwd,1.3);tmp.y=o.floorY+.05;}
    else{tmp.copy(o.target);tmp.y=o.floorY;}
    if(jump)aim.copy(tmp);else aim.lerp(tmp,RM?1:1-Math.pow(.002,dt));
    root.updateMatrixWorld(true);
    // head looks at the work
    headG.rotation.x=Math.max(-.2,Math.min(.6,(1.77-(aim.y-pos.y))*.25));
    var shL=wl(-.21,1.5,.02),shR=wl(.21,1.5,.02),hand1,hand2;
    wand.visible=mode==='wand';cleaner.visible=cHandle.visible=cBar.visible=mode==='cleaner';broom.visible=bHandle.visible=mode==='broom';
    foamG.visible=o.fx==='foam';
    if(mode==='wand'){
      wand.position.copy(wl(.16,1.12,.3));wand.lookAt(aim);wand.updateMatrixWorld(true);
      hand1=wand.localToWorld(new THREE.Vector3(0,-.07,-.02));hand2=wand.localToWorld(new THREE.Vector3(0,0,.45));
      W.nozzle.copy(wand.localToWorld(new THREE.Vector3(0,0,o.fx==='foam'?1.05:1.0)));
    }else if(mode==='cleaner'){
      cleaner.position.copy(aim);cleaner.rotation.y=yaw;var top=wl(0,1.0,.42);
      place(cHandle,tmp2.copy(aim).setY(aim.y+.14),top);
      hand1=top.clone().addScaledVector(right,.17);hand2=top.clone().addScaledVector(right,-.17);place(cBar,hand2,hand1);
      W.head.copy(aim);W.nozzle.copy(aim);
    }else{
      var sw=RM?0:Math.sin(t*4.2)*.32;broom.position.copy(aim).addScaledVector(fwd,sw-.1);broom.rotation.y=yaw;
      var top2=wl(.02,1.05,.25);place(bHandle,tmp2.copy(broom.position).setY(broom.position.y+.1),top2);
      hand1=top2.clone();hand2=top2.clone().lerp(broom.position,.38);W.head.copy(broom.position);W.nozzle.copy(broom.position);
    }
    var eR=elbow(shR,hand1,1),eL=elbow(shL,hand2,-1);
    place(uaR,shR,eR);place(faR,eR,hand1);place(uaL,shL,eL);place(faL,eL,hand2);hL.position.copy(hand2);hR.position.copy(hand1);
    // washer unit sits a few metres back
    unit.position.copy(o.machine);unit.position.y=o.machineY||0;unit.rotation.y=Math.atan2(pos.x-o.machine.x,pos.z-o.machine.z)-Math.PI/2;
    // hose: rebuilt a few times a second
    hose.visible=mode!=='broom';
    if(hose.visible&&((hoseTick+=dt)>.08||jump)){hoseTick=0;var hs=mode==='wand'?wand.localToWorld(new THREE.Vector3(0,-.13,-.04)):cleaner.position.clone().addScaledVector(right,.3).setY(cleaner.position.y+.08);
      var mp=unit.localToWorld(new THREE.Vector3(.36,.3,0));var g1=pos.clone().addScaledVector(fwd,-.35).addScaledVector(right,.25);g1.y=o.floorY+.03;
      var g2=g1.clone().lerp(mp,.5);g2.y=Math.min(o.floorY,0)+.03;
      var curve=new THREE.CatmullRomCurve3([hs,hs.clone().lerp(g1,.5).setY((hs.y+g1.y)*.45),g1,g2,mp]);
      hose.geometry.dispose();hose.geometry=new THREE.TubeGeometry(curve,28,.012,6,false);}
  };
  return W;
}

var worker=createWorker(scene,(document.querySelector('.brand img')||{}).src,RM);
var WORK={
  siding:{off:[0,0,2.6],floor:0,machine:[-3.6,0,8.4]},
  patio:{off:[0,0,1.45],floor:.08,machine:[8.2,0,-6]},
  deck:{off:[0,0,1.35],floor:.71,machine:[-3.4,0,-11.5]},
  fence:{off:[0,0,2.3],floor:0,machine:[8.5,0,-11.8]},
  walkway:{off:[1.45,0,0],floor:0,machine:[3.2,0,11.5]},
  other:{off:[0,0,1.45],floor:.015,machine:[12.4,0,12.6]},
  idle:{off:[0,0,1.4],floor:.015,machine:[1.6,0,13.6],target:[-2.6,.05,10.4]}
};
var tgtV=new THREE.Vector3(),offV=new THREE.Vector3(),macV=new THREE.Vector3();
function updateWorker(dt,t){
  var part=state.part, cfg=part&&SPRAY[part], wk=WORK[part]||WORK.idle;
  if(cfg){var sw=RM?0:Math.sin(t*(.9/cfg.span));tgtV.set(cfg.c[0]+cfg.ax[0]*sw*cfg.span,cfg.c[1]+cfg.ax[1]*sw*cfg.span,cfg.c[2]+cfg.ax[2]*sw*cfg.span);
    if(cfg.vert&&state.fx&&!RM){var ph=(t*.16)%1;tgtV.y=state.fx==='foam'?cfg.vert[0]+(cfg.vert[1]-cfg.vert[0])*ph:cfg.vert[1]-(cfg.vert[1]-cfg.vert[0])*ph;}}
  else tgtV.fromArray(WORK.idle.target);
  offV.fromArray(wk.off);macV.fromArray(wk.machine);
  worker.update(dt,t,{active:true,part:part||'idle',fx:cfg?state.fx:null,target:tgtV,off:offV,floorY:wk.floor,machine:macV});
  weeds.scale.setScalar(Math.max(.001,1-Math.min(1,Math.max(0,(state.clean.patio-.42)/.18))));
}
var emitAcc=0, cursor=0, tmpV=new THREE.Vector3(), camTarget=new THREE.Vector3(), backV=new THREE.Vector3();
function emit(dt,t){
  var fx=FX[state.fx], cfg=state.part&&SPRAY[state.part];
  if(RM||!fx||!cfg){emitAcc=0;return;}
  pMat.uniforms.uColor.value.setHex(fx.col); pMat.uniforms.uSize.value=fx.size;
  var mode=worker.mode, rate=mode==='cleaner'?260:(mode==='broom'?90:fx.rate);
  emitAcc+=rate*dt; var n=Math.floor(emitAcc); emitAcc-=n;
  var nz=worker.nozzle;
  for(var k=0;k<n;k++){var j=cursor; cursor=(cursor+1)%NP;
    if(mode==='wand'){
      var dx=tgtV.x-nz.x,dy=tgtV.y-nz.y,dz=tgtV.z-nz.z,L=Math.hypot(dx,dy,dz)||1, sp=fx.speed*(.85+Math.random()*.3);
      pPos[j*3]=nz.x;pPos[j*3+1]=nz.y;pPos[j*3+2]=nz.z;
      pVel[j*3]=(dx/L+(Math.random()-.5)*fx.spread*2)*sp; pVel[j*3+1]=(dy/L+(Math.random()-.5)*fx.spread*2)*sp; pVel[j*3+2]=(dz/L+(Math.random()-.5)*fx.spread*2)*sp;
      pLife[j]=0; pMax[j]=Math.min(fx.life*2.2,L/sp*1.15+.12);
    }else{
      var a2=Math.random()*Math.PI*2, r=mode==='cleaner'?.33:.3*Math.random();
      pPos[j*3]=nz.x+Math.cos(a2)*r;pPos[j*3+1]=nz.y+.04;pPos[j*3+2]=nz.z+Math.sin(a2)*r;
      var o=mode==='cleaner'?1.6:.5;pVel[j*3]=Math.cos(a2)*o*(.5+Math.random());pVel[j*3+1]=(mode==='cleaner'?1.2:.7)*Math.random()+.2;pVel[j*3+2]=Math.sin(a2)*o*(.5+Math.random());
      pLife[j]=0; pMax[j]=.35+Math.random()*.3;
    }
  }
  pts.userData.grav=mode==='wand'?fx.grav:4;
}
function stepParticles(dt){var gv=pts.userData.grav||3;
  for(var j=0;j<NP;j++){ if(pLife[j]>=pMax[j]){pA[j]=0;continue;}
    pLife[j]+=dt; pVel[j*3+1]-=gv*dt; pPos[j*3]+=pVel[j*3]*dt; pPos[j*3+1]+=pVel[j*3+1]*dt; pPos[j*3+2]+=pVel[j*3+2]*dt;
    if(pPos[j*3+1]<0){pPos[j*3+1]=0;pVel[j*3+1]*=-.25;pVel[j*3]*=.5;pVel[j*3+2]*=.5;}
    var u=pLife[j]/pMax[j]; pA[j]=Math.max(0,(1-u))*Math.min(1,u*8); }
  pGeo.attributes.position.needsUpdate=true; pGeo.attributes.a.needsUpdate=true;}

/* ---------------- camera views ---------------- */
var VIEWS={
  hero:{p:[9,3.6,27],t:[-1,2.2,1]},
  siding:{p:[-1,2.6,16],t:[-5,1.9,2.5]},
  patio:{p:[13,6.8,-13.5],t:[2,.3,-7]},
  deck:{p:[-19,5,-15],t:[-8,.8,-7.3]},
  fence:{p:[12,4.5,-7],t:[1,1,-16]},
  walkway:{p:[-6,3.6,16],t:[-1,.3,7]},
  other:{p:[19,5.5,22],t:[6,.3,8]},
  wide:{p:[-18,9,26],t:[1,1.8,-1]}
};
var curT=new THREE.Vector3().fromArray(VIEWS.hero.t);
var wantP=new THREE.Vector3(), wantT=new THREE.Vector3();
var curS=new THREE.Spherical().setFromVector3(new THREE.Vector3().fromArray(VIEWS.hero.p).sub(curT)), wantS=new THREE.Spherical(), sphV=new THREE.Vector3();
var yaw=0, mx=0, my=0;
/* free orbit: visitors spin / tilt / zoom the camera around the house; it eases back whenever the view changes */
var orb={yaw:0,pitch:0,zoom:1}, orbT={yaw:0,pitch:0,zoom:1}, orbView='hero';
function clampZ(z){return Math.max(.6,Math.min(1.7,z));}
function wrapA(a){return Math.atan2(Math.sin(a),Math.cos(a));}
function orbReset(){orb.yaw=wrapA(orb.yaw); orbT.yaw=0; orbT.pitch=0; orbT.zoom=1;}
orbitUI.addEventListener('click',function(e){var b=e.target.closest('[data-orb]'); if(!b) return; var a=b.getAttribute('data-orb');
  if(a==='left') orbT.yaw-=Math.PI/4; else if(a==='right') orbT.yaw+=Math.PI/4;
  else if(a==='in') orbT.zoom=clampZ(orbT.zoom/1.2); else if(a==='out') orbT.zoom=clampZ(orbT.zoom*1.2);
  else if(a==='back'){orbT.yaw=Math.round((orbT.yaw-Math.PI)/(2*Math.PI))*2*Math.PI+Math.PI; orbT.pitch=.3;}
  else orbReset();
  hidePrompt();});

function resize(){var w=innerWidth,h=innerHeight; renderer.setSize(w,h,false); camera.aspect=w/h;
  if(w>=900) camera.setViewOffset(w,h,-w*0.22,0,w,h); else camera.setViewOffset(w,h,0,h*0.17,w,h);
  camera.updateProjectionMatrix(); readScroll();}
addEventListener('resize',resize); resize();

/* ---------------- picking / hover / drag ---------------- */
var ray=new THREE.Raycaster(), ndc=new THREE.Vector2(), hovered=null, label=$('#label'), pointer={x:-1,y:-1,inside:false}, drag=null;
function overUI(el){return !!(el&&el.closest&&el.closest('.panel,header,a,button,input,select,textarea,label,summary,.ba,footer,.rail'));}
function pickAt(x,y){
  // account for view offset: map screen -> full-frame ndc
  var w=innerWidth,h=innerHeight;
  // setViewOffset is baked into the projection matrix, so plain screen NDC works
  ndc.set((x/w)*2-1, -(y/h)*2+1);
  ray.setFromCamera(ndc,camera);
  var hit=ray.intersectObjects(pickables,false)[0];
  return hit?hit.object.userData.part:null;}
addEventListener('pointermove',function(e){mx=(e.clientX/innerWidth-.5);my=(e.clientY/innerHeight-.5);
  pointer.x=e.clientX;pointer.y=e.clientY;pointer.inside=!overUI(e.target);
  if(drag){var dx=e.clientX-drag.x, dy=e.clientY-drag.y;
    orbT.yaw=drag.yaw0-dx*0.006; orbT.pitch=Math.max(-.45,Math.min(.5,drag.p0+dy*0.004));
    if(Math.abs(dx)+Math.abs(dy)>6){drag.moved=true; hidePrompt();}}
},{passive:true});
canvas.addEventListener('pointerdown',function(e){drag={x:e.clientX,y:e.clientY,yaw0:orbT.yaw,p0:orbT.pitch,moved:false};canvas.classList.add('drag');});
// phones: a vertical swipe becomes a page scroll, which cancels the drag
addEventListener('pointercancel',function(){drag=null; canvas.classList.remove('drag');});
// trackpad pinch (ctrl/cmd + wheel) zooms; a plain wheel still scrolls the page
canvas.addEventListener('wheel',function(e){if(!e.ctrlKey&&!e.metaKey) return; e.preventDefault(); orbT.zoom=clampZ(orbT.zoom*Math.exp(e.deltaY*0.01));},{passive:false});
addEventListener('pointerup',function(e){
  var wasDrag=drag&&drag.moved; drag=null; canvas.classList.remove('drag');
  if(wasDrag||e.target!==canvas) return;
  var part=pickAt(e.clientX,e.clientY); if(part){goTo(part);}
});
addEventListener('pointerleave',function(){pointer.inside=false;});

/* ---------------- loop ---------------- */
var last=performance.now(), t0=last, first=true;
function damp(k,dt){return RM?1:1-Math.pow(k,dt);}
function frame(now){
  var dt=Math.min(.05,(now-last)/1000); last=now; var t=(now-t0)/1000;
  var v=VIEWS[state.view]||VIEWS.wide;
  wantP.fromArray(v.p); wantT.fromArray(v.t);
  // orbit between views (interpolate in spherical coords so the camera swings around the house, never through it)
  var zoom = innerWidth/innerHeight<1 ? 1.65 : (innerWidth<1300 ? 1.18 : 1.05);
  wantS.setFromVector3(sphV.copy(wantP).sub(wantT)); wantS.radius*=zoom;
  var a=damp(.06,dt); curT.lerp(wantT,a);
  var dTh=wantS.theta-curS.theta; dTh=Math.atan2(Math.sin(dTh),Math.cos(dTh));
  curS.theta+=dTh*a; curS.phi+=(wantS.phi-curS.phi)*a; curS.radius+=(wantS.radius-curS.radius)*a;
  // swell the radius mid-swing so long moves clear the roofline
  var swing=Math.min(1,Math.abs(dTh)/1.2);
  yaw+= ((RM||drag?0:mx*.08)-yaw)*damp(.05,dt);
  if(state.view!==orbView){orbView=state.view; orbReset();}
  var ko=damp(.004,dt); orb.yaw+=(orbT.yaw-orb.yaw)*ko; orb.pitch+=(orbT.pitch-orb.pitch)*ko; orb.zoom+=(orbT.zoom-orb.zoom)*ko;
  // rise up as the camera swings away from the front, so it looks over the trees and fence into the yard
  var lift=Math.min(1,Math.abs(wrapA(orb.yaw))/0.9)*.32;
  sphV.setFromSphericalCoords(curS.radius*(1+swing*.25)*orb.zoom, Math.max(.3,Math.min(1.5,curS.phi-swing*.2-orb.pitch-lift)), curS.theta+yaw+orb.yaw);
  // facing the back of the house from the overview, aim into the yard (patio, deck, fence) instead of the roof
  var back=state.view==='hero'?Math.max(0,-Math.cos(orb.yaw)):0;
  camTarget.copy(curT).add(backV.set(2.5*back,-1.4*back,-7.5*back));
  camera.position.set(camTarget.x+sphV.x, camTarget.y+sphV.y+(RM?0:-my*.6), camTarget.z+sphV.z); camera.lookAt(camTarget);

  // hover
  var hp = pointer.inside && !drag ? pickAt(pointer.x,pointer.y) : null;
  if(hp!==hovered){hovered=hp; canvas.style.cursor=hp?'pointer':'';
    if(hp){label.innerHTML=PARTS[hp].label+'<small>Click to see how it\'s done</small>';label.style.opacity=1;} else label.style.opacity=0;}
  if(hovered){label.style.left=pointer.x+'px';label.style.top=pointer.y+'px';}

  // uniforms
  var ka=damp(.02,dt);
  allMats.forEach(function(m){var u=m.userData.u, p=m.userData.part; u.uTime.value=t;
    if(p){u.uClean.value+=(state.clean[p]-u.uClean.value)*ka;
      u.uHover.value+=((hovered===p?1:0)-u.uHover.value)*damp(.0005,dt);
      u.uSel.value+=((state.part===p?1:0)-u.uSel.value)*damp(.01,dt);
      if(p==='patio') u.uSand.value+=(state.sand-u.uSand.value)*ka;}});
  updateWorker(dt,t); emit(dt,t); stepParticles(dt);
  renderer.render(scene,camera);
  if(first){first=false; setTimeout(done,250);}
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
})();
