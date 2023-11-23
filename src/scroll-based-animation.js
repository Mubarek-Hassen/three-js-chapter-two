import * as THREE from "three"
import * as dat from "lil-gui"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

//!		BASICS
THREE.ColorManagement.enabled = false
const canvas = document.querySelector("canvas.webgl")
const gui = new dat.GUI()
const scene = new THREE.Scene()
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
}
window.addEventListener("dblclick", ()=>{
	if(!document.fullscreenElement){
		canvas.requestFullscreen()
	} else {
		document.exitFullscreen()
	}
})
window.addEventListener("resize", ()=>{
	//update size
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	//update camera
	camera.aspect = sizes.width/sizes.height
	camera.updateProjectionMatrix()

	//update renderer
	renderer.setSize( sizes.width, sizes.height )
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


const parameters = {
	materialColor: "#ffeded"
}

gui.addColor(parameters, "materialColor").onChange(()=>{
	material.color.set(parameters.materialColor)
})

//!		TEXTURES
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load("./scroll-based-textures/gradients/3.jpg")
gradientTexture.magFilter = THREE.NearestFilter

//!		MATERIAL
const material = new THREE.MeshToonMaterial({ 
	color: parameters.materialColor, 
	gradientMap: gradientTexture,
})



//!		LIGHT
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.position.set(1,1,0)
scene.add(directionalLight)


//!		OBJECTS

const mesh1 = new THREE.Mesh(
	new THREE.TorusGeometry(1, 0.4, 16, 60),
	material
)

const mesh2 = new THREE.Mesh(
	new THREE.ConeGeometry(1, 2, 32),
	material
)
const mesh3 = new THREE.Mesh(
	new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
	material
)

scene.add(mesh1, mesh2, mesh3)



//!		CAMERA
const camera = new THREE.PerspectiveCamera( 35, sizes.width/sizes.height, 0.1, 100)
camera.position.set(0, 0, 6)
scene.add(camera)

//!		RENDERER
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, })
renderer.setSize( sizes.width, sizes.height )
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputColorSpace = THREE.LinearSRGBColorSpace

//!		CONTROLS
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

//!		ANIMATE
const clock = new THREE.Clock()

function tick(){
	const elapsedTime = clock.elapsedTime

	// update objects


	// update control
	// controls.update()

	// renderer
	renderer.render(scene, camera)

	// request animation
	window.requestAnimationFrame(tick)

}
tick()