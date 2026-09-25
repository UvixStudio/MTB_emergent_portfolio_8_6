// Small, reusable WebGL props for the Innovation Workshop. No external meshes or images.
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
      { name: 'Node_status', kind: 'status', zone: 'wall', position: [2.96, 2.53, -4.19] },
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
      ctx.fillText(kind==='terminal'?'01 / BUILD CONSOLE':kind==='tpose'?'02 / CHARACTER LAB':'03 / RENDER PIPELINE',18,28);
      ctx.fillStyle='#dcad65';ctx.fillRect(468,17,22,7);
      if(kind==='terminal'){
        const lines=[['import',' { world } from "studio";'],['const',' rig = character.create();'],['await',' assets.compile(scene);'],['const',' motion = rig.bind("idle");'],['render',' ({ light: "cyan", samples: 64 });'],['export',' scene.toGLB({ optimize: true });']];
        ctx.font='14px monospace';
        lines.forEach(([keyword,rest],i)=>{
          const y=79+i*31;ctx.fillStyle='#456779';ctx.fillText(String(i+1).padStart(2,'0'),16,y);
          ctx.fillStyle='#dfa969';ctx.fillText(keyword,49,y);ctx.fillStyle='#9bc3d0';ctx.fillText(rest,49+keyword.length*8.5,y);
        });
        ctx.fillStyle='#43c4ce';ctx.font='14px monospace';ctx.fillText('> '+['Compiling materials...','Baking rig transforms...','Optimizing geometry...','Scene ready for export.'][Math.floor(t*.5)%4],18,294);
        if(Math.floor(t*2)%2===0)ctx.fillRect(19,311,9,15);
      }else if(kind==='tpose'){
        ctx.strokeStyle='#366676';ctx.beginPath();ctx.ellipse(256,299,112,18,0,0,Math.PI*2);ctx.stroke();
        ctx.font='12px monospace';ctx.fillStyle='#7b9da9';ctx.fillText('PERSPECTIVE',18,67);ctx.fillText('RIG / 024',379,67);
        ctx.fillStyle='#65d7e2';ctx.fillText('MESH',19,295);ctx.fillStyle='#e2b477';ctx.fillText('T-POSE',414,295);
      }else{
        const pts=[[78,109],[234,103],[405,173],[232,247],[78,252]];
        ctx.strokeStyle='#3c8290';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(...pts[0]);pts.slice(1).forEach(p=>ctx.lineTo(...p));ctx.stroke();
        pts.forEach(([x,y],i)=>{ctx.fillStyle='#163543';ctx.fillRect(x-35,y-19,70,38);ctx.strokeStyle=i===Math.floor(t)%5?'#f3c070':'#45c3d0';ctx.strokeRect(x-35,y-19,70,38);ctx.fillStyle='#9ed4df';ctx.font='12px monospace';ctx.fillText(['INPUT','MESH','RENDER','ENCODE','WEB'][i],x-24,y+4);});
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
    status:new THREE.MeshBasicMaterial({map:screenTexture('status'),toneMapped:false}),
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
    const shell=new THREE.Mesh(new THREE.SphereGeometry(.235,16,8,0,Math.PI*2,0,Math.PI/2),mats.base);
    shell.name='Helmet shell';shell.position.y=.085;shell.scale.set(1,.80,1.19);parent.add(shell);
    box(parent,'Helmet lower',[.39,.065,.34],[0,.07,0],mats.dark);
    const visor=box(parent,'MTB peak visor',[.40,.027,.18],[0,.17,.225],mats.trim);visor.rotation.x=-.10;
    for(const x of [-.12,-.06,.06,.12]){const v=box(parent,'Recessed helmet vent',[.027,.024,.155],[x,.252,0],mats.dark);v.rotation.z=-x*1.5;}
    for(const x of [-.175,.175])segment(parent,[x,.105,.03],[x*.60,.011,.15],.007,mats.rubber,'Chin strap');
    segment(parent,[-.15,.167,.212],[.15,.167,.212],.008,mats.cyan,'Helmet stripe');
  }
  function makePack(parent) {
    box(parent,'Pack body',[.29,.38,.22],[0,.20,0],mats.base);
    box(parent,'Pack flap',[.30,.13,.235],[0,.35,.012],mats.trim);
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
    box(parent,'Box lid',[.39,.035,.265],[0,.23,0],mats.trim);
    box(parent,'Box clasp',[.045,.06,.015],[0,.17,.136],mats.cyan);
    segment(parent,[-.09,.26,0],[-.09,.31,0],.011,mats.dark,'Handle post');
    segment(parent,[.09,.26,0],[.09,.31,0],.011,mats.dark,'Handle post');
    segment(parent,[-.09,.31,0],[.09,.31,0],.014,mats.dark,'Toolbox handle');
  }
  function makeScreen(parent,kind) {
    const size=kind==='status'?[.65,.45]:[.91,.66];
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
      case 'terminal':case 'tpose':case 'status':makeScreen(prop,spec.kind);break;
    }
  }
  // A slim digital node chain on the free section of the back wall.
  const chain=new THREE.Group();chain.name='Digital_node_chain';group.add(chain);
  const z=-4.035;
  const routes=[[[.67,2.36,z],[.67,2.22,z],[1.83,2.22,z],[1.83,2.36,z]],
                [[1.83,2.22,z],[2.96,2.22,z],[2.96,2.25,z]]];
  routes.forEach(route=>route.slice(1).forEach((point,i)=>segment(chain,route[i],point,.007,mats.cyan,'Node cable')));
  for(const [x,y] of [[.67,2.22],[1.83,2.22],[2.96,2.22]]){
    box(chain,'Node housing',[.095,.067,.026],[x,y,z],mats.trim);
    box(chain,'Node socket',[.036,.016,.015],[x,y,z+.018],mats.amber);
  }
  makeNeonBadge(THREE,group,model,mats,segment);
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
    const tick=Math.floor(elapsed*4);
    if(tick!==lastTick){lastTick=tick;animatedDisplays.forEach(display=>{display.draw(elapsed);display.texture.needsUpdate=true;});}
  };
  return group;
}

