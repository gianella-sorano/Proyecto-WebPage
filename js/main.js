(()=>{
'use strict';
const RAD=[22.1, 39.8, 61.7, 84.7];
const NS='http://www.w3.org/2000/svg';
const $=id=>document.getElementById(id);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const seg=(p,a,b)=>clamp((p-a)/(b-a));
const lerp=(a,b,t)=>a+(b-a)*t;
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const eo=t=>1-Math.pow(1-t,3);
const COL={bosque:[37,57,32],salvia:[173,183,113],blanco:[255,255,255],naranja:[226,96,33]};
const mix=(a,b,t)=>a.map((v,i)=>Math.round(lerp(v,b[i],t)));
const rgb=c=>`rgb(${c[0]},${c[1]},${c[2]})`;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fmt=n=>String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,'.');
function rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
if('scrollRestoration' in history)history.scrollRestoration='manual';


/* ================= Recorrido de Inicio ================= */
const stage=$('stage'),journey=$('inicio'),world=$('world'),heroC=$('heroClean'),heroT=$('heroText');
const HERO={text:'img/inicio.jpg',clean:'img/hero.webp',w:2200,h:1359,dx:0.3629872636047858,dy:0.6878201124297314,dr:0.006754148977228869};
heroC.src=HERO.clean;heroT.src=HERO.text;
const dot=$('dot'),halo=$('halo');
const header=$('top'),minis=$$('.top .mr'),cue=$('scrollCue');
let current=null;


const VC={Capacitamos:['#253920','#fff'],Recuperamos:['#616F25','#fff'],Conectamos:['#ADB771','#253920'],Colaboramos:['#F08F03','#253920'],Activamos:['#E26021','#253920']};
const STOPS=[
 {v:'Capacitamos',d:'Talleres y formaciones para empresas.',n:'46',u:'talleres y formaciones',e:'Huella de carbono, reportes de sostenibilidad y liderazgo.'},
 {v:'Recuperamos',d:'Plásticos y residuos que vuelven a circular.',n:'12',u:'toneladas recuperadas',e:'Tapitas y ecobotellas que se vuelven madera plástica.'},
 {v:'Conectamos',d:'Empresas, ONG e instituciones trabajando juntas.',n:'58',u:'empresas y 24 organizaciones aliadas',e:'Una red abierta a cualquier tamaño y sector.'},
 {v:'Colaboramos',d:'Proyectos sociales y ambientales.',n:'17',u:'proyectos',e:'Inclusión laboral con CILSA, INAREPS, Fundación Discar, Asdemar y Randstad.'},
 {v:'Activamos',d:'Jornadas de voluntariado y foros.',n:'21',u:'jornadas y 8 foros',e:'Limpieza de playas y el Foro de RSE y Desarrollo Sostenible.'}];
const stopsEl=$('stops');
STOPS.forEach((s,i)=>{const d=document.createElement('div');d.className='stop';d.style.setProperty('--vc',VC[s.v][0]);d.style.setProperty('--vt',VC[s.v][1]);
  d.innerHTML=`<div class="up"><h3><span class="n">${i+1}</span>${s.v}</h3><p>${s.d}</p></div><div class="down"><b class="big">${s.n}</b><span class="unit">${s.u}</span><p class="ex">${s.e}</p></div>`;stopsEl.appendChild(d)});
const stopEls=[...stopsEl.children];
const ticks=$('ticks');const tickEls=STOPS.map(()=>{const g=document.createElementNS(NS,'g');
 const l=document.createElementNS(NS,'line');l.setAttribute('stroke','#253920');l.setAttribute('stroke-width','1');l.setAttribute('stroke-dasharray','2 5');l.setAttribute('opacity','.55');
 const c=document.createElementNS(NS,'circle');c.setAttribute('r','5');c.setAttribute('fill','#253920');g.append(l,c);ticks.appendChild(g);return{g,l,c}});

const net=$('net');const NODES=[];(()=>{const r=rng(21);for(let i=0;i<30;i++){NODES.push({a:r()*Math.PI*2,d:.3+r()*.72,s:r()})}})();
const netEls=NODES.map(()=>{const l=document.createElementNS(NS,'line');l.setAttribute('stroke','#ADB771');l.setAttribute('stroke-width','1');l.setAttribute('pathLength','1');l.setAttribute('stroke-dasharray','1');
 const c=document.createElementNS(NS,'circle');c.setAttribute('fill','#ADB771');net.append(l,c);return{l,c}});

const s2marks=$('s2marks');const leadEls=[0,1,2,3].map(()=>{const l=document.createElementNS(NS,'line');l.setAttribute('stroke','#fff');l.setAttribute('stroke-width','1');s2marks.appendChild(l);return l});
const markEls=[0,1,2,3].map(()=>{const c=document.createElementNS(NS,'circle');c.setAttribute('r','4');c.setAttribute('fill','#fff');s2marks.appendChild(c);return c});
const statEls=[0,1,2,3].map(i=>$('st'+i));

function makeRipples(host,n,stroke,w){return Array.from({length:n},()=>{const u=document.createElementNS(NS,'use');u.setAttribute('href','#o4');u.setAttribute('fill','none');u.setAttribute('stroke',stroke);u.setAttribute('stroke-width',w);host.appendChild(u);return u})}
const rip=$('ripples'),ripEls=makeRipples(rip,4,'#ADB771','1.4');
const roadRip=$('roadRip'),rrEls=makeRipples(roadRip,3,'#E26021','2');

const g2=['g1','g2','g3','g4'].map($),disc=$('disc'),dRings=['d1','d2','d3','d4'].map($),big=$('big'),bRings=['b1','b2','b3','b4'].map($);
const T={s1a:$('s1a'),s1b:$('s1b'),s2h:$('s2h'),s3h:$('s3h'),s3v:$('s3v'),s4h:$('s4h'),s5h:$('s5h'),s6h:$('s6h')};

let W=0,H=0,u=0,port=false,L={};
function layout(){
  const r=stage.getBoundingClientRect();if(r.width<10)return;
  W=r.width;H=r.height;u=Math.min(W,H);port=W/H<.85;
  document.body.classList.toggle('portrait',port);
  world.setAttribute('viewBox',`0 0 ${W} ${H}`);
  const bake=W/H>=1.45;document.body.classList.toggle('bake',bake);L.bake=bake;
  const sc=Math.max(W/HERO.w,H/HERO.h),dw=HERO.w*sc,dh=HERO.h*sc;
  const hx=dw>W?(bake?W-dw:clamp(W*.5-HERO.dx*dw,W-dw,0)):0,hy=dh>H?(H-dh)*.4:0;
  L.hero={dw,dh,hx,hy};L.chosen=[hx+HERO.dx*dw,hy+HERO.dy*dh];L.dr=HERO.dr*dw;
  [heroC,heroT].forEach(i=>{i.style.width=dw+'px';i.style.height=dh+'px'});
  heroT.style.display=bake?'block':'none';
  L.r0=clamp(u*.009,5,8);
  L.C2=port?[W*.5,H*.41]:[W*.4,H*.6];
  L.R2=port?Math.min(W*.36,H*.17):Math.min(u*.33,300);
  L.lx=L.C2[0]+L.R2+64;const g=Math.max(96,L.R2*.4);L.ly=[-1.5,-.5,.5,1.5].map(k=>k*g);
  /* la lista de la red arranca en la misma columna que las leyendas de la pantalla anterior */
  T.s3v.style.left=port?'':L.lx+'px';T.s3v.style.maxWidth=port?'':Math.min(400,W-L.lx-24)+'px';
  L.s2=L.R2/RAD[3];
  L.ang=port?[0,0,0,0]:[-35,-12,10,28].map(a=>a*Math.PI/180);
  L.lineY=H*(port?.62:.66);L.Dx=W*(port?.22:.26);
  L.R5=Math.min(u*.14,118);L.s4=L.R5/RAD[3];L.band=L.R5+20;
  L.sp=Math.max(W*.46,330);L.S=STOPS.map((_,i)=>L.sp*(i+.85));L.end=L.S[STOPS.length-1]+L.sp*.55;
  stopEls.forEach(e=>e.style.setProperty('--band',L.band+'px'));
  $('roadLine').setAttribute('x1',0);$('roadLine').setAttribute('x2',W);$('roadLine').setAttribute('y1',L.lineY);$('roadLine').setAttribute('y2',L.lineY);
  $('trail').setAttribute('stroke-width',Math.max(4,u*.008));
  L.C5=port?[W*.5,H*.36]:[W*.64,H*.5];
  L.rmax=port?W*.4:Math.min(H*.38,W*.28);L.s5=L.rmax/RAD[3];
  L.C6=port?[W*.5,H*.27]:[W*.68,H*.5];
  L.s6=(port?Math.min(W*.3,H*.16):Math.min(H*.27,W*.19))/RAD[3];
  dot.setAttribute('r',L.r0);
  if(port){statEls.forEach(e=>{e.style.left='';e.style.top=''})}
  last=-1;
}
const t0=performance.now();
function drawMap(p,now){
  const z=ease(seg(p,.085,.135)),s=1+z*6,B=L.chosen,P=[lerp(B[0],L.C2[0],z),lerp(B[1],L.C2[1],z)];
  const alpha=1-seg(p,.1,.135);const{hx,hy}=L.hero;
  const tf=`translate(${(s*hx+P[0]-s*B[0]).toFixed(2)}px,${(s*hy+P[1]-s*B[1]).toFixed(2)}px) scale(${s.toFixed(4)})`;
  heroC.style.transform=tf;heroT.style.transform=tf;
  heroC.style.opacity=alpha;heroT.style.opacity=L.bake?alpha*(1-seg(p,.035,.06)):0;
  return P;
}
const show=(el,o,dy=0)=>{el.style.opacity=o;el.style.transform=(el.dataset.cy&&!port?'translateY(-50%) ':'')+`translateY(${(1-o)*dy}px)`;el.style.visibility=o<.01?'hidden':'visible';el.classList.toggle('live',o>.5)};
const setT=(el,x,y,s,r=0)=>el.setAttribute('transform',`translate(${x} ${y}) rotate(${r}) scale(${s})`);
const op=(el,o)=>el.setAttribute('opacity',o.toFixed(3));
let target=0,cur=0,last=-1,lastBg=COL.bosque;
function bgAt(p){
  if(p<.32)return COL.bosque;if(p<.36)return mix(COL.bosque,COL.blanco,ease(seg(p,.32,.36)));
  if(p<.63)return COL.blanco;if(p<.66)return mix(COL.blanco,COL.salvia,ease(seg(p,.63,.66)));
  if(p<.8)return COL.salvia;return mix(COL.salvia,COL.bosque,ease(seg(p,.8,.835)));
}
function render(p,now){
  const bg=bgAt(p);stage.style.background=rgb(bg);
  const P=drawMap(p,now);
  show(T.s1a,(1-seg(p,.035,.06))*(reduce?1:eo(clamp((now-t0-200)/1000))),-16);
  const cv=(1-seg(p,.01,.04))*(reduce?1:eo(clamp((now-t0-900)/800)));
  cue.style.opacity=cv;cue.style.visibility=cv<.01?'hidden':'visible';
  show(T.s1b,seg(p,.05,.065)*(1-seg(p,.095,.115)),14);
  const m6=ease(seg(p,.8,.85));
  const bc=[lerp(L.C5[0],L.C6[0],m6),lerp(L.C5[1],L.C6[1],m6)],bs=lerp(L.s5,L.s6,m6);
  let dp;
  if(p<.135)dp=P;else if(p<.32)dp=L.C2;
  else if(p<.64){const k=ease(seg(p,.32,.365));dp=[lerp(L.C2[0],L.Dx,k),lerp(L.C2[1],L.lineY,k)]}
  else{const k=ease(seg(p,.64,.69));dp=[lerp(L.Dx,bc[0],k),lerp(L.lineY,bc[1],k)]}
  const lit=seg(p,.035,.05);
  dot.setAttribute('cx',dp[0]);dot.setAttribute('cy',dp[1]);
  dot.setAttribute('r',lerp(L.dr,L.r0,lit));dot.setAttribute('fill',rgb(mix([240,143,3],COL.naranja,lit)));
  const ph=reduce?.4:((now/1600)%1),hv=seg(p,.045,.06)*(1-seg(p,.12,.14));
  halo.setAttribute('cx',dp[0]);halo.setAttribute('cy',dp[1]);halo.setAttribute('r',L.r0*(1.6+3.5*ph));op(halo,hv*.7*(1-ph));

  g2.forEach((g,i)=>{const a=seg(p,.13+.012*i,.155+.012*i)*(1-seg(p,.245,.275));setT(g,L.C2[0],L.C2[1],L.s2*lerp(.85,1,eo(a)));op(g,a*.3)});
  show(T.s2h,seg(p,.135,.155)*(1-seg(p,.235,.26)),16);
  const stOp=[0,1,2,3].map(i=>seg(p,.145+.014*i,.165+.014*i)*(1-seg(p,.235,.26)));
  markEls.forEach((m,i)=>{const r=RAD[i]*L.s2,a=L.ang[i],mx=L.C2[0]+r*Math.cos(a),my=L.C2[1]+r*Math.sin(a);m.setAttribute('cx',mx);m.setAttribute('cy',my);op(m,port?0:stOp[i]);
    const ld=leadEls[i];ld.setAttribute('x1',mx);ld.setAttribute('y1',my);const lt=eo(stOp[i]);ld.setAttribute('x2',lerp(mx,L.lx-12,lt));ld.setAttribute('y2',lerp(my,L.C2[1]+L.ly[i],lt));op(ld,port?0:stOp[i]*.55)});
  statEls.forEach((e,i)=>{if(!port){e.style.left=L.lx+'px';e.style.top=(L.C2[1]+L.ly[i])+'px'}e.style.opacity=stOp[i];e.style.visibility=stOp[i]<.01?'hidden':'visible'});

  const nv=1-seg(p,.315,.345);
  NODES.forEach((n,i)=>{const e=netEls[i],R=L.R2*1.05*n.d,x=L.C2[0]+R*Math.cos(n.a),y=L.C2[1]+R*Math.sin(n.a)*(port?1.1:.8);
    const a=seg(p,.245+n.s*.02,.26+n.s*.02)*nv,l=seg(p,.258+n.s*.025,.285+n.s*.02);
    e.c.setAttribute('cx',x);e.c.setAttribute('cy',y);e.c.setAttribute('r',3);op(e.c,a);
    e.l.setAttribute('x1',x);e.l.setAttribute('y1',y);e.l.setAttribute('x2',dp[0]);e.l.setAttribute('y2',dp[1]);e.l.setAttribute('stroke-dashoffset',1-l);op(e.l,.45*nv*a)});
  const s3o=seg(p,.255,.275)*(1-seg(p,.315,.335));
  show(T.s3h,s3o,16);show(T.s3v,s3o,16);

  const rv=seg(p,.335,.365)*(1-seg(p,.625,.648));
  const dw=seg(p,.37,.625)*L.end;
  op($('road'),rv);
  $('roadLine').setAttribute('x2',W*ease(seg(p,.335,.37)));
  const tx0=L.Dx-dw;$('trail').setAttribute('x1',Math.min(L.Dx,Math.max(-20,tx0)));$('trail').setAttribute('x2',L.Dx);$('trail').setAttribute('y1',L.lineY);$('trail').setAttribute('y2',L.lineY);
  STOPS.forEach((s,i)=>{const sx=L.Dx+L.S[i]-dw,tk=tickEls[i];
    tk.c.setAttribute('cx',sx);tk.c.setAttribute('cy',L.lineY);
    tk.l.setAttribute('x1',sx);tk.l.setAttribute('x2',sx);tk.l.setAttribute('y1',L.lineY-L.band+4);tk.l.setAttribute('y2',L.lineY+L.band-4);
    const passed=dw>=L.S[i];tk.c.setAttribute('fill',passed?VC[s.v][0]:'#253920');
    const o=seg(W-sx,W*.02,W*.22)*rv;const e=stopEls[i];
    e.style.transform=`translate(${sx+16}px,${L.lineY}px)`;e.style.opacity=o;e.style.visibility=o<.01||sx>W+20||sx<-400?'hidden':'visible'});
  show(T.s4h,seg(p,.36,.385)*(1-seg(p,.6,.625)),16);

  const rot=(dw/(L.R5))*57.3*.6;
  setT(disc,dp[0],dp[1],L.s4,rot);
  const discV=1-seg(p,.625,.648);
  for(let k=0;k<4;k++){const a=eo(clamp((dw-L.S[k])/(L.sp*.16)));op(dRings[k],a*discV);dRings[k].setAttribute('transform',`scale(${lerp(1.3,1,a)})`)}
  const a5=eo(clamp((dw-L.S[4])/(L.sp*.2)))*discV;
  setT(roadRip,dp[0],dp[1],L.s4);op(roadRip,a5);
  rrEls.forEach((e,i)=>{const f=reduce?(.3+i*.25):((now/3800+i/3)%1);e.setAttribute('transform',`scale(${1+f*1.9})`);op(e,.75*(1-f))});

  /* crecimiento: el punto llega al centro y los anillos se suman uno a uno */
  setT(big,bc[0],bc[1],bs);
  bRings.forEach((r,k)=>{const a=eo(seg(p,.67+.02*k,.71+.02*k));op(r,a);r.setAttribute('transform',`scale(${lerp(1.3,1,a)})`)});
  show(T.s5h,seg(p,.735,.765)*(1-seg(p,.8,.825)),16);

  const wv=seg(p,.86,.9);setT(rip,L.C6[0],L.C6[1],L.s6);op(rip,wv);
  ripEls.forEach((e,i)=>{const f=reduce?(.25+i*.2):((now/5200+i/4)%1);e.setAttribute('transform',`scale(${1+f*2.6})`);op(e,.55*(1-f))});
  show(T.s6h,seg(p,.87,.9),16);

  const litR=[0,1,2,3].map(k=>dw>=L.S[k]||p>.64);
  minis.forEach((m,i)=>{m.style.fill=litR[i]?'#E26021':'currentColor';m.style.opacity=litR[i]?1:.35});
  return bg;
}

/* ================= Header, menú y rutas ================= */
const ROUTES={'':'Inicio','nosotros':'Nosotros','que-hacemos':'Qué hacemos','impacto':'Impacto','actividades':'Actividades','participar':'Participar','suma':'SUMÁ'};
function inkOf(bg){const l=(.2126*bg[0]+.7152*bg[1]+.0722*bg[2])/255;return l>.55?'#253920':'#fff'}
function headerState(){
  const home=current==='';
  let solid=!home,ink=null;
  if(home){const jb=journey.getBoundingClientRect().bottom;if(jb>70){ink=inkOf(lastBg)}else solid=true}
  header.classList.toggle('solid',solid);
  if(ink){header.style.color=ink;const w=ink==='#fff';header.style.setProperty('--hsu',w?'#fff':'#007A79');header.style.setProperty('--hma',w?'#fff':'#007A79')}
  else{header.style.color='';header.style.removeProperty('--hsu');header.style.removeProperty('--hma')}
  if(!home||solid){minis.forEach(m=>{m.style.fill='#E26021';m.style.opacity=1})}
}
const drawer=$('drawer'),menuBtn=$('menuBtn');
function openDrawer(){drawer.classList.add('open');drawer.setAttribute('aria-hidden','false');menuBtn.setAttribute('aria-expanded','true');$('menuClose').focus()}
function closeDrawer(ret){if(!drawer.classList.contains('open'))return;drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true');menuBtn.setAttribute('aria-expanded','false');if(ret)menuBtn.focus()}
menuBtn.addEventListener('click',openDrawer);
$('menuClose').addEventListener('click',()=>closeDrawer(true));
addEventListener('keydown',e=>{if(e.key==='Escape')closeDrawer(true)});
drawer.addEventListener('click',e=>{if(e.target.closest('a'))closeDrawer(false)});

function parseRoute(){const h=location.hash.replace(/^#\/?/,'').replace(/\/$/,'');return h in ROUTES?h:''}
function route(first){
  const r=parseRoute();if(r===current)return;
  current=r;
  $$('.screen').forEach(s=>{s.hidden=s.dataset.route!==r});
  reveal($$('.screen').find(s=>!s.hidden));
  document.body.dataset.route=r||'home';
  document.title=(r?ROUTES[r]+' · ':'')+'FortaleceRSE';
  $$('[data-r]').forEach(a=>{if(a.dataset.r===r)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
  window.scrollTo(0,0);
  if(r===''){layout();readScroll();cur=target;last=-1;lastBg=bgAt(cur);if(W)render(cur,performance.now())}
  if(r==='suma')scallop();
  spy();headerState();
  if(!first){const scr=$$('.screen').find(s=>!s.hidden);const h=scr&&scr.querySelector('h1');if(h){h.tabIndex=-1;h.focus({preventScroll:true})}}
}
addEventListener('hashchange',()=>route(false));

/* la intro (hasta que el mapa termina de acercarse) ocupa poco scroll; el resto se reparte parejo */
const INTRO={scroll:.08,p:.135};
const warp=x=>x<INTRO.scroll?x/INTRO.scroll*INTRO.p:lerp(INTRO.p,1,(x-INTRO.scroll)/(1-INTRO.scroll));
function readScroll(){if(current!=='')return;const r=journey.getBoundingClientRect();const span=journey.offsetHeight-stage.offsetHeight;if(span>0)target=warp(clamp(-r.top/span))}
function loop(now){
  if(current===''&&W){
    cur=reduce?target:cur+(target-cur)*.12;
    if(Math.abs(target-cur)<.00005)cur=target;
    const jb=journey.getBoundingClientRect().bottom>0;
    const animating=jb&&(cur<.14||cur>.5||now-t0<1600);
    if(cur!==last||animating){lastBg=render(cur,now);last=cur}
    headerState();
  }
  requestAnimationFrame(loop);
}
addEventListener('scroll',()=>{readScroll();spy()},{passive:true});
addEventListener('resize',()=>{if(current===''){layout();readScroll()}if(current==='suma')scallop()});

/* ================= Interacciones generales ================= */
function go(id){const t=$(id);if(t)t.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'})}
document.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(b){e.preventDefault();go(b.dataset.go)}});
cue.addEventListener('click',()=>scrollBy({top:innerHeight*.9,behavior:reduce?'auto':'smooth'}));
function spy(){
  if(current==='')return;const scr=$$('.screen').find(s=>!s.hidden);if(!scr)return;
  const btns=$$('.subnav button',scr);if(!btns.length)return;
  const line=innerHeight*.32+70;let on=null;
  btns.forEach(b=>{const t=$(b.dataset.go);if(t&&t.getBoundingClientRect().top<=line)on=b});
  btns.forEach(b=>b.classList.toggle('on',b===on));
}
function countUp(el){
  const tgt=parseFloat(el.dataset.count);
  if(reduce){el.textContent=fmt(tgt);return}
  const s=performance.now(),dur=1300;
  (function f(n){const k=clamp((n-s)/dur);el.textContent=fmt(tgt*eo(k));if(k<1)requestAnimationFrame(f)})(s);
}
const cio=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;cio.unobserve(e.target);countUp(e.target)}),{threshold:.4});
$$('[data-count]').forEach(el=>cio.observe(el));

/* mapa de puntos: empresas asociadas */
(()=>{const svg=$('dots'),r=rng(11),lit=new Set();while(lit.size<58)lit.add((r()*300)|0);
  let h='';for(let i=0;i<300;i++){h+=`<circle cx="${12+(i%20)*20.5}" cy="${12+Math.floor(i/20)*20.5}" r="6" class="${lit.has(i)?'on':''}" style="--d:${(i*37)%900}ms"/>`}
  svg.innerHTML=h;
  new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){svg.classList.add('in');o.disconnect()}}),{threshold:.3}).observe(svg)})();
