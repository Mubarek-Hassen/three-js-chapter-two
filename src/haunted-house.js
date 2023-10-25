import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as dat from "lil-gui"

document.title = "Haunted House"
THREE.ColorManagement.enabled = false

//! CANVAS
const canvas = document.querySelector(".webgl")


//! GUI
const gui = new dat.GUI()

//! SCENE
const scene = new THREE.Scene()

//! FOG
const fog = new THREE.Fog("#262837", 1, 15)
scene.fog = fog

//! TEXTURES
const textureLoader = new THREE.TextureLoader()

//! door textures
const doorColorTexture = textureLoader.load("/textures-haunted-house/door/color.jpg")
const doorAlphaTexture = textureLoader.load("/textures-haunted-house/door/alpha.jpg")
const doorAmbientOcclusionTexture = textureLoader.load("/textures-haunted-house/door/ambientOcclusion.jpg")
const doorHeightTexture = textureLoader.load("/textures-haunted-house/door/height.jpg")
const doorNormalTexture = textureLoader.load("/textures-haunted-house/door/normal.jpg")
const doorMetalnessTexture = textureLoader.load("/textures-haunted-house/door/metalness.jpg")
const doorRoghnessTexture = textureLoader.load("/textures-haunted-house/door/roughness.jpg")

//! wall textures
const brickColorTexture = textureLoader.load("/textures-haunted-house/bricks/color.jpg")
const brickAmbientOcclusionTexture = textureLoader.load("/textures-haunted-house/bricks/ambientOcclusion.jpg")
const brickNormalTexture = textureLoader.load("/textures-haunted-house/bricks/normal.jpg")
const brickRoughnessTexture = textureLoader.load("/textures-haunted-house/bricks/roughness.jpg")

//! grass textures
const grassColorTexture = textureLoader.load("/textures-haunted-house/grass/color.jpg")
const grassAmbientOcclusionTexture = textureLoader.load("/textures-haunted-house/grass/ambientOcclusion.jpg")
const grassNormalTexture = textureLoader.load("/textures-haunted-house/grass/normal.jpg")
const grassRoughnessTexture = textureLoader.load("/textures-haunted-house/grass/roughness.jpg")

grassColorTexture.repeat.set(8, 8)
grassAmbientOcclusionTexture.repeat.set(8, 8)
grassNormalTexture.repeat.set(8, 8)
grassRoughnessTexture.repeat.set(8, 8)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping

//! HOUSE
//* GROUP
const house = new THREE.Group()
scene.add(house)

//* WALLS
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: brickColorTexture,
    aoMap: brickAmbientOcclusionTexture,
    normalMap: brickNormalTexture,
    roughnessMap: brickRoughnessTexture,
  })
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
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({ 
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoghnessTexture
  })
)
door.position.y = 1
door.position.z = 2 + 0.01
house.add(door)

//* FLOOR
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
  })
)
floor.rotation.x = - Math.PI/2
floor.position.y = 0
scene.add(floor)

//* BUSHES
const bushGeometry = new THREE.SphereGeometry(1,16,16)
const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" })

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.position.set(0.8, 0.2, 2.2)
bush1.scale.set(0.5, 0.5, 0.5)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.position.set(1.4, 0.1, 2.1)
bush2.scale.set(0.25, 0.25, 0.25)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.position.set(-0.8, 0.1, 2.2)
bush3.scale.set(0.4, 0.4, 0.4)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.position.set(-1, 0.05, 2.6)
bush4.scale.set(0.15, 0.15, 0.15)

house.add(bush1, bush2, bush3, bush4)

//* GRAVES
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" })



for (let i = 0; i < 50; i++){
  const angle = Math.random() * Math.PI * 2
  const radius = 4 + (Math.random() * 5)
  const x = Math.sin(angle) * radius
  const z = Math.cos(angle) * radius
  const grave = new THREE.Mesh(graveGeometry, graveMaterial)
  grave.position.set(x, 0.3, z)
  grave.rotation.y = (Math.random() - 0.5) * 0.4
  grave.rotation.z = (Math.random() - 0.5) * 0.4
  graves.add(grave)
}

//! LIGHTS
//* Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.5)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001).name('ambient intensity')
scene.add(ambientLight)

//* Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.5)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001).name("moon intensity")
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

//* Door light
const doorLight = new THREE.PointLight("#ff7d46", 3.5, 7)
doorLight.position.set(0, 2.2, 2.7)
house.add(doorLight)

//! GHOST
const ghost1 = new THREE.PointLight("#ff00ff", 4, 3)
const ghost2 = new THREE.PointLight("#00ffff", 4, 3)
const ghost3 = new THREE.PointLight("#ffff00", 4, 3)

scene.add(ghost1, ghost2, ghost3)


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
renderer.setClearColor("#262837")
//! ANIMATE
const clock = new THREE.Clock()

function tick(){
  const elapsedTime = clock.getElapsedTime()
  
  //* update objects
  // GHOST
  const ghost1Angle = elapsedTime/2
  ghost1.position.x = Math.cos(ghost1Angle) * 4
  ghost1.position.z = Math.sin(ghost1Angle) * 4
  ghost1.position.y = Math.sin(elapsedTime * 3)

  const ghost2Angle = -elapsedTime/3
  ghost2.position.x = Math.cos(ghost2Angle) * 4
  ghost2.position.z = Math.sin(ghost2Angle) * 4
  ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

  const ghost3Angle = elapsedTime/4
  ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime/3))
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime/2))
  ghost3.position.y = Math.cos(elapsedTime * 4)


  //* update control
  controls.update()

  //* renderer
  renderer.render(scene, camera)

  //* request animation
  requestAnimationFrame(tick)
}
tick()