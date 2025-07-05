import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 4, 5);
camera.lookAt(scene.position);

// render
const renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setClearColor(0xffdab9);
console.log(renderer)
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const light = new THREE.DirectionalLight(0xffffff, 3);
scene.add(light);

const pointLight = new THREE.PointLight(0xffffff, 50, 10);
pointLight.position.set(-1, 2, 0);
pointLight.visible = false;
scene.add(pointLight);

const raycaster = new THREE.Raycaster();
let btnMesh: THREE.Object3D | null = null;
const mouse = new THREE.Vector2();

const loader = new GLTFLoader();
loader.load("models/light_three.glb", (gltf) => {
  scene.add(gltf.scene);
  gltf.scene.traverse((obj) => {
    if (obj.name === "btn" && obj instanceof THREE.Mesh) {
      btnMesh = obj;
    }
  });
});

renderer.domElement.addEventListener("click", (e) => {
  if (!btnMesh) return;
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(btnMesh, true);
  if (intersects.length > 0) {
    pointLight.visible = !pointLight.visible;
  }

  if (pointLight.visible) {
    btnMesh.position.y = 0.3;
  } else if (!pointLight.visible) {
    btnMesh.position.y = 0.36;
  }
  console.log(btnMesh);
});

// resize
window.addEventListener("resize", () => {
  (camera.aspect = window.innerWidth / window.innerHeight),
    camera.updateProjectionMatrix(),
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// animate
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
