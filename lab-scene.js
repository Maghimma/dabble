// Shared lab room for the walk-around (and diorama) demo.
// Coords: floor top at y=0, bench tops ~0.9, eye height ~1.55.
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/geometries/RoundedBoxGeometry.js';

const M=(c,r)=>new THREE.MeshStandardMaterial({color:c,roughness:r==null?0.6:r,metalness:0.04});
const metal=(c)=>new THREE.MeshStandardMaterial({color:c,roughness:0.28,metalness:0.9,envMapIntensity:1.2});
function glass(c,mobile){ return mobile
  ? new THREE.MeshPhysicalMaterial({color:c,transparent:true,opacity:0.42,roughness:0.08,clearcoat:1,envMapIntensity:1.4,side:THREE.DoubleSide})
  : new THREE.MeshPhysicalMaterial({color:0xffffff,transmission:0.92,thickness:0.6,roughness:0.06,ior:1.35,transparent:true,envMapIntensity:1.4,side:THREE.DoubleSide}); }
const liquid=(c)=>new THREE.MeshStandardMaterial({color:c,roughness:0.25,transparent:true,opacity:0.92});

// ---- interactive sim objects (base sits at y=0) ----
function beaker(mob){ const g=new THREE.Group();
  const wall=new THREE.Mesh(new THREE.CylinderGeometry(0.42,0.42,0.85,36,1,true),glass(0x9fd0ff,mob)); wall.position.y=0.42; wall.castShadow=true; g.add(wall);
  const bot=new THREE.Mesh(new THREE.CylinderGeometry(0.42,0.42,0.05,36),glass(0x9fd0ff,mob)); bot.position.y=0.03; g.add(bot);
  const liq=new THREE.Mesh(new THREE.CylinderGeometry(0.38,0.38,0.5,30),liquid(0x37b6ff)); liq.position.y=0.29; g.add(liq); return g; }
function flask(mob){ const g=new THREE.Group();
  const body=new THREE.Mesh(new THREE.CylinderGeometry(0.14,0.5,0.75,36,1,true),glass(0xd9c2ff,mob)); body.position.y=0.38; body.castShadow=true; g.add(body);
  const base=new THREE.Mesh(new THREE.CircleGeometry(0.5,36),glass(0xd9c2ff,mob)); base.rotation.x=-Math.PI/2; base.position.y=0.004; g.add(base);
  const neck=new THREE.Mesh(new THREE.CylinderGeometry(0.13,0.13,0.35,24,1,true),glass(0xd9c2ff,mob)); neck.position.y=0.9; g.add(neck);
  const liq=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.4,0.42,30),liquid(0xb061ff)); liq.position.y=0.23; g.add(liq); return g; }
function atom(){ const g=new THREE.Group(); const c=new THREE.Group(); c.position.y=0.85;
  const nuc=new THREE.Mesh(new THREE.SphereGeometry(0.22,28,28),new THREE.MeshStandardMaterial({color:0x2ec4b6,emissive:0x0c5a52,emissiveIntensity:0.5,roughness:0.3})); nuc.castShadow=true; c.add(nuc);
  const rm=new THREE.MeshStandardMaterial({color:0x5b9bff,roughness:0.4,metalness:0.3}); const els=[];
  [[0,0],[Math.PI/2.4,0.7],[Math.PI/2.6,-0.8]].forEach((t,i)=>{ const r=0.4+i*0.22;
    const ring=new THREE.Mesh(new THREE.TorusGeometry(r,0.012,10,60),rm); ring.rotation.set(t[0],t[1],0); c.add(ring);
    const e=new THREE.Mesh(new THREE.SphereGeometry(0.07,16,16),new THREE.MeshStandardMaterial({color:0xf6a623,emissive:0x6b4500,emissiveIntensity:0.6})); c.add(e); els.push({e,r,rx:t[0],ry:t[1],sp:0.9+i*0.5,ph:i*2}); });
  const stem=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,0.42,12),metal(0xbfc6d0)); stem.position.y=0.32; g.add(stem);
  const foot=new THREE.Mesh(new THREE.CylinderGeometry(0.24,0.27,0.08,20),metal(0xbfc6d0)); foot.position.y=0.04; foot.castShadow=true; g.add(foot,c);
  g.userData.tick=(t)=>{ els.forEach(o=>{ const a=t*o.sp+o.ph; const v=new THREE.Vector3(Math.cos(a)*o.r,0,Math.sin(a)*o.r); v.applyEuler(new THREE.Euler(o.rx,o.ry,0)); o.e.position.copy(v); }); }; return g; }
