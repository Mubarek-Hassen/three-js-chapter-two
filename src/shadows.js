import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as dat from "lil-gui"

document.title = "shadows - 3js"
//! CANVAS
const canvas = document.querySelector(".webgl")
THREE.ColorManagement.enabled = false

//! DEBUG
const gui = new dat.GUI()

//! SCENE
const scene = new THREE.Scene()

//! LIGHTS
//! Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
gui.add(ambientLight, 'intensity').min(0).max(4).step(0.001)
scene.add(ambientLight)

//! Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3)
directionalLight.position.set(2, 2, - 1)
gui.add(directionalLight, 'intensity').min(0).max(3).step(0.001)
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)
directionalLight.castShadow = true

//* RENDER SIZE OPTIMIZATION
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024

//* AMPLITUDE/SHADOW CAMERA OPTIMIZATION
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = -2
directionalLight.shadow.camera.left = -2
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 6

//* BLUR OPTIMIZATION
directionalLight.shadow.radius = 3

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
directionalLightCameraHelper.visible = false

scene.add(directionalLight, directionalLightCameraHelper)

//! SPOTLIGHT
const spotLight = new THREE.SpotLight(0xffffff, 2, 10, Math.PI * 0.3)
spotLight.castShadow = true;
spotLight.position.set(0,2,2)


spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
spotLight.shadow.camera.fov = 30
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 6

scene.add(spotLight, spotLight.target)

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
spotLightCameraHelper.visible = false
scene.add(spotLightCameraHelper)

//! POINTLIGHT
const pointLight = new THREE.PointLight(0xffffff, 3, 10)
pointLight.position.set(-1, 1, 0)
pointLight.castShadow = true

pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024

pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 5

scene.add(pointLight)

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
pointLightCameraHelper.visible = false
scene.add(pointLightCameraHelper)

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
sphere.castShadow = true
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(4,4),
  material
)
plane.rotation.x = -Math.PI/2
plane.position.y = -0.5
plane.receiveShadow = true

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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap


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