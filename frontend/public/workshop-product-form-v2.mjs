// One shared bevelled volume for every conveyor product.
export function createGlassDiamond(THREE) {
  const width=.30, corner=.047, a=-width/2, b=width/2;
  const shape=new THREE.Shape();
  shape.moveTo(a+corner,a);
  shape.lineTo(b-corner,a);shape.quadraticCurveTo(b,a,b,a+corner);
  shape.lineTo(b,b-corner);shape.quadraticCurveTo(b,b,b-corner,b);
  shape.lineTo(a+corner,b);shape.quadraticCurveTo(a,b,a,b-corner);
  shape.lineTo(a,a+corner);shape.quadraticCurveTo(a,a,a+corner,a);
  const geometry=new THREE.ExtrudeGeometry(shape,{
    depth:.14,bevelEnabled:true,bevelSize:.017,bevelThickness:.017,
    bevelSegments:3,curveSegments:7,steps:1,
  });
  geometry.translate(0,0,-.07);
  const outlineAt=z=>new THREE.BufferGeometry().setFromPoints(
    shape.getPoints(48).map(point=>new THREE.Vector3(point.x,point.y,z)));
  return {geometry,frontOutline:outlineAt(.089),backOutline:outlineAt(-.089)};
}