function spring(){ const pts=[]; const coils=7,h=1.1,r=0.32;
  for(let i=0;i<=coils*36;i++){ const a=i/36*Math.PI*2; pts.push(new THREE.Vector3(Math.cos(a)*r,i/(coils*36)*h,Math.sin(a)*r)); }
  const tube=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),200,0.055,9,false),metal(0xc6ccd6)); tube.castShadow=true;
  const g=new THREE.Group(); g.add(tube); g.userData.tick=(t)=>{ g.scale.y=1+Math.sin(t*1.6)*0.12; }; return g; }
function bulb(){ const g=new THREE.Group();
  const batt=new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.3,0.7,28),M(0x2b6cff,0.4)); batt.position.y=0.35; batt.castShadow=true; g.add(batt);
  const gm=new THREE.MeshStandardMaterial({color:0xfff2b0,emissive:0xffd34d,emissiveIntensity:0.5,roughness:0.15});
  const b=new THREE.Mesh(new THREE.SphereGeometry(0.32,28,28),gm); b.position.y=1.15; b.scale.y=1.25; b.castShadow=true; g.add(b);
  const screw=new THREE.Mesh(new THREE.CylinderGeometry(0.16,0.16,0.22,18),metal(0xbfc6d0)); screw.position.y=0.85; g.add(screw);
  g.userData.tick=(t)=>{ gm.emissiveIntensity=0.45+Math.sin(t*2.2)*0.35; }; return g; }
function dice(){ function face(n){ const cv=document.createElement('canvas'); cv.width=cv.height=128; const x=cv.getContext('2d');
    x.fillStyle='#fdfdfd'; x.fillRect(0,0,128,128); x.fillStyle='#16243a';
    const pp={1:[[64,64]],2:[[36,36],[92,92]],3:[[36,36],[64,64],[92,92]],4:[[36,36],[92,36],[36,92],[92,92]],5:[[36,36],[92,36],[64,64],[36,92],[92,92]],6:[[36,32],[92,32],[36,64],[92,64],[36,96],[92,96]]};
    pp[n].forEach(d=>{x.beginPath();x.arc(d[0],d[1],13,0,7);x.fill();}); const t=new THREE.CanvasTexture(cv); t.anisotropy=4; return t; }
  const mats=[1,6,2,5,3,4].map(n=>new THREE.MeshStandardMaterial({map:face(n),roughness:0.35}));
  const d=new THREE.Mesh(new RoundedBoxGeometry(0.8,0.8,0.8,6,0.12),mats); d.position.y=0.5; d.castShadow=true;
  const g=new THREE.Group(); g.add(d); g.userData.tick=(t)=>{ d.rotation.y=t*0.5; d.rotation.x=Math.sin(t*0.6)*0.25; }; return g; }

// ---- furniture (decorative, non-interactive) ----
function deco(kind,color){ const g=new THREE.Group();
  if(kind==='flask'){ const b=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.18,0.28,16),new THREE.MeshStandardMaterial({color,roughness:0.15,transparent:true,opacity:0.8})); b.position.y=0.14;
    const n=new THREE.Mesh(new THREE.CylinderGeometry(0.045,0.045,0.13,12),new THREE.MeshStandardMaterial({color:0xcfe0ee,roughness:0.15,transparent:true,opacity:0.7})); n.position.y=0.34; g.add(b,n); }
  else if(kind==='jar'){ const b=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.12,0.24,16),new THREE.MeshStandardMaterial({color,roughness:0.2,transparent:true,opacity:0.85})); b.position.y=0.12; g.add(b); }
  else { const b=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,0.32,16),new THREE.MeshStandardMaterial({color,roughness:0.2,transparent:true,opacity:0.85})); b.position.y=0.16;
    const cap=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,0.08,12),M(0x44506a,0.4)); cap.position.y=0.36; g.add(b,cap); }
  g.traverse(o=>{if(o.isMesh)o.castShadow=true;}); return g; }
