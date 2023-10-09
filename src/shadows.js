import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as dat from "lil-gui"

//! CANVAS
const canvas = document.querySelector(".webgl")
THREE.ColorManagement.enabled = false

//! DEBUG
const gui = new dat.GUI()

//! SCENE
const scene = new THREE.Scene()

//! LIGHTS
//! Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

//! Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(2, 2, - 1)
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(directionalLight)

//! MATERIALS
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

//! OBJECTS
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  material
)

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(4,4),
  material
)
plane.rotation.x = -Math.PI/2
plane.position.y = -0.5

scene.add(sphere, plane)

//! SIZES
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

//! CAMERA
const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 1, 1000)
camera.position.set(1, 1, 2)
scene.add(camera)

//! CONTROLS
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

//! RENDERER
const renderer = new THREE.WebGLRenderer({canvas})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputColorSpace = THREE.LinearSRGBColorSpace

//! CLOCK
const clock = new THREE.Clock()

//! ANIMATE
const tick =()=>{

  const elapsedTime = clock.getElapsedTime()

  //* Update objects


  //* Update controls
  controls.update()

  //* Render
  renderer.render(scene, camera)

  //* Call it again on the next frame
  window.requestAnimationFrame(tick)
}

tick()