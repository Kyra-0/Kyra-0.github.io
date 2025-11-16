import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x111111);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(4, 5, 11);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = false;
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 200;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false;
controls.target = new THREE.Vector3(10, 0, 0);
controls.update();



const sunLight = new THREE.DirectionalLight(0xffffff, 3); // intensity lower than your 3000 spotlight
sunLight.position.set(50, 100, 50); // position in the sky
sunLight.castShadow = true;
sunLight.shadow.bias = -0.0005;
sunLight.shadow.normalBias = 0.05;
// Configure shadow properties
sunLight.shadow.mapSize.width = 2048  // higher = sharper shadows
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.camera.near = 0.5;
sunLight.shadow.camera.far = 500;
sunLight.shadow.camera.left = -20;
sunLight.shadow.camera.right = 20;
sunLight.shadow.camera.top = 20;
sunLight.shadow.camera.bottom = -20;
scene.add(sunLight);

const ambient = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambient);


const loader = new GLTFLoader().setPath('public/');

let turbineMesh = null;
let pump1 = null;
let pump2 = null;
let pump3 = null

function loadModel(fileName, position, onLoad) {
  loader.load(fileName, (gltf) => {
    const mesh = gltf.scene;

    mesh.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    // Wrap in a group to fix rotation pivot
    const group = new THREE.Group();

    const box = new THREE.Box3().setFromObject(mesh);
    const center = new THREE.Vector3();
    box.getCenter(center);
    mesh.position.sub(center); // center the mesh in the group

    group.add(mesh);
    group.position.copy(position);
    scene.add(group);

    if (onLoad) onLoad(group); // assign the group to turbineMesh
  }, undefined, (err) => console.error(err));
}

// Add models

loadModel('turbine.glb', new THREE.Vector3(4.3, -10.35, -2.3), (group) => {
  turbineMesh = group;

  group.traverse(child => {
    if (child.isMesh) {
      child.castShadow = false;
      child.receiveShadow = false;
    }
  });
});

loadModel('pump.glb', new THREE.Vector3(10, -11.4, -9.3), (group) => {
  pump1 = group;

  group.traverse(child => {
    if (child.isMesh) {
      child.castShadow = false;
      child.receiveShadow = false;
    }
  });
});
loadModel('pump.glb', new THREE.Vector3(6.3, -11.6, -17.1), (group) => {
  pump2 = group;

  group.traverse(child => {
    if (child.isMesh) {
      child.castShadow = false;
      child.receiveShadow = false;
    }
  });
});
loadModel('pump.glb', new THREE.Vector3(7.4, -11, 9.7), (group) => {
  pump3 = group;

  group.traverse(child => {
    if (child.isMesh) {
      child.castShadow = false;
      child.receiveShadow = false;
    }
  });
});

loadModel('static.glb', new THREE.Vector3(0,0,0))

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.2));

function animate() {
  requestAnimationFrame(animate);
  controls.update();


    turbineMesh.rotation.z += 0.02; // adjust speed
    pump1.rotation.y += 0.02;
    pump2.rotation.y += 0.02;
    pump3.rotation.y += 0.02;
 
  renderer.render(scene, camera);
}

animate();