function counter(len){ const g=new THREE.Group();
  const body=new THREE.Mesh(new THREE.BoxGeometry(len,0.85,0.6),M(0xe2e6ec,0.6)); body.position.y=0.43; body.castShadow=true; body.receiveShadow=true; g.add(body);
  const top=new THREE.Mesh(new THREE.BoxGeometry(len+0.06,0.08,0.66),M(0x2b3340,0.5)); top.position.y=0.9; g.add(top);
  const n=Math.max(2,Math.round(len/1.1));
  for(let i=0;i<n;i++){ const x=-len/2+(i+0.5)*(len/n);
    const door=new THREE.Mesh(new THREE.BoxGeometry(len/n-0.08,0.62,0.02),M(0xf2f5f9,0.5)); door.position.set(x,0.43,0.31); g.add(door);
    const h=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.12,0.03),metal(0xb9c0cb)); h.position.set(x+len/n/2-0.12,0.43,0.33); g.add(h); }
  return g; }
function shelf(len,n){ const g=new THREE.Group();
  const board=new THREE.Mesh(new THREE.BoxGeometry(len,0.05,0.28),M(0xf2f5f9,0.6)); board.castShadow=true; g.add(board);
  const cols=[0x9fd0ff,0xffb3b3,0xc9b3ff,0xbdebd6,0xffe0a3,0x8ce0d6];
  for(let i=0;i<n;i++){ const d=deco(i%3===0?'flask':(i%3===1?'jar':'bottle'),cols[i%cols.length]); d.position.set(-len/2+0.3+i*(len-0.6)/(n-1||1),0.03,0); g.add(d); } return g; }
function fumeHood(){ const g=new THREE.Group();
  const cab=new THREE.Mesh(new THREE.BoxGeometry(2.0,2.4,0.8),M(0xe6eaf0,0.6)); cab.position.y=1.2; cab.castShadow=true; g.add(cab);
  const open=new THREE.Mesh(new THREE.BoxGeometry(1.7,1.05,0.06),new THREE.MeshStandardMaterial({color:0x1a2230,roughness:0.4})); open.position.set(0,1.0,0.41); g.add(open);
  const sash=new THREE.Mesh(new THREE.PlaneGeometry(1.7,0.6),new THREE.MeshPhysicalMaterial({color:0xbfe0ff,transparent:true,opacity:0.3,roughness:0.1,side:THREE.DoubleSide})); sash.position.set(0,1.75,0.42); g.add(sash);
  [-0.5,0,0.5].forEach((x,i)=>{ const d=deco('bottle',[0x9fd0ff,0xffb3b3,0xc9b3ff][i]); d.position.set(x,0.55,0.32); g.add(d); }); return g; }
function poster(maker,w,h){ const g=new THREE.Group(); const board=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:maker()})); g.add(board);
  const fr=new THREE.Mesh(new THREE.BoxGeometry(w+0.12,h+0.12,0.05),M(0x2b3340,0.5)); fr.position.z=-0.03; g.add(fr); return g; }
function ptableTex(){ const cv=document.createElement('canvas'); cv.width=360; cv.height=230; const x=cv.getContext('2d'); x.fillStyle='#0f1b2e'; x.fillRect(0,0,360,230);
  const cols=['#5b9bff','#2ec4b6','#f6a623','#c084fc','#ff8f6b','#8ce99a']; for(let r=0;r<6;r++)for(let k=0;k<18;k++){ x.fillStyle=cols[(r+k)%cols.length]; x.fillRect(10+k*19,46+r*28,16,24);} x.fillStyle='#eaf1f7'; x.font='700 22px sans-serif'; x.textAlign='center'; x.fillText('PERIODIC TABLE',180,28); return new THREE.CanvasTexture(cv); }
