import THREE from '../third_party/three.js';
import {renderer, getCamera} from '../modules/three.js';
import Maf from '../modules/maf.js';
import easings from '../modules/easings.js';
import RoundedExtrudedPolygonGeometry from '../modules/three-rounded-extruded-polygon.js';

const canvas = renderer.domElement;
const camera = getCamera();
const scene = new THREE.Scene();
const group = new THREE.Group();

const whiteMaterial = new THREE.MeshStandardMaterial({color:0xffffff, metalness: .3, roughness: .2});
const blackMaterial = new THREE.MeshStandardMaterial({color:0xb70000, metalness: .3, roughness: .2});
const geo = new RoundedExtrudedPolygonGeometry(.75,.2,6,1,.1,.25,5);

const S = 8;
const objects = [];
for (let y=-S; y<S; y++) {
  for (let x=-S; x<S; x++) {
    let mat = 0;
    if (x%2 && y%2) mat = 1;
    const mesh = new THREE.Mesh(
      geo,
      blackMaterial.clone()
    );
    const pivot = new THREE.Group();
    mesh.position.z = -.1;
    pivot.position.x = x * 1.5;
    pivot.position.y = y * 1.7;
    mesh.scale.setScalar(.98);
    mesh.receiveShadow = mesh.castShadow = true;
    if(x%2) {
      pivot.position.y += .85;
    }
    mesh.position.y += .85;
    pivot.add(mesh);
    objects.push({pivot,x,y,mat});
    group.add(pivot);
  }
}
group.scale.setScalar(.175);
group.rotation.x =- Math.PI / 2;
scene.add(group);

const directionalLight = new THREE.DirectionalLight( 0xffffff, .5 );
directionalLight.position.set(-2,2,2);
directionalLight.castShadow = true;
scene.add( directionalLight );

const directionalLight2 = new THREE.DirectionalLight( 0xffffff, .5 );
directionalLight2.position.set(1,2,1);
directionalLight2.castShadow = true;
scene.add( directionalLight2 );

const ambientLight = new THREE.AmbientLight(0x808080, .5);
scene.add(ambientLight);

const light = new THREE.HemisphereLight( 0xcefeff, 0xb3eaf0, .5 );
scene.add( light );

camera.position.set(0,5,-.000001);
camera.lookAt(group.position);
renderer.setClearColor(0,1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const loopDuration = 3;
const cameraOffset = new THREE.Vector3();

function draw(startTime) {

  const time = ( .001 * (performance.now()-startTime)) % loopDuration;
  const t = time / loopDuration;

  objects.forEach( (o, id) => {
    const delay = .075*o.y + .0005*Math.exp(Math.abs(o.x));
    let tt = Maf.mod(t - delay, 1);

    o.pivot.rotation.x = easings.InOutQuint(tt) * Maf.PI;
  });

  renderer.render(scene, camera);
}

export { draw, loopDuration, canvas };
