import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as dat from "lil-gui"

THREE.ColorManagement.enabled = false

//! CANVAS
const canvas = document.querySelector(".webgl")

//! GUI
const gui = new dat.GUI()

//! SCENE
const scene = new THREE.Scene()

//! TEXTURES
const textureLoader = new THREE.TextureLoader()

//! HOUSE

//* GROUP
const house = new THREE.Group()
scene.add(house)

//* WALLS
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({ color: '#ac8e82' })
)
walls.position.y = 2.5/2
house.add(walls)

//* ROOF
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: "#b35f45" })
)
roof.rotation.y = Math.PI * 0.25
roof.position.y = 2.5 + 1/2
house.add(roof)

//* DOOR
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  new THREE.MeshStandardMaterial({ color: "#aa7b7b" })
)
door.position.y = 1
door.position.z = 2 + 0.01
house.add(door)

//* FLOOR
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: "#a9c388" })
)
floor.rotation.x = - Math.PI/2
floor.position.y = 0
scene.add(floor)

//! LIGHTS
//* Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 1)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001).name('ambient intensity')
scene.add(ambientLight)

//* Directional light
const moonLight = new THREE.DirectionalLight('#ffffff', 1)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001).name("moon intensity")
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

//! SIZES
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

//! CAMERA
const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 1, 1000)
camera.position.set(4, 2, 5)
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


  //* update control
  controls.update()

  //* renderer
  renderer.render(scene, camera)

  //* request animation
  requestAnimationFrame(tick)
}
tick()