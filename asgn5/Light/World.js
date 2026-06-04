import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

  const fov = 45;
  const aspect = 2; 
  const near = 0.1;
  const far = 1000; 
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 15, 25); 

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.target.set(0, 2, 0); 
  controls.update();

  const scene = new THREE.Scene();

  const cubeLoader = new THREE.CubeTextureLoader();
  const skyboxTexture = cubeLoader.load([
    'sky.jpg', 
    'sky.jpg', 
    'sky.jpg', 
    'sky.jpg', 
    'sky.jpg', 
    'sky.jpg' 
  ]);
  
  skyboxTexture.colorSpace = THREE.SRGBColorSpace;
  scene.background = skyboxTexture;

  const color = 0xFFFFFF;
  const intensity = 3;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);
  
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const skyColor = 0xB1E1FF;
  const groundColor = 0xB97A20;
  const hemisphereIntensity = 0.5;
  const hemisphereLight = new THREE.HemisphereLight(skyColor, groundColor, hemisphereIntensity);
  scene.add(hemisphereLight);

  const planeSize = 40;
  const loader = new THREE.TextureLoader();
  const wallTexture = loader.load('wall.jpg');

  wallTexture.colorSpace = THREE.SRGBColorSpace;
  wallTexture.magFilter = THREE.NearestFilter;

  const textureMaterial = new THREE.MeshPhongMaterial({ map: wallTexture });

  const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
  const planeMat = new THREE.MeshPhongMaterial({
    map: wallTexture,
    side: THREE.DoubleSide,
  });
  const planeMesh = new THREE.Mesh(planeGeo, planeMat);
  planeMesh.rotation.x = Math.PI * -.5;
  scene.add(planeMesh);

  function createCatFace() {
    const catGroup = new THREE.Group();
    const cubeGeo = new THREE.BoxGeometry(1, 1, 1);
    const blackMat = new THREE.MeshPhongMaterial({ color: 0x000000 });

    const layout = [
      { pos: [-2, 0.5, -2] }, { pos: [-3, 0.5, -3] }, { pos: [-1, 0.5, -1] },

      { pos: [ 2, 0.5, -2] }, { pos: [ 3, 0.5, -3] }, { pos: [ 1, 0.5, -1] },

      { pos: [-3, 0.5,  0] }, { pos: [-3, 0.5,  1] },
      { pos: [ 3, 0.5,  0] }, { pos: [ 3, 0.5,  1] },

      { pos: [-1, 0.5,  2] }, { pos: [ 0, 0.5,  2] }, { pos: [ 1, 0.5,  2] },

      { pos: [-1.5, 0.5, -0.5] },

      { pos: [ 1.5, 0.5, -0.5] },

      { pos: [ 0, 0.5,  0.2] },

      { pos: [-4, 0.5,  0.5] }, { pos: [-5, 0.5,  0.5] }, 
      { pos: [ 4, 0.5,  0.5] }, { pos: [ 5, 0.5,  0.5] }  
    ];

    layout.forEach(item => {
      const block = new THREE.Mesh(cubeGeo, blackMat);
      block.position.set(item.pos[0], item.pos[1], item.pos[2]);
      catGroup.add(block);
    });

    catGroup.position.set(0, 0, 2);
    scene.add(catGroup);
  }
  
  createCatFace();

  const customCubeSize = 4;
  const customCubeGeo = new THREE.BoxGeometry(customCubeSize, customCubeSize, customCubeSize);
  const customCubeMat = new THREE.MeshPhongMaterial({ color: '#8AC' });
  const customCubeMesh = new THREE.Mesh(customCubeGeo, customCubeMat);
  customCubeMesh.position.set(customCubeSize + 4, customCubeSize / 2, 0); 
  scene.add(customCubeMesh);

  const sphereRadius = 3;
  const sphereWidthDivisions = 32;
  const sphereHeightDivisions = 16;
  const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
  const sphereMat = new THREE.MeshPhongMaterial({ color: '#CA8' });
  
  const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat); 
  sphereMesh.position.set(-sphereRadius - 4, sphereRadius + 2, 0); 
  scene.add(sphereMesh);

  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  const cubes = [
    makeInstance(geometry, 0x8844aa, -2),        
    makeInstance(geometry, textureMaterial, 0),   
    makeInstance(geometry, 0xaa8844,  2),        
  ];

  const gltfLoader = new GLTFLoader();
  gltfLoader.load('lab1.glb', (gltf) => {
    const root = gltf.scene;
    root.position.z = -8; 
    root.position.y = 2;
    scene.add(root);
  });

  function makeInstance(geometry, colorOrMaterial, x) {
    let material;
    if (colorOrMaterial instanceof THREE.Material) {
      material = colorOrMaterial;
    } else {
      material = new THREE.MeshPhongMaterial({ color: colorOrMaterial });
    }
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    cube.position.x = x;
    cube.position.y = boxHeight / 2 + 6; // Lifted up to float cleanly above the face
    return cube;
  }

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {
    time *= 0.001; 

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    controls.update();

    cubes.forEach((cube, ndx) => {
      const speed = 1 + ndx * .1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();