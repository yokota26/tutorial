import * as THREE from "three";
import { OrbitControls } from "../build/jsm/OrbitControls.js";
// import * as THREE from "../build/three.module.js";

let scene, camera, renderer, pointLight, controls;

window.addEventListener("load", init);

// init=初期化
function init() {
  // add scene
  scene = new THREE.Scene();

  // add camera
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.set(0, 0, 500);

  // add render
  renderer = new THREE.WebGLRenderer({
    alpha: true, // alpha: 透明,defaulte = false
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  // Where? > <body>
  document.body.appendChild(renderer.domElement);

  // texuture
  let texture = new THREE.TextureLoader().load("/tutorial/textures/earth.jpg");

  // geometry
  let ballGeometry = new THREE.SphereGeometry(100, 64, 32); //(半径 + widesegment(polligonの数) + heightsegment)

  // material
  let ballMaterial = new THREE.MeshPhysicalMaterial({
    // color:
    map: texture,
  });

  // geometry + material = mesh
  let ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
  scene.add(ballMesh);

  // 並行光源(カラー＋強さ)
  let directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(1, 1, 1);
  // 0x = 16
  scene.add(directionalLight);

  // point光源
  pointLight = new THREE.PointLight(0xffffff, 2);
  pointLight.position.set(-200, -200, -200);

  // 以下の２行をscene.add(pointLight)の前に追加
  pointLight.decay = 1;
  pointLight.power = 1000;

  scene.add(pointLight);

  // where pointlight
  let pointLightHelper = new THREE.PointLightHelper(pointLight, 30); //第二引数は大きさ

  scene.add(pointLightHelper);

  window.addEventListener("resize", onWindowResize);
  animate();

  // orbitcontrols
  controls = new OrbitControls(camera, renderer.domElement);
}

// resize 
function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);

  // camera aspect
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
}

function animate() {
  // pointlight arownd
  pointLight.position.set(
    200 * Math.sin(Date.now() / 500),
    200 * Math.sin(Date.now() / 1000),
    200 * Math.cos(Date.now() / 500)
  );
  // rendering フレーム単位でレンダリング > animate
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
