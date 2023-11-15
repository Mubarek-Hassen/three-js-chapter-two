import * as THREE from "three"
import * as dat from "lil-gui"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

THREE.ColorManagement.enabled = false
//! GUI
const gui = new dat.GUI()
//! CANVAS
const canvas = document.querySelector("canvas.webgl")
//! SCENE
const scene = new THREE.Scene()

//! TEXTURES
const textureLoader = new THREE.TextureLoader()

//! OBJECTS

//* parameters
const parameters = {}
parameters.count = 1000
parameters.size = 0.02

gui.add(parameters, "count").min(100).max(100000).step(100).onFinishChange(generateGalaxy)
gui.add(parameters, "size").min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy)

let geometry = null
let material = null
let points = null

//* galaxy
function generateGalaxy(){
  if(points !== null){
    geometry.dispose()
    material.dispose()
    scene.remove(points)
  }
  geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(parameters.count * 3)
  for(let i = 0; i <parameters.count; i++){
    const i3 = i * 3
    positions[i3    ] = (Math.random() - 0.5) * 3
    positions[i3 + 1] = (Math.random() - 0.5) * 3
    positions[i3 + 2] = (Math.random() - 0.5) * 3
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
})
  points = new THREE.Points(geometry, material)
    scene.add(points)
}
generateGalaxy()

//! SIZE
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

//! CAMERA
const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.1, 100)
camera.position.set(0, 1, 4)
scene.add(camera)

//! RESIZE & FULL SCREEN
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
controls.enableDamping = true;

//! RENDERER
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//! ANIMATE

const clock = new THREE.Clock()

function tick(){

  //* update objects

  //* update control
  controls.update()

  //* renderer
  renderer.render(scene, camera)

  //* request animation
  requestAnimationFrame(tick)
}
tick()