function boardTex(){ const cv=document.createElement('canvas'); cv.width=400; cv.height=240; const x=cv.getContext('2d'); x.fillStyle='#fbfdff'; x.fillRect(0,0,400,240); x.fillStyle='#16243a'; x.font='700 30px sans-serif'; x.fillText('2H₂ + O₂ → 2H₂O',26,58);
  x.strokeStyle='#2ec4b6'; x.lineWidth=4; x.beginPath(); x.moveTo(30,120); x.bezierCurveTo(120,86,230,170,370,96); x.stroke(); x.strokeStyle='#f6a623'; x.beginPath(); x.moveTo(30,210); x.lineTo(370,150); x.stroke(); x.fillStyle='#6e6e73'; x.font='600 18px sans-serif'; x.fillText('rate vs temperature',140,206); return new THREE.CanvasTexture(cv); }
function clock(){ const g=new THREE.Group(); const face=new THREE.Mesh(new THREE.CircleGeometry(0.42,40),M(0xffffff,0.5)); g.add(face);
  const rim=new THREE.Mesh(new THREE.TorusGeometry(0.42,0.04,12,40),M(0x2b3340,0.5)); g.add(rim);
  const hh=new THREE.Mesh(new THREE.BoxGeometry(0.035,0.22,0.02),M(0x16243a)); hh.position.set(0,0.06,0.02); g.add(hh);
  const mh=new THREE.Mesh(new THREE.BoxGeometry(0.025,0.32,0.02),M(0x16243a)); mh.position.set(0.08,0.04,0.02); mh.rotation.z=-1.1; g.add(mh); return g; }
function stool(){ const g=new THREE.Group(); const seat=new THREE.Mesh(new THREE.CylinderGeometry(0.26,0.26,0.08,20),M(0x2ec4b6,0.5)); seat.position.y=0.62; seat.castShadow=true; g.add(seat);
  for(let i=0;i<4;i++){ const a=i/4*Math.PI*2+0.4; const leg=new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.025,0.62,8),metal(0xb9c0cb)); leg.position.set(Math.cos(a)*0.18,0.31,Math.sin(a)*0.18); leg.castShadow=true; g.add(leg);} return g; }
function plant(){ const g=new THREE.Group(); const pot=new THREE.Mesh(new THREE.CylinderGeometry(0.24,0.17,0.34,16),M(0xc98a5a,0.6)); pot.position.y=0.17; pot.castShadow=true; g.add(pot);
  [[0,0.58,0],[0.14,0.52,0.1],[-0.12,0.54,-0.08],[0.02,0.66,-0.04]].forEach(p=>{ const f=new THREE.Mesh(new THREE.SphereGeometry(0.22,16,16),M(0x4caf6e,0.7)); f.position.set(p[0],p[1]+0.06,p[2]); f.scale.set(1,1.2,1); f.castShadow=true; g.add(f); }); return g; }
function doorway(){ const g=new THREE.Group(); const d=new THREE.Mesh(new THREE.BoxGeometry(1.3,2.6,0.1),M(0xdce1e8,0.5)); d.position.y=1.3; g.add(d);
  const fr=new THREE.Mesh(new THREE.BoxGeometry(1.54,2.84,0.06),M(0xb9c0cb,0.5)); fr.position.set(0,1.42,-0.03); g.add(fr);
  const knob=new THREE.Mesh(new THREE.SphereGeometry(0.06,12,12),metal(0xd9b441)); knob.position.set(0.48,1.2,0.07); g.add(knob); return g; }

