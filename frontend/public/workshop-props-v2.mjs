// Small, reusable WebGL props for the Innovation Workshop.
import { parse as parseFont } from 'three/addons/libs/opentype.module.js';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
export function planWorkshopProps() {
  return {
    palette: { base: 0x132230, trim: 0x526878, cyan: 0x60e9f5, amber: 0xffc666 },
    props: [
      { name: 'Bike_oil', kind: 'oil', zone: 'shelf', position: [-3.98, 2.65, 1.76] },
      { name: 'Spray_cyan', kind: 'spray', zone: 'shelf', position: [-3.98, 2.65, 2.22] },
      { name: 'Spray_amber', kind: 'spray', zone: 'shelf', position: [-3.98, 2.65, 2.60] },
      { name: 'Action_camera_kit', kind: 'camera', zone: 'shelf', position: [-3.98, 2.65, 3.19] },
      { name: 'Tool_roll', kind: 'tools', zone: 'shelf', position: [-3.98, 3.28, 1.78] },
      { name: 'Bike_helmet', kind: 'helmet', zone: 'shelf', position: [-3.98, 3.28, 2.35] },
      { name: 'Trail_pack', kind: 'pack', zone: 'shelf', position: [-3.98, 3.28, 3.12] },
      { name: 'Allen_key_stand', kind: 'allen', zone: 'bench', position: [0.65, 1.465, -3.73] },
      { name: 'Repair_mat', kind: 'mat', zone: 'bench', position: [1.57, 1.465, -3.73] },
      { name: 'Mini_toolbox', kind: 'toolbox', zone: 'bench', position: [2.73, 1.465, -3.73] },
      { name: 'Spray_lube', kind: 'oil', zone: 'bench', position: [3.55, 1.465, -3.70] },
      { name: 'Terminal_monitor', kind: 'terminal', zone: 'wall', position: [0.67, 2.79, -4.19] },
      { name: 'Tpose_monitor', kind: 'tpose', zone: 'wall', position: [1.83, 2.79, -4.19] },
      { name: 'Codex_monitor', kind: 'codex', zone: 'wall', position: [2.96, 2.79, -4.19] },
    ],
  };
}

