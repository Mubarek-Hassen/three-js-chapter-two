import * as THREE from "three"
import * as dat from "lil-gui"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

//! GUI
// const gui = new dat.GUI()
//! CANVAS
const canvas = document.querySelector("canvas.webgl")
//! SCENE
const scene = new THREE.Scene()

//! TEXTURES
const textureLoader = new THREE.TextureLoader()

//! OBJECTS

//* PARTICLES
const particlesGeometry = new THREE.SphereGeometry(1,32,32)
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.02,
  sizeAttenuation: true,
})

//* particles points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)


//! CAMERA
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}
const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 1, 1000)
camera.position.set(0, 1, 3)
scene.add(camera)

//* resize & full screen
window.addEventListener("resize", ()=>{
  //  update the sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  //  update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  //  update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
window.addEventListener("dblclick", ()=>{
  if(!document.fullscreenElement){
    canvas.requestFullscreen()
  } else{
    document.exitFullscreen()
  }
})

//! CONTROLS
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

//! RENDERER
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//! ANIMATE

const clock = new THREE.Clock()

function tick(){
  const elapsedTime = clock.getElapsedTime()

  //* update objects

  //* renderer update
  renderer.render(scene, camera)

  //* req again
  window.requestAnimationFrame(tick)
}

tick()