// ---- bench + sign (interactive stations) ----
function bench(w,d){ const g=new THREE.Group();
  const top=new THREE.Mesh(new RoundedBoxGeometry(w,0.16,d,3,0.06),M(0xf1ece1,0.7)); top.position.y=0.86; top.castShadow=true; top.receiveShadow=true; g.add(top);
  const lx=w/2-0.3, lz=d/2-0.3;
  [[-lx,-lz],[lx,-lz],[-lx,lz],[lx,lz]].forEach(p=>{ const leg=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,0.86,12),metal(0xb9c0cb)); leg.position.set(p[0],0.43,p[1]); leg.castShadow=true; g.add(leg); });
  return g; }
function sign(text,color){ const cv=document.createElement('canvas'); cv.width=320; cv.height=90; const x=cv.getContext('2d');
  x.fillStyle='#ffffff'; x.beginPath(); x.roundRect(0,0,320,90,22); x.fill(); x.fillStyle=color; x.fillRect(0,0,12,90);
  x.fillStyle='#16243a'; x.font='700 40px -apple-system,sans-serif'; x.textAlign='center'; x.textBaseline='middle'; x.fillText(text,166,48);
  const t=new THREE.CanvasTexture(cv); t.anisotropy=4; const g=new THREE.Group();
  const board=new THREE.Mesh(new THREE.PlaneGeometry(1.4,0.4),new THREE.MeshBasicMaterial({map:t,transparent:true})); board.position.y=1.95; g.add(board);
  const post=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,1.1,8),metal(0xb9c0cb)); post.position.y=1.4; g.add(post); return g; }

