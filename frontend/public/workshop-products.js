import * as THREE from 'three';

// Lightweight preview system: shared geometry/textures and a fixed reusable pool.
export function createWorkshopProducts({ scene, model, camera, panel }) {
  const defaults = { count: 4, spacing: 1.7, speed: .32, size: 1, lift: .23, bob: .025, darkness: .7, paused: false };
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
  function roundedSquare(w,r){
    const s=new THREE.Shape(), a=-w/2,b=w/2;
    s.moveTo(a+r,a);s.lineTo(b-r,a);s.quadraticCurveTo(b,a,b,a+r);
    s.lineTo(b,b-r);s.quadraticCurveTo(b,b,b-r,b);s.lineTo(a+r,b);s.quadraticCurveTo(a,b,a,b-r);
    s.lineTo(a,a+r);s.quadraticCurveTo(a,a,a+r,a);return s;
  }
  const shape=roundedSquare(.30,.047);
  const diamondGeo=ownGeo(new THREE.ExtrudeGeometry(shape,{depth:.065,bevelEnabled:true,bevelSize:.008,bevelThickness:.008,bevelSegments:2,curveSegments:5,steps:1}));
  diamondGeo.translate(0,0,-.0325);
  const outlineGeo=ownGeo(new THREE.BufferGeometry().setFromPoints(shape.getPoints(32).map(p=>new THREE.Vector3(p.x,p.y,.041))));
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
  const glassMat=ownMat(new THREE.MeshStandardMaterial({color:0x239ab1,metalness:.36,roughness:.19,emissive:0x033c4b,emissiveIntensity:.25,transparent:true,opacity:.44,depthWrite:false,side:THREE.DoubleSide}));
  const edgeMat=ownMat(new THREE.LineBasicMaterial({color:0x71edff,transparent:true,opacity:.8,toneMapped:false,depthWrite:false}));
  const beamMat=ownMat(new THREE.MeshBasicMaterial({color:0x18dbea,transparent:true,opacity:.045,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));
  function makeProduct(i){
    const root=new THREE.Group();root.name=`Carrier_${i+1}`;group.add(root);
    const materials=[];
    const material=src=>{const m=src.clone();materials.push({m,opacity:m.opacity});return m;};
    const add=(geo,mat,y,parent=root)=>{const mesh=new THREE.Mesh(geo,material(mat));mesh.position.y=y;parent.add(mesh);return mesh;};
    add(baseGeo,baseMat,.0375); add(rimGeo,cyanMat,.028); add(topGeo,topMat,.079);add(socketGeo,topMat,.089);
    const core=add(coreGeo,cyanMat,.100);core.rotation.x=-Math.PI/2;
    const beam=add(coneGeo,beamMat,0);
    const floating=new THREE.Group();root.add(floating);
    const diamond=add(diamondGeo,glassMat,0,floating);diamond.rotation.z=Math.PI/4;
    const outline=new THREE.LineLoop(outlineGeo,material(edgeMat));outline.rotation.z=Math.PI/4;floating.add(outline);
    const rearOutline=new THREE.LineLoop(outlineGeo,material(edgeMat));rearOutline.rotation.z=Math.PI/4;rearOutline.position.z=-.082;floating.add(rearOutline);
    const glyphMat=new THREE.MeshBasicMaterial({map:iconTextures[i%4],transparent:true,depthWrite:false,toneMapped:false});
    const glyph=new THREE.Mesh(iconGeo,glyphMat);glyph.position.z=.047;floating.add(glyph);materials.push({m:glyphMat,opacity:1});
    iconMaterials.push({material:glyphMat,index:i});
    const groundGlow=new THREE.Mesh(ownGeo(new THREE.PlaneGeometry(.36,.36)),material(new THREE.MeshBasicMaterial({map:glowTexture,transparent:true,opacity:.28,depthWrite:false,blending:THREE.AdditiveBlending})));
    groundGlow.rotation.x=-Math.PI/2;groundGlow.position.y=.101;root.add(groundGlow);
    return {root,floating,beam,materials,phase:Math.random()*Math.PI*2,frequency:.7+Math.random()*.25,previous:null};
  }
  for(let i=0;i<9;i++)assets.push(makeProduct(i));

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
    <label>כמות מרבית <output id="productCountValue"></output><input id="productCount" aria-label="כמות מוצרים" type="range" min="2" max="9" step="1"></label>
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
    dt=Math.min(dt,.05);if(!settings.paused){travel+=dt*settings.speed;elapsed+=dt;}
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
      const gap=.035+settings.lift*envelope+flutter;
      // .225 is a conservative bounding radius of the rounded, extruded tile.
      p.floating.position.y=.10+.225+Math.max(.02,gap);
      p.floating.quaternion.copy(camera.quaternion);
      p.beam.scale.y=Math.max(.02,gap);p.beam.position.y=.10+gap/2;
      const visibility=smooth(0,.22,distance)*(1-smooth(length-.22,length,distance));
      p.materials.forEach(({m,opacity})=>{m.opacity=opacity*visibility;});
      if(!settings.paused){
        if(crossed(p.previous,distance,exitAt+.16)){gates[0].age=0;gates[0].pulses++;}
        if(crossed(p.previous,distance,entryAt-.16)){gates[1].age=0;gates[1].pulses++;}
      }
      p.previous=distance;
    });
    gates.forEach(g=>{
      if(!settings.paused)g.age+=dt;
      const strength=g.age<.8?Math.sin(Math.min(1,g.age/.09)*Math.PI/2)*Math.pow(1-g.age/.8,2):0;
      g.capMat.emissiveIntensity=.06+strength*3;g.flareMat.opacity=strength*.75;g.blobMat.opacity=strength*.35;g.light.intensity=strength*2.2;
      g.blob.scale.setScalar(.8+Math.min(g.age,.8)*.7);
    });
  }
  return {update,settings,snapshot:()=>({...settings,effectiveCount,actualSpacing}),
    diagnostics:()=>({length,exitAt,entryAt,effectiveCount,pulses:gates.map(g=>g.pulses)})};
}