export function createWorkshopProps({ THREE, scene, model }) {
  const plan = planWorkshopProps();
  const group = new THREE.Group();
  group.name = 'Workshop_Props_Lightweight';
  scene.add(group);
  const mats = {
    base: new THREE.MeshStandardMaterial({ color: plan.palette.base, metalness: .57, roughness: .42 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x0a1520, metalness: .48, roughness: .48 }),
    trim: new THREE.MeshStandardMaterial({ color: plan.palette.trim, metalness: .72, roughness: .28 }),
    cyan: new THREE.MeshBasicMaterial({ color: plan.palette.cyan, toneMapped: false }),
    amber: new THREE.MeshBasicMaterial({ color: plan.palette.amber, toneMapped: false }),
    rubber: new THREE.MeshStandardMaterial({ color: 0x151b23, metalness: .1, roughness: .8 }),
    turquoisePaint: new THREE.MeshStandardMaterial({color:0x0bb8c7,metalness:.35,roughness:.36}),
    yellowPaint: new THREE.MeshStandardMaterial({color:0xe0af45,metalness:.42,roughness:.4}),
  };
  const boxes = new Map();
  const cylinders = new Map();
  const animatedDisplays=[];
  const rotatingModels=[];
  function box(parent, name, size, pos, mat = mats.base) {
    const key = size.join('/');
    if (!boxes.has(key)) {
      const [w,h,d]=size,b=Math.min(w,h,d)*.18,c=Math.min(w,h)*.10;
      const x=w/2-b,y=h/2-b,s=new THREE.Shape();
      s.moveTo(-x+c,-y);s.lineTo(x-c,-y);s.lineTo(x,-y+c);s.lineTo(x,y-c);
      s.lineTo(x-c,y);s.lineTo(-x+c,y);s.lineTo(-x,y-c);s.lineTo(-x,-y+c);s.closePath();
      const geometry=new THREE.ExtrudeGeometry(s,{depth:d-2*b,bevelEnabled:true,bevelThickness:b,bevelSize:b,bevelSegments:1,steps:1,curveSegments:1});
      geometry.translate(0,0,-d/2+b);boxes.set(key,geometry);
    }
    const mesh = new THREE.Mesh(boxes.get(key), mat);
    mesh.name = name; mesh.position.set(...pos); parent.add(mesh);
    return mesh;
  }
  function cylinder(parent, name, top, bottom, height, pos, mat = mats.base, segments = 10) {
    const key = [top,bottom,height,segments].join('/');
    if (!cylinders.has(key)) cylinders.set(key, new THREE.CylinderGeometry(top,bottom,height,segments));
    const mesh = new THREE.Mesh(cylinders.get(key), mat);
    mesh.name = name; mesh.position.set(...pos); parent.add(mesh);
    return mesh;
  }
  function segment(parent, from, to, radius, mat, name = 'Detail') {
    const a = new THREE.Vector3(...from), b = new THREE.Vector3(...to);
    const mesh = cylinder(parent,name,radius,radius,a.distanceTo(b),a.clone().add(b).multiplyScalar(.5).toArray(),mat,7);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),b.sub(a).normalize());
    return mesh;
  }
  function labelTexture(lines, color = '#83e9f5') {
    const canvas = document.createElement('canvas'); canvas.width=256; canvas.height=160;
    const ctx=canvas.getContext('2d');ctx.fillStyle='#07131d';ctx.fillRect(0,0,256,160);
    ctx.strokeStyle='#2c6271';ctx.lineWidth=3;ctx.strokeRect(4,4,248,152);
    ctx.fillStyle=color;ctx.font='bold 21px monospace';
    lines.forEach((line,i)=>ctx.fillText(line,13,36+i*29));
    const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
    return texture;
  }
  function screenTexture(kind) {
    const c=document.createElement('canvas');c.width=512;c.height=360;
    const ctx=c.getContext('2d');
    function draw(t=0){
      ctx.fillStyle='#061521';ctx.fillRect(0,0,512,360);
      ctx.strokeStyle='#173441';ctx.lineWidth=1;
      for(let x=20;x<512;x+=26){ctx.beginPath();ctx.moveTo(x,47);ctx.lineTo(x,310);ctx.stroke();}
      for(let y=48;y<320;y+=26){ctx.beginPath();ctx.moveTo(15,y);ctx.lineTo(497,y);ctx.stroke();}
      ctx.fillStyle='#15323d';ctx.fillRect(0,0,512,42);ctx.fillStyle='#8ceaf0';ctx.font='bold 19px monospace';
      ctx.fillText(kind==='terminal'?'CLAUDE CODE':kind==='tpose'?'CHARACTER LAB':'CODEX',kind==='terminal'?69:18,28);
      ctx.fillStyle='#dcad65';ctx.fillRect(468,17,22,7);
      if(kind==='terminal'){
        const pixels=['0011100','0111110','1101011','1111111','1010101','0010100'];
        ctx.fillStyle='#ee9070';pixels.forEach((row,y)=>[...row].forEach((v,x)=>{if(v==='1')ctx.fillRect(14+x*7,5+y*6,7,6);}));
        const lines=['> claude init','✓ Loaded project context','> claude plan','  Mapping workshop scene','✓ 206 meshes indexed','> claude code','  Building visual assets','✓ Materials compiled','> claude review','  Ready for preview'];
        ctx.fillStyle='rgba(5,17,25,.9)';ctx.fillRect(10,48,492,278);
        ctx.font='17px monospace';
        const offset=Math.floor(t*.7)%lines.length;
        for(let i=0;i<8;i++){
          const line=lines[(offset+i)%lines.length];
          ctx.fillStyle=line.startsWith('>')?'#5ee6ef':line.startsWith('✓')?'#efbd87':'#c5dce6';
          ctx.fillText(line,20,79+i*30);
        }
        ctx.fillStyle='#46cad2';ctx.fillRect(20,315,460*((t%9)/9),5);
        if(Math.floor(t*2)%2===0)ctx.fillRect(20,300,9,13);
      }else if(kind==='tpose'){
        ctx.strokeStyle='#366676';ctx.beginPath();ctx.ellipse(256,299,112,18,0,0,Math.PI*2);ctx.stroke();
        ctx.font='12px monospace';ctx.fillStyle='#7b9da9';ctx.fillText('PERSPECTIVE',18,67);ctx.fillText('RIG / 024',379,67);
        ctx.fillStyle='#65d7e2';ctx.fillText('MESH',19,295);ctx.fillStyle='#e2b477';ctx.fillText('T-POSE',414,295);
      }else{
        const lines=['> codex start','  Initializing environment','✓ Connected to workspace','> codex inspect','  Scanning scene modules','✓ Toolchain loaded','> codex run build','  Optimizing assets','✓ Build complete','> codex verify'];
        ctx.fillStyle='rgba(5,17,25,.9)';ctx.fillRect(10,48,492,278);
        ctx.font='17px monospace';
        const offset=Math.floor(t*.7)%lines.length;
        for(let i=0;i<8;i++){
          const line=lines[(offset+i)%lines.length];
          ctx.fillStyle=line.startsWith('>')?'#5ee6ef':line.startsWith('✓')?'#efbd87':'#c5dce6';
          ctx.fillText(line,20,79+i*30);
        }
        ctx.fillStyle='#46cad2';ctx.fillRect(20,315,460*((t%11)/11),5);
        if(Math.floor(t*2)%2===0)ctx.fillRect(20,300,9,13);
      }
      ctx.fillStyle='#14313b';ctx.fillRect(0,338,512,22);ctx.fillStyle='#4adce3';ctx.font='11px monospace';ctx.fillText('YUVAL LAB  /  PREVIEW',16,353);
      for(let i=0;i<24;i++){ctx.fillStyle=i<17?'#328e9e':'#35505b';ctx.fillRect(320+i*7,345,4,8);}
    }
    draw();
    const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;
    if(kind!=='tpose')animatedDisplays.push({texture,draw});
    return texture;
  }
  const miniScreens={
    terminal:new THREE.MeshBasicMaterial({map:screenTexture('terminal'),toneMapped:false}),
    tpose:new THREE.MeshBasicMaterial({map:screenTexture('tpose'),toneMapped:false}),
    codex:new THREE.MeshBasicMaterial({map:screenTexture('codex'),toneMapped:false}),
  };
  function makeBottle(parent, spray=false, amber=false) {
    const accent=amber?mats.amber:mats.cyan;
    cylinder(parent,'Bottle body',.075,.081,.215,[0,.13,0],mats.base);
    cylinder(parent,'Bottle shoulder',.055,.075,.047,[0,.26,0],mats.trim);
    cylinder(parent,'Bottle cap',.046,.046,.064,[0,.31,0],mats.dark);
    const label=new THREE.MeshBasicMaterial({map:labelTexture([spray?'TRAIL / 07':'CHAIN / 02',spray?'CLEANER':'DRY LUBE'],amber?'#e9bb79':'#80dbe5'),toneMapped:false});
    box(parent,'Bottle label',[.137,.125,.008],[0,.145,.079],label);
    cylinder(parent,'Can rim',.077,.077,.013,[0,.029,0],mats.trim,16);
    cylinder(parent,'Can neck ring',.062,.062,.014,[0,.284,0],accent,16);
    if(spray){box(parent,'Spray head',[.16,.041,.068],[.04,.36,0],mats.trim);
      box(parent,'Nozzle',[.065,.033,.046],[.135,.36,0],accent);}
  }
  function makeCamera(parent) {
    box(parent,'Camera kit case',[.32,.105,.23],[0,.055,0],mats.dark);
    box(parent,'Action cam',[.195,.14,.085],[0,.18,.015],mats.trim);
    cylinder(parent,'Camera lens',.049,.049,.03,[.048,.19,.067],mats.dark,16).rotation.x=Math.PI/2;
    cylinder(parent,'Lens glass',.027,.027,.031,[.048,.19,.091],mats.cyan,16).rotation.x=Math.PI/2;
    box(parent,'Recording lamp',[.025,.025,.008],[-.07,.22,.063],mats.amber);
    box(parent,'Camera display',[.071,.065,.008],[-.048,.177,.062],mats.dark);
    cylinder(parent,'Lens rim',.057,.057,.008,[.048,.19,.083],mats.trim,16).rotation.x=Math.PI/2;
    box(parent,'Mount foot',[.105,.021,.13],[0,.117,-.025],mats.rubber);
    for(const x of [-.125,.125])box(parent,'Case latch',[.025,.04,.02],[x,.062,.124],mats.trim);
  }
  function makeHelmet(parent) {
    const shell=new THREE.Mesh(new THREE.SphereGeometry(.235,16,8,0,Math.PI*2,0,Math.PI/2),mats.turquoisePaint);
    shell.name='Helmet shell';shell.position.y=.085;shell.scale.set(1,.80,1.19);parent.add(shell);
    box(parent,'Helmet lower',[.39,.065,.34],[0,.07,0],mats.dark);
    const visor=box(parent,'MTB peak visor',[.40,.027,.18],[0,.17,.225],mats.yellowPaint);visor.rotation.x=-.10;
    for(const x of [-.12,-.06,.06,.12]){const v=box(parent,'Recessed helmet vent',[.027,.024,.155],[x,.252,0],mats.dark);v.rotation.z=-x*1.5;}
    for(const x of [-.175,.175])segment(parent,[x,.105,.03],[x*.60,.011,.15],.007,mats.rubber,'Chin strap');
    segment(parent,[-.15,.167,.212],[.15,.167,.212],.008,mats.cyan,'Helmet stripe');
  }
  function makePack(parent) {
    box(parent,'Pack body',[.29,.38,.22],[0,.20,0],mats.base);
    box(parent,'Pack flap',[.30,.13,.235],[0,.35,.012],mats.yellowPaint);
    for(const x of [-.12,.12])box(parent,'Pack strap',[.025,.29,.014],[x,.18,.12],mats.rubber);
    box(parent,'Pack buckle',[.09,.035,.015],[0,.27,.13],mats.amber);
  }
  function makeTools(parent) {
    box(parent,'Tool roll',[.33,.065,.23],[0,.045,0],mats.rubber);
    for(let i=-1;i<=1;i++){
      segment(parent,[i*.09,.09,-.07],[i*.09,.09,.08],.012,mats.trim,'Bike wrench');
      cylinder(parent,'Socket',.022,.022,.024,[i*.09,.10,.08],mats.cyan,8).rotation.x=Math.PI/2;
    }
    box(parent,'Tool roll band',[.035,.068,.25],[0,.046,0],mats.amber);
  }
  function makeAllen(parent) {
    box(parent,'Key stand',[.44,.09,.22],[0,.045,0],mats.base);
    box(parent,'Key rack trim',[.38,.014,.23],[0,.08,0],mats.trim);
    for(let i=0;i<5;i++){
      const x=(i-2)*.067;
      segment(parent,[x,.085,0],[x,.22+i*.028,0],.011,mats.trim,'Hex key');
      segment(parent,[x,.22+i*.028,0],[x+.046,.22+i*.028,0],.011,mats.trim,'Hex key tip');
    }
  }
  function makeMat(parent) {
    box(parent,'Repair pad',[.58,.025,.32],[0,.013,0],mats.rubber);
    segment(parent,[-.19,.044,-.08],[.17,.044,.07],.016,mats.trim,'Ratchet');
    cylinder(parent,'Tool socket',.027,.027,.04,[.19,.045,.075],mats.cyan,10).rotation.z=Math.PI/2;
    box(parent,'Pad mark',[.12,.008,.012],[-.15,.032,.12],mats.amber);
  }
  function makeToolbox(parent) {
    box(parent,'Box body',[.37,.20,.25],[0,.115,0],mats.base);
    box(parent,'Box lid',[.39,.035,.265],[0,.23,0],mats.turquoisePaint);
    box(parent,'Box clasp',[.045,.06,.015],[0,.17,.136],mats.cyan);
    segment(parent,[-.09,.26,0],[-.09,.31,0],.011,mats.dark,'Handle post');
    segment(parent,[.09,.26,0],[.09,.31,0],.011,mats.dark,'Handle post');
    segment(parent,[-.09,.31,0],[.09,.31,0],.014,mats.dark,'Toolbox handle');
  }
  function makeScreen(parent,kind) {
    const size=[.91,.66];
    box(parent,'Monitor mounting bracket',[size[0]*.65,size[1]*.65,.07],[0,0,-.027],mats.dark);
    box(parent,'Armoured monitor chassis',[size[0]+.16,size[1]+.16,.13],[0,0,.025],mats.trim);
    box(parent,'Stepped dark bezel',[size[0]+.07,size[1]+.065,.042],[0,0,.10],mats.dark);
    box(parent,'Monitor lower trim',[size[0]*.55,.018,.018],[0,-size[1]/2-.058,.096],mats.cyan);
    const mesh=new THREE.Mesh(new THREE.PlaneGeometry(...size),miniScreens[kind]);
    mesh.name='Live display';mesh.position.z=.123;parent.add(mesh);
    for(const x of [-1,1])for(const y of [-1,1]){
      const screw=cylinder(parent,'Bezel screw',.013,.013,.008,[x*(size[0]/2+.049),y*(size[1]/2+.042),.095],mats.dark,6);screw.rotation.x=Math.PI/2;
    }
    box(parent,'Status amber',[.039,.018,.009],[size[0]/2-.014,-size[1]/2-.055,.103],mats.amber);
    if(kind==='tpose'){
      const rig=new THREE.Group();rig.name='Faceted character turntable';rig.position.set(0,-.024,.21);parent.add(rig);
      const armor=new THREE.MeshStandardMaterial({color:0x62a9b9,metalness:.30,roughness:.34,emissive:0x123440,emissiveIntensity:.9});
      const torso=box(rig,'Character chest',[.134,.158,.069],[0,.041,0],armor);
      box(rig,'Character pelvis',[.097,.062,.064],[0,-.066,0],mats.trim);
      const head=new THREE.Mesh(new THREE.IcosahedronGeometry(.054,1),armor);head.position.y=.166;head.scale.set(.8,1.13,.84);rig.add(head);
      box(rig,'Character visor',[.060,.015,.010],[0,.177,.045],mats.cyan);
      for(const side of [-1,1]){
        segment(rig,[side*.09,.091,0],[side*.196,.091,0],.026,armor,'Upper arm');
        segment(rig,[side*.21,.091,0],[side*.292,.091,0],.020,armor,'Forearm');
        segment(rig,[side*.035,-.100,0],[side*.05,-.175,0],.025,armor,'Thigh');
        segment(rig,[side*.051,-.19,0],[side*.061,-.255,.009],.018,armor,'Shin');
        box(rig,'Character boot',[.047,.028,.072],[side*.061,-.267,.015],mats.trim);
      }
      const wire=new THREE.LineSegments(new THREE.EdgesGeometry(torso.geometry),new THREE.LineBasicMaterial({color:0xacf7ff,transparent:true,opacity:.55}));torso.add(wire);
      rotatingModels.push(rig);
    }
  }
  // A compact mechanic's rack occupies the space beneath the badge.
  const rack=new THREE.Group();rack.name='Mechanic tool board';rack.position.set(-1.10,1.99,-4.19);group.add(rack);
  box(rack,'Toolboard chassis',[1.54,.57,.06],[0,0,0],mats.base);
  box(rack,'Toolboard header',[1.34,.018,.012],[0,.232,.04],mats.trim);
  for(let i=0;i<4;i++){
    const x=-.56+i*.33,h=.25+i*.024;
    segment(rack,[x,-h/2,.055],[x,h/2,.055],.017,mats.trim,'Spanner shaft');
    const ring=new THREE.Mesh(new THREE.TorusGeometry(.047,.013,5,10),mats.trim);ring.position.set(x,h/2,.055);rack.add(ring);
    segment(rack,[x,-h/2,.055],[x-.037,-h/2-.023,.055],.012,mats.trim,'Wrench jaw');
    segment(rack,[x,-h/2,.055],[x+.037,-h/2-.023,.055],.012,mats.trim,'Wrench jaw');
  }
  for(const spec of plan.props) {
    const prop=new THREE.Group();prop.name=spec.name;prop.position.set(...spec.position);group.add(prop);
    switch(spec.kind){
      case 'oil':makeBottle(prop,false,spec.name==='Spray_lube');break;
      case 'spray':makeBottle(prop,true,spec.name==='Spray_amber');break;
      case 'camera':makeCamera(prop);break;
      case 'helmet':makeHelmet(prop);break;
      case 'pack':makePack(prop);break;
      case 'tools':makeTools(prop);break;
      case 'allen':makeAllen(prop);break;
      case 'mat':makeMat(prop);break;
      case 'toolbox':makeToolbox(prop);break;
      case 'terminal':case 'tpose':case 'codex':makeScreen(prop,spec.kind);break;
    }
  }
  // A slim digital node chain on the free section of the back wall.
  const chain=new THREE.Group();chain.name='Digital_node_chain';group.add(chain);
  const z=-4.035;
  const routes=[[[.67,2.36,z],[.67,2.22,z],[1.83,2.22,z],[1.83,2.36,z]],
                [[1.83,2.22,z],[2.96,2.22,z],[2.96,2.36,z]]];
  routes.forEach(route=>route.slice(1).forEach((point,i)=>segment(chain,route[i],point,.007,mats.cyan,'Node cable')));
  for(const [x,y] of [[.67,2.22],[1.83,2.22],[2.96,2.22]]){
    box(chain,'Node housing',[.095,.067,.026],[x,y,z],mats.trim);
    box(chain,'Node socket',[.036,.016,.015],[x,y,z+.018],mats.amber);
  }
  const updateBadge=makeNeonBadge(THREE,group,model,mats,segment);
  // Repeated static hardware shares draw calls; animated display rigs remain independent.
  group.updateMatrixWorld(true);
  const batches=new Map(), inverse=new THREE.Matrix4().copy(group.matrixWorld).invert();
  group.traverse(object=>{
    if(!object.isMesh||object.children.length||Array.isArray(object.material))return;
    for(let p=object.parent;p&&p!==group;p=p.parent)if(rotatingModels.includes(p))return;
    const key=object.geometry.uuid+object.material.uuid;
    if(!batches.has(key))batches.set(key,[]);
    batches.get(key).push(object);
  });
  for(const objects of batches.values()){
    if(objects.length<3)continue;
    const batch=new THREE.InstancedMesh(objects[0].geometry,objects[0].material,objects.length);
    batch.name='Shared hardware '+objects[0].name;
    objects.forEach((object,i)=>{batch.setMatrixAt(i,new THREE.Matrix4().multiplyMatrices(inverse,object.matrixWorld));object.removeFromParent();});
    batch.instanceMatrix.needsUpdate=true;group.add(batch);
  }
  let elapsed=0,lastTick=-1;
  group.userData.update=dt=>{
    elapsed+=Math.min(dt,.1);
    rotatingModels.forEach(rig=>rig.rotation.y=Math.sin(elapsed*.37)*.46);
    updateBadge(Math.min(dt,.1));
    const tick=Math.floor(elapsed*4);
    if(tick!==lastTick){lastTick=tick;animatedDisplays.forEach(display=>{display.draw(elapsed);display.texture.needsUpdate=true;});}
  };
  return group;
}