// ---- assemble the room ----
export function buildScene(scene, opts={}){
  const mob=!!opts.mobile;
  // floor (top at y=0) + soft rug
  const floor=new THREE.Mesh(new THREE.BoxGeometry(28,0.3,24), M(0xe9ecf2,0.96)); floor.position.y=-0.15; floor.receiveShadow=true; scene.add(floor);
  const rug=new THREE.Mesh(new THREE.CircleGeometry(7,48), M(0xdce6f4,0.95)); rug.rotation.x=-Math.PI/2; rug.position.y=0.01; scene.add(rug);
  // walls (0..9) + ceiling
  const wallMat=M(0xeef1f7,0.9);
  const back=new THREE.Mesh(new THREE.BoxGeometry(28,9,0.4),wallMat); back.position.set(0,4.5,-12); back.receiveShadow=true; scene.add(back);
  const left=new THREE.Mesh(new THREE.BoxGeometry(0.4,9,24),wallMat); left.position.set(-14,4.5,0); left.receiveShadow=true; scene.add(left);
  const right=new THREE.Mesh(new THREE.BoxGeometry(0.4,9,24),wallMat); right.position.set(14,4.5,0); right.receiveShadow=true; scene.add(right);
  const front=new THREE.Mesh(new THREE.BoxGeometry(28,9,0.4),wallMat); front.position.set(0,4.5,12); scene.add(front);
  const ceil=new THREE.Mesh(new THREE.BoxGeometry(28,0.3,24),M(0xf4f6fa,0.95)); ceil.position.y=9; scene.add(ceil);
  [[-6,-3],[6,-3],[-6,4],[6,4],[0,0.5]].forEach(p=>{ const panel=new THREE.Mesh(new THREE.BoxGeometry(2.4,0.08,1.2),new THREE.MeshStandardMaterial({color:0xffffff,emissive:0xffffff,emissiveIntensity:0.8,roughness:0.4})); panel.position.set(p[0],8.85,p[1]); scene.add(panel); });
  // window on back wall (sky)
  const sky=document.createElement('canvas'); sky.width=8; sky.height=64; const sgx=sky.getContext('2d');
  const grd=sgx.createLinearGradient(0,0,0,64); grd.addColorStop(0,'#bfe0ff'); grd.addColorStop(1,'#eaf6ff'); sgx.fillStyle=grd; sgx.fillRect(0,0,8,64);
  const win=new THREE.Mesh(new THREE.PlaneGeometry(7,2.4), new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(sky)})); win.position.set(-3.5,6.1,-11.78); scene.add(win);
  const winFr=new THREE.Mesh(new THREE.BoxGeometry(7.3,2.7,0.14),M(0xdfe3ea,0.7)); winFr.position.set(-3.5,6.1,-11.86); scene.add(winFr);

  // furniture
  function addCounter(x){ const c=counter(13); c.position.set(x,0,-1.5); c.rotation.y=Math.PI/2; scene.add(c);
    const cols=[0x9fd0ff,0xffb3b3,0xc9b3ff,0xbdebd6,0xffe0a3,0x8ce0d6];
    for(let i=0;i<7;i++){ const d=deco(i%3===0?'flask':(i%3===1?'jar':'bottle'),cols[i%cols.length]); d.position.set(-5.4+i*1.7,0.93,0); c.add(d); } }
  addCounter(-13.2); addCounter(13.2);
  [[-13.4,1.9,-1.5],[13.4,1.9,-1.5],[13.4,3.0,4]].forEach(p=>{ const sh=shelf(5,6); sh.position.set(p[0],p[1],p[2]); sh.rotation.y=Math.PI/2; scene.add(sh); });
  const fh=fumeHood(); fh.position.set(-8.5,0,-11.0); scene.add(fh);
  const pt=poster(ptableTex,3,2); pt.position.set(8.5,3.0,-11.78); scene.add(pt);
  const wb=poster(boardTex,3.4,2.04); wb.position.set(2.5,2.7,-11.78); scene.add(wb);
  const ck=clock(); ck.position.set(7.5,6.4,-11.76); scene.add(ck);
  [[-12.6,10.5],[12.6,10.5],[-12.6,-10.5]].forEach(p=>{ const pl=plant(); pl.position.set(p[0],0,p[1]); scene.add(pl); });
  const dr=doorway(); dr.position.set(6,0,11.78); dr.rotation.y=Math.PI; scene.add(dr);

  // interactive stations
  const pickables=[];
  const TOP=0.94;
  function placeObj(make,href,name,x,z,parent){ const inner=make(mob); const outer=new THREE.Group(); outer.position.set(x,TOP,z); outer.add(inner);
    outer.userData={href,name,inner,tick:inner.userData&&inner.userData.tick,base:TOP,hover:0}; inner.traverse(o=>{if(o.isMesh)o.castShadow=true;}); parent.add(outer); pickables.push(outer); }
  const stations=[
    {color:'#2ec4b6',name:'Chemistry',cx:-4.5,cz:-4,w:4.4,d:2.4,items:[[beaker,'states.html','States of Matter',-1.3,0],[flask,'equilibrium.html','Le Chatelier',0.1,0],[atom,'atom.html','Atomic Structure',1.4,0]]},
    {color:'#5b9bff',name:'Physics',cx:4.6,cz:-4,w:3.4,d:2.4,items:[[spring,'hooke.html',"Hooke's Law",-0.7,0],[bulb,'circuits.html','Circuits',0.8,0]]},
    {color:'#f6a623',name:'Maths',cx:0,cz:2.6,w:2.4,d:2.0,items:[[dice,'probability.html','Probability',0,0]]},
  ];
  const stools=[[-2.6,-2.4],[6.6,-2.4],[1.6,4.0]];
  stations.forEach((st,i)=>{ const g=new THREE.Group(); g.position.set(st.cx,0,st.cz); scene.add(g);
    g.add(bench(st.w,st.d));
    const s=sign(st.name,st.color); s.position.set(0,0,-st.d/2-0.05); g.add(s);
    const disc=new THREE.Mesh(new THREE.CircleGeometry(Math.max(st.w,st.d)/2+0.5,40),new THREE.MeshBasicMaterial({color:new THREE.Color(st.color),transparent:true,opacity:0.10})); disc.rotation.x=-Math.PI/2; disc.position.y=0.02; g.add(disc);
    st.items.forEach(it=>placeObj(it[0],it[1],it[2],it[3],it[4],g));
    const so=stool(); so.position.set(stools[i][0],0,stools[i][1]); scene.add(so);
  });

  function update(t){ pickables.forEach(o=>{ if(o.userData.tick)o.userData.tick(t); }); }
  return {pickables, update, bounds:{x:13.0,z:11.0}};
}