const cta=$('ctaIso');new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)cta.classList.add('on')}),{threshold:.4}).observe(cta);

/* historia: cada hito suma un anillo */
(()=>{const btns=$$('.hitos button'),rg=$$('.iso .rg');
  function sel(i){btns.forEach((b,k)=>{b.setAttribute('aria-pressed',String(k===i));const d=b.querySelector('.d');if(d)d.hidden=k!==i});rg.forEach((r,k)=>r.classList.toggle('on',k<=i))}
  btns.forEach((b,i)=>b.addEventListener('click',()=>sel(i)));sel(0)})();

/* proyectos: filtro por verbo */
$$('#filters button').forEach(b=>b.addEventListener('click',()=>{
  $$('#filters button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  const v=b.dataset.f;$$('#projGrid .card').forEach(c=>{c.hidden=!(v==='todos'||c.dataset.v===v)})}));

/* SUMÁ: tira de capuchones del borde */
function scallop(){
  $$('.scallop').forEach(svg=>{const w=svg.getBoundingClientRect().width||innerWidth;const step=26,n=Math.ceil(w/step)+1,c=svg.dataset.color;let h='';
    for(let i=0;i<n;i++){const hh=8+(i%6)*6;h+=`<rect x="${i*step+4}" y="-24" width="14" height="${hh+24}" rx="7" fill="${c}"/>`}
    svg.setAttribute('viewBox',`0 0 ${w} 46`);svg.innerHTML=h})}

/* SUMÁ: sumá tu huella */
(()=>{
  const TIPOS={manos:'#00A59D',tiempo:'#F08F03',equipo:'#E26021',idea:'#007A79'};
  const NV=64,hr=rng(5),barsEl=$('bars'),items=[];
  const pick=()=>{const v=hr();return v<.5?'manos':v<.7?'tiempo':v<.9?'equipo':'idea'};
  /* escalera pareja: cada barra es un escalón igual de alto que el anterior (sin variación al azar) */
  const hpct=j=>16+j/(NV-1)*82;
  for(let i=0;i<NV;i++)items.push({t:pick(),id:i});
  let nextId=NV,total=860;
  const place=()=>items.forEach((x,j)=>x.el.style.setProperty('--i',j));
  items.forEach((it,j)=>{const el=document.createElement('i');el.style.setProperty('--c',TIPOS[it.t]);el.style.setProperty('--h',hpct(j,it.id).toFixed(1));it.el=el;barsEl.appendChild(el)});place();
  /* las barras cercanas al mouse crecen: curva suave (campana) de ~4 barras de ancho */
  if(!reduce){
    barsEl.addEventListener('pointermove',e=>{
      items.forEach(it=>{const r=it.el.getBoundingClientRect(),w=r.width||8,d=(e.clientX-(r.left+r.width/2))/(w*2.6);
        it.el.style.setProperty('--k',Math.exp(-d*d).toFixed(3))})});
    barsEl.addEventListener('pointerleave',()=>items.forEach(it=>it.el.style.removeProperty('--k')));
  }
  const form=$('hform'),msg=$('hmsg'),out=$('hcount');
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const c=form.querySelector('input[name=ht]:checked');
    $('e-ht').textContent=c?'':'Elegí cómo sumás tu huella.';if(!c)return;
    const name=$('hname').value.trim(),t=c.value;
    const it={t,id:nextId++},el=document.createElement('i');
    el.style.setProperty('--c',TIPOS[t]);el.style.setProperty('--h','0');el.className='mine';it.el=el;items.push(it);barsEl.appendChild(el);
    if(items.length>NV){const old=items.shift();old.el.remove()}
    place();
    items.forEach(x=>{if(x!==it)x.el.classList.remove('mine')});
    total++;out.textContent=fmt(total);
    const apply=()=>{items.forEach((x,j)=>x.el.style.setProperty('--h',hpct(j,x.id).toFixed(1)));placeBubble(it,name)};
    if(reduce)apply();else requestAnimationFrame(()=>requestAnimationFrame(apply));
    msg.textContent='';
    msg.append(`Sumaste la huella n.º ${fmt(total)}${name?', '+name:''}. ¡Gracias! `);
    const b=document.createElement('button');b.type='button';b.className='linkbtn';b.dataset.go='su-jornada';b.textContent='Hacela real en la próxima jornada';msg.appendChild(b);
  });
  function placeBubble(it,name){
    $$('.bubble',barsEl).forEach(x=>x.remove());
    const b=document.createElement('span');b.className='bubble';b.textContent=name?`Tu huella · ${name}`:'Tu huella';
    const hpx=(barsEl.clientHeight-30)*parseFloat(it.el.style.getPropertyValue('--h'))/100;
    b.style.left=(it.el.offsetLeft+it.el.offsetWidth/2)+'px';b.style.top=Math.max(0,barsEl.clientHeight-hpx-34)+'px';
    barsEl.appendChild(b);
    setTimeout(()=>{b.style.opacity='0'},4200);setTimeout(()=>b.remove(),5000);
  }
})();

/* formularios */
function err(id,msg){const e=$(id);if(e)e.textContent=msg||'';return!msg}
const okMail=m=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m);
(()=>{
  const form=$('pform'),sets=$$('fieldset',form),lis=[...$('psteps').children];let step=0;
  function gostep(n){step=n;sets.forEach((f,i)=>f.hidden=i!==n);lis.forEach((li,i)=>{li.className=i<n?'done':i===n?'on':''});const f=sets[n].querySelector('input:not([type=radio]):not([type=checkbox]),input:checked,input');if(f)f.focus({preventScroll:true})}
  function valid(n){
    if(n===0)return err('e-tipo',form.querySelector('input[name=tipo]:checked')?'':'Elegí cómo querés participar.');
    if(n===1)return err('e-com',form.querySelector('input[name=com]:checked')?'':'Elegí al menos una comisión.');
    return[err('e-nom',$('nom').value.trim()?'':'Escribí tu nombre.'),err('e-ape',$('ape').value.trim()?'':'Escribí tu apellido.'),err('e-mail',okMail($('mail').value.trim())?'':'Revisá el email: falta el @ o el dominio.')].every(Boolean);
  }
  form.addEventListener('click',e=>{if(e.target.matches('[data-next]')){if(valid(step))gostep(step+1)}if(e.target.matches('[data-prev]'))gostep(step-1)});
  form.addEventListener('submit',e=>{e.preventDefault();if(!valid(2))return;
    const tipo=form.querySelector('input[name=tipo]:checked').value;
    $('pokText').textContent=`${$('nom').value.trim()}, recibimos tu interés en sumarte (${tipo}). El equipo de FortaleceRSE va a escribir a ${$('mail').value.trim()}.`;
    $('pbody').hidden=true;$('psteps').hidden=true;$('pok').hidden=false;$('pok').focus()});
  $('pagain').addEventListener('click',()=>{form.reset();$$('.err',form).forEach(x=>x.textContent='');$('pbody').hidden=false;$('psteps').hidden=false;$('pok').hidden=true;gostep(0)});
  $$('[data-tipo]').forEach(b=>b.addEventListener('click',()=>{
    const r=form.querySelector(`input[name=tipo][value="${b.dataset.tipo}"]`);if(r){r.checked=true;$('e-tipo').textContent='';gostep(1)}
    go('pa-contacto')}));
})();
(()=>{
  const form=$('jform');
  form.addEventListener('submit',e=>{e.preventDefault();
    const ok=[err('e-jn',$('jn').value.trim()?'':'Escribí tu nombre y apellido.'),err('e-jm',okMail($('jm').value.trim())?'':'Revisá el email: falta el @ o el dominio.')].every(Boolean);if(!ok)return;
    const n=form.querySelector('input[name=jp]:checked').value;
    $('jokText').textContent=`${$('jn').value.trim().split(' ')[0]}, te esperamos el sábado 24 de octubre a las 9:00 hs en Playa Grande (${n==='1'?'venís solo/a':'venís con '+n+' personas'}). Te escribimos a ${$('jm').value.trim()} con el punto de encuentro.`;
    $('jbody').hidden=true;$('jok').hidden=false;$('jok').focus()});
  $('jagain').addEventListener('click',()=>{form.reset();$$('.err',form).forEach(x=>x.textContent='');$('jbody').hidden=false;$('jok').hidden=true});
})();

/* ================= Aparición al scrollear (páginas internas) ================= */
/* Se marcan con .rv los bloques de cada sección: los contenedores de RV_GROUPS aportan cada hijo por separado
   (tarjetas, números, ítems) y los de RV_OPEN se recorren hacia adentro (columnas). Los que entran juntos
   en pantalla aparecen en cascada. Se repite cada vez que se entra a la página. */
const RV_GROUPS='.grid,.nums,.team,.board,.nl,.ben,.mosaic,.sumanums,.chips-l';
const RV_OPEN='div:not([class]),.split,.hist,.feat';
let rvIO=null;
function rvTag(box,depth){
  [...box.children].forEach(el=>{
    if(el.matches(RV_GROUPS))[...el.children].forEach(c=>c.classList.add('rv'));
    else if(depth<2&&el.matches(RV_OPEN))rvTag(el,depth+1);
    else el.classList.add('rv');
  });
}
function reveal(scr){
  if(reduce||!scr||scr.dataset.route==='')return;
  if(!rvIO)rvIO=new IntersectionObserver(es=>{
    es.filter(e=>e.isIntersecting)
      .sort((a,b)=>a.target.compareDocumentPosition(b.target)&Node.DOCUMENT_POSITION_FOLLOWING?-1:1)
      .forEach((e,k)=>{e.target.style.setProperty('--rd',Math.min(k,6)*90+'ms');e.target.classList.add('in');rvIO.unobserve(e.target)});
  },{rootMargin:'0px 0px -8% 0px'});
  if(!scr.dataset.rv){$$('.page-hero .wrap,.sec .wrap',scr).forEach(w=>rvTag(w,0));scr.dataset.rv='1'}
  $$('.rv',scr).forEach(el=>{el.classList.remove('in');rvIO.observe(el)});
}

/* fotos del equipo: si falta el archivo, se quita la imagen y quedan las iniciales */
$$('.av img').forEach(i=>{const bad=()=>i.remove();i.addEventListener('error',bad);if(i.complete&&!i.naturalWidth)bad()});

/* arranque */
route(true);
requestAnimationFrame(loop);
})();