function makeNeonBadge(THREE,group,model,mats,segment){
  model.traverse(object=>{if(object.name==='Sign upper'||object.name==='Sign lower')object.visible=false;});
  const badge=new THREE.Group();badge.name='Trail_neon_badge';group.add(badge);
  const glowCanvas=document.createElement('canvas');glowCanvas.width=256;glowCanvas.height=256;
  const glowCtx=glowCanvas.getContext('2d');
  const glow=glowCtx.createRadialGradient(128,128,8,128,128,125);
  glow.addColorStop(0,'rgba(33,218,239,.30)');glow.addColorStop(.65,'rgba(20,155,197,.10)');glow.addColorStop(1,'rgba(20,155,197,0)');
  glowCtx.fillStyle=glow;glowCtx.fillRect(0,0,256,256);
  const aura=new THREE.Mesh(new THREE.PlaneGeometry(2.85,1.45),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(glowCanvas),transparent:true,opacity:.6,depthWrite:false,blending:THREE.AdditiveBlending}));
  aura.name='Neon aura';aura.position.set(-1.1,3,-4.10);badge.add(aura);
  const outline=[[-2.23,2.53],[-2.11,2.45],[-.10,2.45],[.035,2.53],[.035,3.42],[-.10,3.54],[-2.11,3.54],[-2.23,3.42],[-2.23,2.53]];
  const shape=new THREE.Shape();shape.moveTo(outline[0][0],outline[0][1]);
  outline.slice(1).forEach(([x,y])=>shape.lineTo(x,y));
  const back=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:.045,bevelEnabled:true,bevelSize:.008,bevelThickness:.008,bevelSegments:1,steps:1}),mats.dark);
  back.name='Badge graphite face';back.position.z=-4.13;badge.add(back);
  outline.slice(1).forEach((p,i)=>segment(badge,[...outline[i],-4.055],[...p,-4.055],.010,mats.cyan,'Badge neon border'));
  const paths={
    Y:[[[0,6],[2,3],[4,6]],[[2,3],[2,0]]],
    U:[[[0,6],[0,1],[1,0],[3,0],[4,1],[4,6]]],
    V:[[[0,6],[2,0],[4,6]]],
    A:[[[0,0],[0,5],[1,6],[3,6],[4,5],[4,0]],[[0,3],[4,3]]],
    L:[[[0,6],[0,0],[4,0]]],
    S:[[[4,6],[1,6],[0,5],[0,4],[4,2],[4,1],[3,0],[0,0]]],
    W:[[[0,6],[0,0],[2,3],[4,0],[4,6]]],
    O:[[[1,0],[3,0],[4,1],[4,5],[3,6],[1,6],[0,5],[0,1],[1,0]]],
    R:[[[0,0],[0,6],[3,6],[4,5],[4,4],[3,3],[0,3]],[[2,3],[4,0]]],
    K:[[[0,6],[0,0]],[[4,6],[0,3],[4,0]]],
    H:[[[0,6],[0,0]],[[4,6],[4,0]],[[0,3],[4,3]]],
    P:[[[0,0],[0,6],[3,6],[4,5],[4,4],[3,3],[0,3]]],
    "'":[[[1,6],[1,4]]],
  };
  function word(text,baseY,scale,mat){
    const width=text.length*6*scale-2*scale,start=-1.10-width/2;
    for(let i=0;i<text.length;i++){
      const glyph=paths[text[i]]||[];
      for(const path of glyph){
        for(let j=1;j<path.length;j++){
          const to=(p)=>[start+(i*6+p[0])*scale,baseY+p[1]*scale,-4.02];
          segment(badge,to(path[j-1]),to(path[j]),.013,mat,'Neon '+text[i]);
        }
      }
    }
  }
  word("YUVAL'S",3.055,.043,mats.cyan);
  word('WORKSHOP',2.69,.038,mats.amber);
  // Trail peak / circuit trace makes the title a cycling-tech badge.
  const ridge=[[-1.76,3.39],[-1.60,3.45],[-1.46,3.38],[-1.29,3.50],[-1.13,3.38],[-.92,3.43],[-.72,3.38]];
  ridge.slice(1).forEach((p,i)=>segment(badge,[...ridge[i],-4.02],[...p,-4.02],.008,mats.amber,'Trail ridge'));
  for(const x of [-1.89,-.32]){
    const dot=new THREE.Mesh(new THREE.SphereGeometry(.018,8,6),mats.cyan);
    dot.position.set(x,2.51,-4.01);badge.add(dot);
  }
}
