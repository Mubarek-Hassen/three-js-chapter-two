import * as THREE from "three"
import * as dat from "lil-gui"
import gsap from "gsap"

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
	particlesMaterial.color.set(parameters.materialColor)

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

const objectsDistance = 4

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

mesh1.position.y = - objectsDistance * 0
mesh2.position.y = - objectsDistance * 1
mesh3.position.y = - objectsDistance * 2

mesh1.position.x = 2
mesh2.position.x = -2
mesh3.position.x = 2

scene.add(mesh1, mesh2, mesh3)

const sectionMeshes = [ mesh1, mesh2, mesh3 ]


//!		PARTICLES
const particleCount = 200
const positions = new Float32Array(particleCount * 3)

for (let i = 0; i < particleCount; i++) {
	positions[i * 3 + 0] = (Math.random() - 0.5) * 10
	positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * 3
	positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}
const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))

const particlesMaterial = new THREE.PointsMaterial({
	color: parameters.materialColor,
	sizeAttenuation: true,
	size: 0.03
})

const particles = new THREE.Points(particlesGeometry, particlesMaterial)

scene.add(particles)

//!		CAMERA
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)
const camera = new THREE.PerspectiveCamera( 35, sizes.width/sizes.height, 0.1, 100)
camera.position.set(0, 0, 6)
cameraGroup.add(camera)

//!		RENDERER
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, })
renderer.setSize( sizes.width, sizes.height )
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputColorSpace = THREE.LinearSRGBColorSpace



//*		SCROLL

let scrollY = window.scrollY
let currentSection = 0

window.addEventListener("scroll", ()=>{
	scrollY = window.scrollY
	const newSection = Math.round(scrollY / sizes.height)
	if(newSection !== currentSection){
		currentSection = newSection
		gsap.to(
			sectionMeshes[currentSection].rotation,
			{
				duration: 1.5,
				ease: "power2.inOut",
				x: '+=6',
				y: '+=3',
				z: "+=1.5"
			}
		)
	}
})

//*		CURSOR
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener("mousemove", (event)=>{

	cursor.x = event.clientX / sizes.width - 0.5
	cursor.y = event.clientY / sizes.height - 0.5
})




//!		ANIMATE
const clock = new THREE.Clock()
let prevTime = 0

function tick(){
	const elapsedTime = clock.getElapsedTime()
	const deltaTime = elapsedTime - prevTime
	prevTime = elapsedTime




	// update objects
	camera.position.y = - scrollY / sizes.height * objectsDistance

	const parallaxX = cursor.x * 0.5
	const parallaxY = - cursor.y * 0.5

	cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 0.01 * deltaTime
	cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 0.01 * deltaTime

	for(const mesh of sectionMeshes){
		
		mesh.rotation.x += deltaTime * 0.1
		mesh.rotation.y += deltaTime * 0.12

	}
	// renderer
	renderer.render(scene, camera)

	// request animation
	window.requestAnimationFrame(tick)

}
tick()