// "YUVAL'S WORKSHOP" wall badge: armoured octagonal frame, chunky outlined lettering,
// solid trail peaks and a small circuit trace. Replaces the GLB sign meshes.
function makeNeonBadge(THREE,group,model,mats,segment){
  model.traverse(object=>{if(/^(sign[ _]?(upper|lower)|workshop[ _]?sign)$/i.test(object.name))object.visible=false;});
  const badge=new THREE.Group();badge.name='Trail_neon_badge';group.add(badge);
  window.__workshopBadgeDebug={badge,model};
  const CX=-1.10, WALL=-4.335;
  // Fine grain so the metal does not read as flat plastic.
  const grainCanvas=document.createElement('canvas');grainCanvas.width=grainCanvas.height=128;
  const grainCtx=grainCanvas.getContext('2d');
  for(let i=0;i<128*128;i++){const v=150+Math.random()*105|0;grainCtx.fillStyle=`rgb(${v},${v},${v})`;grainCtx.fillRect(i%128,i/128|0,1,1);}
  const grain=new THREE.CanvasTexture(grainCanvas);grain.wrapS=grain.wrapT=THREE.RepeatWrapping;grain.repeat.set(3,3);
  const gunmetal=new THREE.MeshStandardMaterial({color:0x4a555f,metalness:.74,roughness:.44,roughnessMap:grain,map:grain});
  const steelLip=new THREE.MeshStandardMaterial({color:0x76838e,metalness:.8,roughness:.3});
  const panel=new THREE.MeshStandardMaterial({color:0x0b1117,metalness:.4,roughness:.72,map:grain});
  const recess=new THREE.MeshStandardMaterial({color:0x05080b,metalness:.2,roughness:.9});
  const ink=new THREE.MeshStandardMaterial({color:0x04090e,metalness:.2,roughness:.6});
  // Letter faces are lit LED panels: emissive above the bloom threshold, dark sides stay unlit.
  const cyanFace=new THREE.MeshStandardMaterial({color:0x12b4dc,metalness:.05,roughness:.45,envMapIntensity:.3,emissive:0x00b8f0,emissiveIntensity:1.0});
  const cyanSide=new THREE.MeshStandardMaterial({color:0x125f86,metalness:.3,roughness:.4,emissive:0x05304a,emissiveIntensity:.5});
  const goldFace=new THREE.MeshStandardMaterial({color:0xffb21f,metalness:.2,roughness:.34,emissive:0xff8c00,emissiveIntensity:.95});
  const peakGold=new THREE.MeshStandardMaterial({color:0xffb21f,metalness:.2,roughness:.34,emissive:0x9a5a04,emissiveIntensity:.65});
  const ledOn=new THREE.Color(0x7ff4ff),ledOff=new THREE.Color(0x0b1b22);
  const goldSide=new THREE.MeshStandardMaterial({color:0xa4520a,metalness:.35,roughness:.42,emissive:0x3a1602,emissiveIntensity:.5});
  const goldShade=new THREE.MeshStandardMaterial({color:0xc86e10,metalness:.25,roughness:.42,emissive:0x4a2402,emissiveIntensity:.5});
  const snow=new THREE.MeshStandardMaterial({color:0xffe3a0,metalness:.15,roughness:.4,emissive:0x7a5a1c,emissiveIntensity:.45});
  const polyShape=pts=>{const s=new THREE.Shape();s.moveTo(...pts[0]);pts.slice(1).forEach(p=>s.lineTo(...p));s.closePath();return s;};
  const octagon=(x0,y0,x1,y1,c)=>[[x0+c,y0],[x1-c,y0],[x1,y0+c],[x1,y1-c],[x1-c,y1],[x0+c,y1],[x0,y1-c],[x0,y0+c]];
  // Extrude a flat shape so its front face lands at z=front.
  function slab(shapes,depth,front,mat,name,bevel=0){
    const g=new THREE.ExtrudeGeometry(shapes,{depth,steps:1,curveSegments:4,bevelEnabled:bevel>0,bevelSize:bevel,bevelThickness:bevel,bevelSegments:1});
    const m=new THREE.Mesh(g,mat);m.name=name;m.position.z=front-depth-bevel;badge.add(m);return m;
  }
  // ---- frame ----
  const x0=-2.26,x1=.06,y0=2.42,y1=3.46;
  const outer=[[x0+.14,y0],[-1.42,y0],[-1.37,2.355],[-.83,2.355],[-.78,y0],[x1-.14,y0],[x1,y0+.14],[x1,y1-.14],[x1-.14,y1],
               [-.60,y1],[-.68,3.555],[-1.52,3.555],[-1.60,y1],[x0+.14,y1],[x0,y1-.14],[x0,y0+.14]];
  const innerPts=octagon(x0+.11,y0+.11,x1-.11,y1-.11,.10);
  slab(polyShape(outer),.035,WALL+.04,panel,'Badge backing plate');
  const ring=polyShape(outer);ring.holes.push(polyShape([...innerPts].reverse()));
  slab(ring,.06,WALL+.115,gunmetal,'Badge armoured frame',.012);
  const lip=polyShape(octagon(x0+.09,y0+.09,x1-.09,y1-.09,.11));lip.holes.push(polyShape([...octagon(x0+.125,y0+.125,x1-.125,y1-.125,.095)].reverse()));
  slab(lip,.02,WALL+.085,steelLip,'Badge inner steel lip',.004);
  // Recessed face: fine digital grid over faint trail contour lines (MTB map meets HUD).
  const faceCanvas=document.createElement('canvas');faceCanvas.width=1024;faceCanvas.height=400;
  const fc=faceCanvas.getContext('2d');
  fc.fillStyle='#070d13';fc.fillRect(0,0,1024,400);
  fc.lineWidth=1.5;
  for(let ring=0;ring<9;ring++){
    fc.strokeStyle=ring%3?'rgba(255,170,60,.07)':'rgba(255,170,60,.13)';
    fc.beginPath();
    for(let a=0;a<=Math.PI*2+.01;a+=.05){
      const r=40+ring*34+Math.sin(a*3+ring*.7)*12+Math.sin(a*5-ring)*6;
      const x=300+Math.cos(a)*r*1.6,y=230+Math.sin(a)*r*.85;
      a?fc.lineTo(x,y):fc.moveTo(x,y);
    }
    fc.stroke();
  }
  for(let x=0;x<=1024;x+=16){fc.strokeStyle=x%64?'rgba(80,220,245,.07)':'rgba(80,220,245,.16)';fc.lineWidth=x%64?1:1.4;fc.beginPath();fc.moveTo(x,0);fc.lineTo(x,400);fc.stroke();}
  for(let y=0;y<=400;y+=16){fc.strokeStyle=y%64?'rgba(80,220,245,.07)':'rgba(80,220,245,.16)';fc.lineWidth=y%64?1:1.4;fc.beginPath();fc.moveTo(0,y);fc.lineTo(1024,y);fc.stroke();}
  fc.fillStyle='rgba(120,235,255,.35)';
  for(let x=0;x<=1024;x+=64)for(let y=0;y<=400;y+=64)fc.fillRect(x-2,y-2,4,4);
  const faceTex=new THREE.CanvasTexture(faceCanvas);faceTex.colorSpace=THREE.SRGBColorSpace;faceTex.anisotropy=8;
  // ExtrudeGeometry UVs are shape x/y, so map the inner panel bounds onto 0..1.
  const [px0,py0,px1,py1]=[x0+.11,y0+.11,x1-.11,y1-.11];
  faceTex.repeat.set(1/(px1-px0),1/(py1-py0));faceTex.offset.set(-px0/(px1-px0),-py0/(py1-py0));
  const panelFace=new THREE.MeshStandardMaterial({color:0xffffff,map:faceTex,emissive:0xffffff,emissiveMap:faceTex,emissiveIntensity:.35,metalness:.3,roughness:.65});
  slab(polyShape(innerPts),.01,WALL+.05,panelFace,'Badge recessed face');
  // Frame hardware: screws, side slots, bottom vent.
  const screwGeo=new THREE.CylinderGeometry(.026,.026,.016,6);
  for(const [x,y] of [[x0+.055,2.94],[x1-.055,2.94],[-1.86,y0+.055],[-.34,y0+.055],[-1.86,y1-.055],[-.34,y1-.055],[x0+.09,y0+.09],[x1-.09,y0+.09]]){
    const s=new THREE.Mesh(screwGeo,steelLip);s.name='Badge screw';s.rotation.x=Math.PI/2;s.rotation.y=.4;s.position.set(x,y,WALL+.13);badge.add(s);
    const slot=new THREE.Mesh(new THREE.BoxGeometry(.034,.007,.004),recess);slot.position.set(x,y,WALL+.14);slot.rotation.z=.6;badge.add(slot);
  }
  for(const x of [x0+.055,x1-.055])for(const y of [3.17,2.71]){
    const s=new THREE.Mesh(new THREE.BoxGeometry(.03,.15,.01),recess);s.name='Badge side slot';s.position.set(x,y,WALL+.124);badge.add(s);
    const led=new THREE.Mesh(new THREE.BoxGeometry(.016,.13,.01),mats.cyan);led.name='Badge side LED';led.position.set(x,y,WALL+.13);badge.add(led);
  }
  // Bottom vent doubles as a progress bar: slats light up left to right, then reset.
  const vent=new THREE.Mesh(new THREE.BoxGeometry(.52,.056,.01),recess);vent.name='Badge vent';vent.position.set(CX,2.405,WALL+.124);badge.add(vent);
  const slats=[];
  for(let i=0;i<11;i++){
    const mat=new THREE.MeshBasicMaterial({color:ledOff.clone(),toneMapped:false});
    const b=new THREE.Mesh(new THREE.BoxGeometry(.018,.042,.012),mat);b.name='Progress LED '+i;b.position.set(CX-.225+i*.045,2.405,WALL+.13);b.rotation.z=.35;badge.add(b);slats.push(mat);
  }
  // ---- trail peaks ----
  const PEAK_Z=WALL+.165,BASE=3.335;
  // [left, right, apex x, apex y]; each peak gets a stepped ridge so it reads as rock, not a pyramid.
  const peaks=[[-1.72,-1.46,-1.575,3.5],[-1.52,-1.2,-1.335,3.56],[-1.27,-.86,-1.02,3.625]];
  for(const [l,r,ax,ay] of peaks){
    const h=ay-BASE;
    const tri=polyShape([[l,BASE],[r,BASE],[ax+(r-ax)*.45,BASE+h*.52],[ax+(r-ax)*.32,BASE+h*.6],[ax,ay],[ax-(ax-l)*.5,BASE+h*.46],[ax-(ax-l)*.62,BASE+h*.42]]);
    slab(tri,.012,PEAK_Z-.014,ink,'Peak outline',.018).position.y-=.006;
    slab(tri,.03,PEAK_Z,peakGold,'Trail peak');
    slab(polyShape([[ax,ay],[ax+(r-ax)*.1,BASE],[r,BASE],[ax+(r-ax)*.45,BASE+h*.52],[ax+(r-ax)*.32,BASE+h*.6]]),.004,PEAK_Z+.003,goldShade,'Peak shade');
    const capY=ay-h*.34,k=.34;
    slab(polyShape([[ax,ay],[ax-(ax-l)*k,capY],[ax-(ax-l)*k*.55,capY+.018],[ax-(ax-l)*k*.25,capY-.01],[ax,capY+.02]]),.004,PEAK_Z+.006,snow,'Peak snow');
  }
  // ---- circuit trace ----
  const TRACE_Z=WALL+.14;
  const trace=(pts,mat)=>pts.slice(1).forEach((p,i)=>segment(badge,[...pts[i],TRACE_Z],[...p,TRACE_Z],.012,mat,'Circuit trace'));
  const node=(x,y,mat,r=.03)=>{
    const ringMesh=new THREE.Mesh(new THREE.CylinderGeometry(r+.012,r+.012,.014,20),ink);ringMesh.rotation.x=Math.PI/2;ringMesh.position.set(x,y,TRACE_Z);badge.add(ringMesh);
    const dot=new THREE.Mesh(new THREE.CylinderGeometry(r,r,.02,20),mat);dot.name='Circuit node';dot.rotation.x=Math.PI/2;dot.position.set(x,y,TRACE_Z+.006);badge.add(dot);
  };
  trace([[-.93,3.49],[-.62,3.49],[-.56,3.515],[-.36,3.515]],goldFace);node(-.33,3.515,mats.amber,.034);
  trace([[-.86,3.375],[-.64,3.375]],mats.cyan);node(-.62,3.375,mats.cyan,.02);
  trace([[-.50,3.43],[-.18,3.43]],mats.cyan);node(-.52,3.43,mats.cyan,.018);node(-.16,3.43,mats.cyan,.026);
  trace([[-1.90,3.375],[-1.76,3.375]],mats.cyan);node(-1.92,3.375,mats.cyan,.018);
  // ---- lettering (Saira Stencil One, extruded, with a dark offset outline like the reference) ----
  const TEXT_FRONT=WALL+.19;
  function build(font){
    const loader=new SVGLoader();
    const shapesFor=label=>{
      const d=font.getPath(label,0,0,100,{kerning:true}).toPathData(2);
      const shapes=loader.parse('<svg xmlns="http://www.w3.org/2000/svg"><path d="'+d+'"/></svg>').paths.flatMap(p=>SVGLoader.createShapes(p));
      if(!shapes.length)throw new Error('Workshop lettering has no outlines');
      return shapes;
    };
    const word=(label,width,centerY,face,side)=>{
      const shapes=shapesFor(label);
      const faceGeo=new THREE.ExtrudeGeometry(shapes,{depth:.045,steps:1,curveSegments:4,bevelEnabled:true,bevelSize:1.2,bevelThickness:.006,bevelSegments:1});
      const inkGeo=new THREE.ExtrudeGeometry(shapes,{depth:.03,steps:1,curveSegments:4,bevelEnabled:true,bevelSize:6.5,bevelThickness:.004,bevelSegments:1});
      faceGeo.computeBoundingBox();
      const fb=faceGeo.boundingBox,s=width/(fb.max.x-fb.min.x);
      const cx=(fb.min.x+fb.max.x)/2,cy=(fb.min.y+fb.max.y)/2;
      const place=(geo,front,dy=0)=>{
        // SVG space is Y-down: flip Y and Z together so faces keep their winding.
        geo.translate(-cx,-cy,0);geo.scale(s,-s,-1);geo.computeBoundingBox();
        geo.translate(CX,centerY+dy,front-geo.boundingBox.max.z);return geo;
      };
      const outline=new THREE.Mesh(place(inkGeo,TEXT_FRONT-.03,-.012),ink);outline.name='Outline '+label;badge.add(outline);
      const mesh=new THREE.Mesh(place(faceGeo,TEXT_FRONT),[face,side]);mesh.name='Extruded '+label;badge.add(mesh);
    };
    word("YUVAL'S",1.72,3.085,cyanFace,cyanSide);
    word('WORKSHOP',1.9,2.735,goldFace,goldSide);
  }
  const loadFont=url=>fetch(url).then(r=>{if(!r.ok)throw new Error('font '+url);return r.arrayBuffer();}).then(parseFont);
  loadFont('./fonts/SairaStencilOne-Regular.ttf')
    .catch(error=>{console.warn('Badge font fallback:',error);return loadFont('./fonts/Unbounded-Bold.ttf');})
    .then(build).catch(error=>console.warn('Workshop badge lettering failed:',error));
  // Soft cyan wash on the wall so the badge sits in light.
  const glowCanvas=document.createElement('canvas');glowCanvas.width=glowCanvas.height=256;
  const glowCtx=glowCanvas.getContext('2d');
  const glow=glowCtx.createRadialGradient(128,128,8,128,128,125);
  glow.addColorStop(0,'rgba(33,218,239,.22)');glow.addColorStop(.7,'rgba(20,155,197,.06)');glow.addColorStop(1,'rgba(20,155,197,0)');
  glowCtx.fillStyle=glow;glowCtx.fillRect(0,0,256,256);
  const aura=new THREE.Mesh(new THREE.PlaneGeometry(3.2,1.8),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(glowCanvas),transparent:true,opacity:.5,depthWrite:false,blending:THREE.AdditiveBlending}));
  aura.name='Neon aura';aura.position.set(CX,2.98,WALL+.004);badge.add(aura);
  // LED spill onto the frame and bench below (no shadows, short range).
  const spill=new THREE.PointLight(0x4fe6ff,1.6,2.6,2);spill.name='Badge LED spill';spill.position.set(CX,2.95,WALL+.7);badge.add(spill);
  let t=0;
  return dt=>{
    t+=dt;
    // Fill one slat per tick, hold full for 3 ticks, one dark tick, repeat.
    const n=slats.length,head=Math.floor(t*3)%(n+4);
    slats.forEach((mat,i)=>{
      const lit=head<n?i<=head:head<n+3;
      mat.color.copy(ledOff);if(lit)mat.color.lerp(ledOn,i===head?1:.75);
    });
  };
}
