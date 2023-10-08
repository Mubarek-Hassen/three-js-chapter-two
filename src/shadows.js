import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as dat from "lil-gui"

//! CANVAS
const canvas = document.querySelector(".webgl")
THREE.ColorManagement.enabled = false

//! SCENE
const scene = new THREE.Scene()

//! OBJECTS
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1,1,1),
  new THREE.MeshBasicMaterial()
)
scene.add(cube)

//! SIZES
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

//! CAMERA
const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 1, 1000)
camera.position.set(0, 1, 2)
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