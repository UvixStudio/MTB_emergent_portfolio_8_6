import * as THREE from 'three';
import { createGlassDiamond } from './workshop-product-form-v2.mjs?v=20260929a';

// Lightweight preview system: shared geometry/textures and a fixed reusable pool.
export function createWorkshopProducts({ scene, model, camera, panel, onSelect, onHover }) {
  let lastHovered = null;
  const defaults = { count: 5, spacing: 1.3, speed: .32, size: 1, lift: .23, bob: .025, darkness: .7, paused: false };
  const settings = { ...defaults };
  const group = new THREE.Group(); group.name = 'Innovation_Products_POC'; scene.add(group);
  model.updateMatrixWorld(true);
  const find = name => {
    let found;
    model.traverse(o => { if (o.name.replaceAll('_', ' ') === name) found = o; });
    if (!found) throw new Error(`Product system requires ${name}`);
    return new THREE.Box3().setFromObject(found);
  };
  const left = find('Left shell'), right = find('Right shell');
  const belt = find('Belt continuous right angle');
  const beltY = belt.max.y + .006;
  const leftZ = (left.min.z + left.max.z) / 2;
  const rightX = (right.min.x + right.max.x) / 2;
  // Leave space for the complete platform inside the solid rear walls.
  const startX = left.min.x + .44, endZ = right.min.z + .44;
  const firstLeg = rightX - startX, secondLeg = leftZ - endZ, length = firstLeg + secondLeg;
  const exitAt = left.max.x - startX, entryAt = firstLeg + leftZ - right.max.z;
  const smooth = (a, b, x) => { const t = THREE.MathUtils.clamp((x-a)/(b-a), 0, 1); return t*t*(3-2*t); };
  const assets = [], geometries = [], textures = [], sharedMaterials = [];
  const ownGeo = g => (geometries.push(g), g);
  const ownMat = m => (sharedMaterials.push(m), m);
  function canvasTexture(draw, size=128) {
    const c=document.createElement('canvas'); c.width=c.height=size;
    draw(c.getContext('2d'),size);
    const t=new THREE.CanvasTexture(c); t.colorSpace=THREE.SRGBColorSpace; textures.push(t); return t;
  }
  const glowTexture=canvasTexture((ctx,s)=>{
    const g=ctx.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);
    g.addColorStop(0,'rgba(100,255,255,.9)'); g.addColorStop(.2,'rgba(0,220,250,.5)');
    g.addColorStop(.55,'rgba(0,200,240,.14)'); g.addColorStop(1,'rgba(0,190,240,0)');
    ctx.fillStyle=g; ctx.fillRect(0,0,s,s);
  });
  const shadeTexture=canvasTexture((ctx,s)=>{
    const g=ctx.createLinearGradient(0,0,0,s);
    g.addColorStop(0,'rgba(0,2,5,.96)'); g.addColorStop(.55,'rgba(0,2,5,.78)'); g.addColorStop(1,'rgba(0,2,5,.2)');
    ctx.fillStyle=g; ctx.fillRect(0,0,s,s);
  });
  const glyphs=['WEB','VIDEO','APP','AI'];
  const iconTextures=glyphs.map(kind=>canvasTexture((ctx)=>{
    ctx.strokeStyle='#b6f9ff'; ctx.fillStyle='#b6f9ff'; ctx.lineWidth=5; ctx.lineCap='round'; ctx.lineJoin='round';
    if(kind==='WEB'){
      ctx.strokeRect(22,33,84,62);ctx.beginPath();ctx.moveTo(22,48);ctx.lineTo(106,48);ctx.stroke();
      [32,42,52].forEach(x=>{ctx.beginPath();ctx.arc(x,40,1.5,0,Math.PI*2);ctx.fill();});
      ctx.beginPath();ctx.moveTo(45,63);ctx.lineTo(35,73);ctx.lineTo(45,83);ctx.moveTo(83,63);ctx.lineTo(93,73);ctx.lineTo(83,83);ctx.stroke();
    }else if(kind==='VIDEO'){
      ctx.beginPath();ctx.moveTo(46,30);ctx.lineTo(95,64);ctx.lineTo(46,98);ctx.closePath();ctx.stroke();
    }else if(kind==='APP'){
      ctx.beginPath();ctx.roundRect(39,20,50,88,9);ctx.stroke();ctx.beginPath();ctx.moveTo(54,29);ctx.lineTo(74,29);ctx.moveTo(57,98);ctx.lineTo(71,98);ctx.stroke();
    }else{
      const points=[[64,64],[64,24],[100,49],[88,100],[27,90],[24,42]];
      ctx.beginPath();points.slice(1).forEach(([x,y])=>{ctx.moveTo(64,64);ctx.lineTo(x,y);});ctx.stroke();
      points.forEach(([x,y],i)=>{ctx.beginPath();ctx.arc(x,y,i?6:10,0,Math.PI*2);ctx.fill();});
    }
  }));
  const iconMaterials=[];
  // icons.json lets the owner switch each slot between SVG and PNG without code edits.
  fetch('./product-icons/icons.json', {cache:'no-store'})
    .then(response=>{if(!response.ok)throw new Error('Icon manifest not found');return response.json();})
    .then(({products})=>{
      if(!Array.isArray(products)||products.length!==4)throw new Error('Expected four product icons');
      const loader=new THREE.TextureLoader();
      products.forEach((filename,slot)=>{
        if(!/^prod_[1-4]\.(svg|png|webp)$/i.test(filename))throw new Error(`Invalid product icon: ${filename}`);
        loader.load(`./product-icons/${filename}?v=${Date.now()}`,texture=>{
          texture.colorSpace=THREE.SRGBColorSpace;
          texture.minFilter=THREE.LinearFilter;
          textures.push(texture);
          iconMaterials.forEach(({material,index})=>{if(index%4===slot){material.map=texture;material.needsUpdate=true;}});
        },undefined,error=>console.warn('Could not load product icon',filename,error));
      });
    }).catch(error=>console.warn('Using built-in product icons:',error));
  const glassForm=createGlassDiamond(THREE);
  const diamondGeo=ownGeo(glassForm.geometry);
  const outlineGeo=ownGeo(glassForm.frontOutline);
  const rearOutlineGeo=ownGeo(glassForm.backOutline);
  const iconGeo=ownGeo(new THREE.PlaneGeometry(.235,.235));
  const baseGeo=ownGeo(new THREE.CylinderGeometry(.275,.29,.075,6));
  const rimGeo=ownGeo(new THREE.CylinderGeometry(.283,.283,.014,6));
  const topGeo=ownGeo(new THREE.CylinderGeometry(.252,.252,.008,6));
  const socketGeo=ownGeo(new THREE.CylinderGeometry(.083,.09,.018,20));
  const coreGeo=ownGeo(new THREE.CircleGeometry(.051,20));
  const coneGeo=ownGeo(new THREE.CylinderGeometry(.15,.022,1,16,1,true));
  const baseMat=ownMat(new THREE.MeshStandardMaterial({color:0x172632,metalness:.7,roughness:.33,transparent:true}));
  const topMat=ownMat(new THREE.MeshStandardMaterial({color:0x0b1922,metalness:.5,roughness:.4,transparent:true}));
  const cyanMat=ownMat(new THREE.MeshBasicMaterial({color:0x32def0,toneMapped:false,transparent:true}));
  const glassMat=ownMat(new THREE.MeshStandardMaterial({color:0x239ab1,metalness:.26,roughness:.13,emissive:0x063e4d,emissiveIntensity:.37,transparent:true,opacity:.57,depthWrite:false,side:THREE.DoubleSide}));
  const glassSideMat=ownMat(new THREE.MeshStandardMaterial({color:0x174d66,metalness:.42,roughness:.25,emissive:0x12475a,emissiveIntensity:.38,transparent:true,opacity:.92,depthWrite:false,side:THREE.DoubleSide}));
  const ribMat=ownMat(new THREE.MeshBasicMaterial({color:0x72e5f4,transparent:true,opacity:.68,toneMapped:false}));
  const ribGeo=ownGeo(new THREE.CylinderGeometry(.008,.008,.18,6));
  const edgeMat=ownMat(new THREE.LineBasicMaterial({color:0x71edff,transparent:true,opacity:.8,toneMapped:false,depthWrite:false}));
  const beamMat=ownMat(new THREE.MeshBasicMaterial({color:0x18dbea,transparent:true,opacity:.045,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));
  // Project icons: transparent billboards standing on the carriers (concept preview for the 3D series).
  // tv: media shown on the big screen when the product is clicked (images now, videos later).
  const PROJECTS=[
    {file:'winning-play',number:'01',title:'THE WINNING REPLAY',tv:{url:'tv/winning-play.mp4',kind:'video'}},
    {file:'bone-bash',number:'02',title:'BONE BASH 3D',tv:{url:'tv/bone-bash.mp4',kind:'video'}},
    {file:'invoices',number:'03',title:'INVOICE HARVESTER',tv:{url:'tv/invoices.webp',kind:'image'}},
    {file:'portfolio',number:'04',title:'TRAIL PORTFOLIO',tv:{url:'tv/portfolio.mp4',kind:'video'},scale:.8},
    {file:'rpsls',number:'05',title:'ROCK-PAPER-SCISSORS-LIZARD-SPOCK',tv:{url:'tv/rpsls.mp4',kind:'video'}},
  ];
  const ICON_MAX_W=.72, ICON_MAX_H=.58;  // shared envelope so every icon reads the same size on its hexagon
  const iconLoader=new THREE.TextureLoader();
  const projectTextures=PROJECTS.map(p=>{
    const t=iconLoader.load(`./project-icons/${p.file}.webp`,tex=>{
      assets.forEach(asset=>{if(asset.texture===tex)fitIcon(asset.icon,tex,asset.project);});
    });
    t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;textures.push(t);return t;
  });
  function fitIcon(icon,tex,project){
    const a=tex.image.width/tex.image.height,h=Math.min(ICON_MAX_H,ICON_MAX_W/a)*(project.scale||1);icon.scale.set(h*a,h,1);
  }
  // Ribbon uses the site's V2 typeface (Ruda, loaded in workshopV2.html).
  const RIBBON_FONT='Ruda, ui-sans-serif, sans-serif';
  document.fonts?.load('800 60px Ruda').catch(()=>{});
  // One canvas per project; redrawn only while the entrance animation runs.
  const RIBBON_W=780,RIBBON_H=150,TITLE_SIZE=52;   // same type size on every ribbon
  const SCRAMBLE='ABCDEFGHJKLMNPRSTUVWXYZ0123456789/#';
  function ribbonTexture(project){
    // Long titles widen the ribbon instead of shrinking the type, so every ribbon keeps TITLE_SIZE.
    const probe=document.createElement('canvas').getContext('2d');probe.font=`800 ${TITLE_SIZE}px ${RIBBON_FONT}`;
    const W=Math.max(RIBBON_W,Math.ceil(probe.measureText(project.title).width)+190),H=RIBBON_H,c=document.createElement('canvas');
    c.width=W;c.height=H;const g=c.getContext('2d');
    const k=26,shape=()=>{g.beginPath();g.moveTo(k,6);g.lineTo(W-6,6);g.lineTo(W-6,H-k);g.lineTo(W-k,H-6);g.lineTo(6,H-6);g.lineTo(6,k);g.closePath();};
    const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;textures.push(t);
    let last=-1;
    // reveal 0..1: amber tab slides in, then the title decodes left to right like a terminal readout.
    function draw(reveal){
      const step=Math.round(reveal*60);if(step===last)return;last=step;
      g.clearRect(0,0,W,H);
      shape();g.fillStyle='rgba(2,6,10,.97)';g.fill();
      g.save();shape();g.clip();g.strokeStyle='rgba(80,220,245,.05)';g.lineWidth=1;
      for(let x=0;x<W;x+=18){g.beginPath();g.moveTo(x,0);g.lineTo(x,H);g.stroke();}
      for(let y=0;y<H;y+=18){g.beginPath();g.moveTo(0,y);g.lineTo(W,y);g.stroke();}
      const tab=Math.min(1,reveal*3);
      g.fillStyle='#ffb21f';g.fillRect(6,6,118*tab,H-12);
      // Scan beam sweeping across while the text decodes.
      if(reveal<1){const sx=150+(W-170)*reveal;const beam=g.createLinearGradient(sx-60,0,sx+8,0);beam.addColorStop(0,'rgba(79,230,255,0)');beam.addColorStop(1,'rgba(79,230,255,.35)');g.fillStyle=beam;g.fillRect(sx-60,6,68,H-12);}
      g.restore();
      shape();g.strokeStyle='#4fe6ff';g.lineWidth=5;g.stroke();
      g.textBaseline='middle';
      if(tab>.6){g.fillStyle='#050b10';g.font=`800 62px ${RIBBON_FONT}`;g.textAlign='center';g.fillText(project.number,65,H/2+3);}
      g.font=`800 ${TITLE_SIZE}px ${RIBBON_FONT}`;g.textAlign='left';
      const text=project.title,shown=Math.max(0,Math.min(text.length,Math.floor((reveal-.25)/.7*text.length)));
      let out=text.slice(0,shown);
      if(shown<text.length&&reveal>.25)out+=[...text.slice(shown,shown+3)].map(ch=>ch===' '?' ':SCRAMBLE[(step*7+ch.charCodeAt(0))%SCRAMBLE.length]).join('');
      g.fillStyle='#e6fbff';g.fillText(out,150,H/2+3);
      if(reveal>=1){g.fillStyle='#4fe6ff';g.fillRect(150,H-32,70,5);g.fillRect(228,H-32,18,5);}
      t.needsUpdate=true;
    }
    draw(0);
    return {texture:t,aspect:W/H,width:W/RIBBON_W,draw};
  }
  const ribbonCache=new Map();
  let activeProject=null;
  const underGlowGeo=ownGeo(new THREE.PlaneGeometry(1.05,1.05));
  function makeProduct(i){
    const root=new THREE.Group();root.name=`Carrier_${i+1}`;group.add(root);
    const materials=[];
    const material=src=>{const m=src.clone();materials.push({m,opacity:m.opacity});return m;};
    const add=(geo,mat,y,parent=root)=>{const mesh=new THREE.Mesh(geo,Array.isArray(mat)?mat.map(material):material(mat));mesh.position.y=y;parent.add(mesh);return mesh;};
    const base=add(baseGeo,baseMat,.0375);const rim=add(rimGeo,cyanMat,.028);const top=add(topGeo,topMat,.079);add(socketGeo,topMat,.089);
    const project=PROJECTS[i%PROJECTS.length],texture=projectTextures[i%PROJECTS.length];
    const iconMat=material(new THREE.SpriteMaterial({map:texture,transparent:true,depthWrite:false}));
    // renderOrder keeps the icon drawn after the carrier's glowing centre, so it always stands on top of it.
    const icon=new THREE.Sprite(iconMat);icon.center.set(.5,0);icon.position.y=.1;icon.renderOrder=5;icon.scale.set(.45,.45,1);root.add(icon);
    if(texture.image)fitIcon(icon,texture,project);
    const groundGlow=add(ownGeo(new THREE.PlaneGeometry(.36,.36)),new THREE.MeshBasicMaterial({map:glowTexture,transparent:true,opacity:.28,depthWrite:false,blending:THREE.AdditiveBlending}),.101);
    groundGlow.rotation.x=-Math.PI/2;
    // Hover state: glow spills under the hexagon, ribbon names the project.
    const underGlow=new THREE.Mesh(underGlowGeo,new THREE.MeshBasicMaterial({map:glowTexture,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending}));
    underGlow.rotation.x=-Math.PI/2;underGlow.position.y=.004;root.add(underGlow);
    const ribbon=new THREE.Sprite(new THREE.SpriteMaterial({transparent:true,opacity:0,depthTest:false,depthWrite:false}));
    ribbon.center.set(.5,0);ribbon.renderOrder=10;root.add(ribbon);
    return {root,icon,texture,project,rim,groundGlow,underGlow,ribbon,hover:0,reveal:0,hit:[icon,base,top],materials,phase:Math.random()*Math.PI*2,frequency:.7+Math.random()*.25,previous:null};
  }
  for(let i=0;i<10;i++)assets.push(makeProduct(i));
  // Hover (roll-over) a product: the belt stops, the product lights up and shows its ribbon.
  const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();let hovered=null,pointerInside=false;
  addEventListener('pointermove',e=>{pointer.set(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1);pointerInside=e.target.tagName==='CANVAS';});
  addEventListener('pointerleave',()=>{pointerInside=false;});
  // Click (not an orbit drag) on a product sends its media to the big screen.
  let downAt=null;
  // Touch has no hover/pointermove before a tap, so the tap itself must set the pointer position.
  addEventListener('pointerdown',e=>{downAt=[e.clientX,e.clientY];pointer.set(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1);pointerInside=e.target.tagName==='CANVAS';});
  addEventListener('click',e=>{
    if(!downAt||Math.hypot(e.clientX-downAt[0],e.clientY-downAt[1])>6||e.target.tagName!=='CANVAS')return;
    const p=pick();if(p?.project.tv)onSelect?.(p.project);
  });
  function pick(){
    if(!pointerInside)return null;
    raycaster.setFromCamera(pointer,camera);
    const visible=assets.filter(p=>p.root.visible);
    const hits=raycaster.intersectObjects(visible.flatMap(p=>p.hit),false);
    return hits.length?visible.find(p=>p.hit.includes(hits[0].object)):null;
  }

  const veilShape=new THREE.Shape();
  veilShape.moveTo(-.455,0);veilShape.lineTo(.455,0);veilShape.lineTo(.455,.58);veilShape.lineTo(.31,.76);veilShape.lineTo(-.31,.76);veilShape.lineTo(-.455,.58);veilShape.closePath();
  const veilGeo=ownGeo(new THREE.ShapeGeometry(veilShape));
  const uv=veilGeo.attributes.uv, pos=veilGeo.attributes.position;
  for(let i=0;i<uv.count;i++)uv.setXY(i,(pos.getX(i)+.455)/.91,pos.getY(i)/.76);
  const veilMats=[];
  function gateEffect(side,bounds){
    const leftGate=side==='left';
    const front=leftGate?new THREE.Vector3(bounds.max.x,beltY,leftZ):new THREE.Vector3(rightX,beltY,bounds.max.z);
    const normal=leftGate?new THREE.Vector3(1,0,0):new THREE.Vector3(0,0,1);
    [.075,.38].forEach((depth,i)=>{
      const mat=ownMat(new THREE.MeshBasicMaterial({map:shadeTexture,transparent:true,opacity:settings.darkness*(i?.8:.55),depthWrite:false,side:THREE.DoubleSide}));
      veilMats.push({mat,factor:i?.8:.55});
      const veil=new THREE.Mesh(veilGeo,mat);veil.position.copy(front).addScaledVector(normal,-depth);
      if(leftGate)veil.rotation.y=Math.PI/2;group.add(veil);
    });
    const beacon=new THREE.Group();beacon.position.set((bounds.min.x+bounds.max.x)/2,bounds.max.y+.028,(bounds.min.z+bounds.max.z)/2);group.add(beacon);
    const foot=new THREE.Mesh(ownGeo(new THREE.CylinderGeometry(.095,.105,.035,12)),baseMat);beacon.add(foot);
    const capMat=ownMat(new THREE.MeshStandardMaterial({color:0x075264,emissive:0x00dfff,emissiveIntensity:.06,roughness:.24,metalness:.1}));
    const cap=new THREE.Mesh(ownGeo(new THREE.SphereGeometry(.075,12,6,0,Math.PI*2,0,Math.PI/2)),capMat);cap.position.y=.018;beacon.add(cap);
    const flareMat=ownMat(new THREE.SpriteMaterial({map:glowTexture,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending}));
    const flare=new THREE.Sprite(flareMat);flare.position.y=.07;flare.scale.set(.6,.6,1);beacon.add(flare);
    const blobMat=ownMat(new THREE.MeshBasicMaterial({map:glowTexture,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide}));
    const blob=new THREE.Mesh(ownGeo(new THREE.PlaneGeometry(1,1)),blobMat);blob.position.copy(front).addScaledVector(normal,.035);blob.position.y+=.3;if(leftGate)blob.rotation.y=Math.PI/2;group.add(blob);
    const light=new THREE.PointLight(0x16e7ff,0,1.4,2);light.position.copy(front).addScaledVector(normal,.15);light.position.y+=.4;group.add(light);
    return {age:99,capMat,flareMat,blobMat,blob,light,pulses:0};
  }
  const gates=[gateEffect('left',left),gateEffect('right',right)];
  let travel=.1, elapsed=0, effectiveCount=4, actualSpacing=length/4;
  const section=document.createElement('section');section.className='product-settings';section.dir='rtl';
  section.innerHTML=`<h3>מוצרים על המסוע</h3>
    <label>כמות מרבית <output id="productCountValue"></output><input id="productCount" aria-label="כמות מוצרים" type="range" min="2" max="10" step="1"></label>
    <label>מרווח מינימלי <output id="productSpacingValue"></output><input id="productSpacing" aria-label="מרווח מינימלי" type="range" min=".9" max="3.5" step=".1"></label>
    <label>מהירות <output id="productSpeedValue"></output><input id="productSpeed" aria-label="מהירות מוצרים" type="range" min=".1" max=".8" step=".02"></label>
    <label>גודל <output id="productSizeValue"></output><input id="productSize" aria-label="גודל מוצרים" type="range" min=".7" max="1.15" step=".05"></label>
    <label>גובה ריחוף <output id="productLiftValue"></output><input id="productLift" aria-label="גובה ריחוף" type="range" min=".08" max=".4" step=".01"></label>
    <label>תנודת ריחוף <output id="productBobValue"></output><input id="productBob" aria-label="תנודת ריחוף" type="range" min="0" max=".05" step=".005"></label>
    <label>החשכה בפתח <output id="productDarknessValue"></output><input id="productDarkness" aria-label="החשכה בפתח" type="range" min="0" max="1" step=".05"></label>
    <p id="productSummary" role="status"></p><p class="product-note">הכמות מותאמת למרווח. הגובה יורד אוטומטית ליד הפתחים.</p>
    <button id="productPause" type="button">השהיית המסוע</button><button id="productReset" type="button">איפוס מוצרים</button><div class="sep"></div>`;
  panel.prepend(section);
  const bindings=[['Count','count'],['Spacing','spacing'],['Speed','speed'],['Size','size'],['Lift','lift'],['Bob','bob'],['Darkness','darkness']];
  function refresh(){
    effectiveCount=Math.max(2,Math.min(settings.count,Math.floor(length/Math.max(settings.spacing,.9*settings.size))));
    actualSpacing=length/effectiveCount;
    assets.forEach(p=>p.previous=null);
    for(const [id,key] of bindings){
      section.querySelector('#product'+id).value=settings[key];
      section.querySelector('#product'+id+'Value').textContent=key==='count'?settings[key]:key==='size'?settings[key].toFixed(2)+'×':settings[key].toFixed(key==='bob'?3:2);
    }
    veilMats.forEach(({mat,factor})=>mat.opacity=settings.darkness*factor);
    section.querySelector('#productSummary').textContent=`${effectiveCount} מוצרים בלולאה · מרווח בפועל ${actualSpacing.toFixed(2)} · מעבר כל ${(actualSpacing/settings.speed).toFixed(1)} שנ׳`;
  }
  bindings.forEach(([id,key])=>section.querySelector('#product'+id).addEventListener('input',e=>{settings[key]=Number(e.target.value);refresh();}));
  const pause=section.querySelector('#productPause');
  pause.onclick=()=>{settings.paused=!settings.paused;pause.textContent=settings.paused?'הפעלת המסוע':'השהיית המסוע';pause.setAttribute('aria-pressed',String(settings.paused));};
  section.querySelector('#productReset').onclick=()=>{Object.assign(settings,defaults);travel=.1;elapsed=0;gates.forEach(g=>g.age=99);pause.textContent='השהיית המסוע';pause.setAttribute('aria-pressed','false');refresh();};
  refresh();
  const crossed=(old,next,at)=>old!==null && (next>=old ? old<at&&next>=at : old<at||next>=at);
  function update(dt){
    dt=Math.min(dt,.05);
    hovered=pick();document.body.style.cursor=hovered?'pointer':'';
    if(hovered!==lastHovered){lastHovered=hovered;if(hovered)onHover?.(hovered.project);}
    const running=!settings.paused&&!hovered;
    if(running){travel+=dt*settings.speed;elapsed+=dt;}
    assets.forEach((p,i)=>{
      p.root.visible=i<effectiveCount;if(!p.root.visible)return;
      const distance=(travel+i*actualSpacing)%length;
      const x=distance<firstLeg?startX+distance:rightX;
      const z=distance<firstLeg?leftZ:leftZ-(distance-firstLeg);
      p.root.position.set(x,beltY,z);p.root.scale.setScalar(settings.size);
      // The complete billboard must clear the casing before it rises.
      const clearance=.38*settings.size;
      const rise=smooth(exitAt+clearance,exitAt+clearance+.65,distance);
      const fall=1-smooth(entryAt-clearance-.65,entryAt-clearance,distance);
      const envelope=Math.min(rise,fall);
      const flutter=(Math.sin(elapsed*p.frequency+p.phase)*.7+Math.sin(elapsed*p.frequency*1.61+p.phase*2)*.3)*settings.bob*envelope;
      const visibility=smooth(0,.22,distance)*(1-smooth(length-.22,length,distance));
      p.materials.forEach(({m,opacity})=>{m.opacity=opacity*visibility;});
      // Hover highlight eases in/out.
      // Lit when hovered, or when it is the project currently playing on the TV.
      const lit=p===hovered||(!hovered&&activeProject&&p.project===activeProject);
      p.hover+=((lit?1:0)-p.hover)*Math.min(1,dt*10);
      const h=p.hover*visibility;
      p.underGlow.material.opacity=Math.min(1,h*1.4);p.underGlow.scale.setScalar(1+h*.35);
      p.groundGlow.material.opacity=(.28+h*.6)*visibility;
      p.rim.material.color.setRGB(.2+h*.8,.87+h*.13,.94+h*.06);
      p.icon.position.y=.1+h*.03;
      // Ribbon entrance: unfolds sideways with a small overshoot, slides up, then the title decodes.
      p.reveal=lit?Math.min(1,p.reveal+dt/.9):(h<.02?0:p.reveal);
      if(h>.01){
        if(!ribbonCache.has(p.project))ribbonCache.set(p.project,ribbonTexture(p.project));
        const r=ribbonCache.get(p.project);
        if(p.ribbon.material.map!==r.texture){p.ribbon.material.map=r.texture;p.ribbon.material.needsUpdate=true;}
        if(lit)r.draw(p.reveal);
        const u=Math.min(1,p.reveal*3),back=1+2.2*Math.pow(u-1,3)+1.2*Math.pow(u-1,2);   // easeOutBack
        const w=1.05*r.width;p.ribbon.scale.set(w*Math.max(.02,back),w/r.aspect*(.35+.65*Math.min(1,u*1.5)),1);
      }
      p.ribbon.material.opacity=h;p.ribbon.visible=h>.01;
      p.ribbon.position.set(0,.1+p.icon.scale.y+.03+.05*Math.min(1,p.reveal*3),0);
      if(running){
        if(crossed(p.previous,distance,exitAt+.16)){gates[0].age=0;gates[0].pulses++;}
        if(crossed(p.previous,distance,entryAt-.16)){gates[1].age=0;gates[1].pulses++;}
      }
      p.previous=distance;
    });
    gates.forEach(g=>{
      if(running)g.age+=dt;
      const strength=g.age<.8?Math.sin(Math.min(1,g.age/.09)*Math.PI/2)*Math.pow(1-g.age/.8,2):0;
      g.capMat.emissiveIntensity=.06+strength*3;g.flareMat.opacity=strength*.75;g.blobMat.opacity=strength*.35;g.light.intensity=strength*2.2;
      g.blob.scale.setScalar(.8+Math.min(g.age,.8)*.7);
    });
  }
  return {update,settings,isHalted:()=>settings.paused||!!hovered,
    projects:PROJECTS,setActive:project=>{activeProject=project||null;},snapshot:()=>({...settings,effectiveCount,actualSpacing}),
    diagnostics:()=>({length,exitAt,entryAt,effectiveCount,pulses:gates.map(g=>g.pulses)})};
}
