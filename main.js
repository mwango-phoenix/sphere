import * as THREE from 'three'
import gsap from "gsap"
import './style.css'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"

const scene = new THREE.Scene();

//create a sphere
const geometry = new THREE.SphereGeometry(3, 64, 64)
const material = new THREE.MeshStandardMaterial({
  color: '#00ff83',
})
// combination of geometry and material
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh)

//size of viewport
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// add camera
const camera = new THREE.PerspectiveCamera(45, sizes.width/sizes.height, 0.1, 100) //field of view, aspect ratio, near clipping and far clipping point
camera.position.z = 20 
scene.add(camera)

//add lights
const light = new THREE.PointLight(0xffffff, 1, 100)
light.position.set(0, 10, 10) // x,y,z, positioning
scene.add(light)


const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({canvas})
renderer.setSize(sizes.width, sizes.height) //size of canvas
renderer.setPixelRatio(2)
renderer.render(scene, camera)


//controls 
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false
controls.autoRotate = true
controls.autoRotateSpeed = 5


//resizing update so that it is in sync
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  //camera update
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
})

const loop = () => {
  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(loop)
}

loop()

const timeline = gsap.timeline({defaults: {duration: 1}})
timeline.fromTo(mesh.scale, {z:0, x:0, y:0}, {z:1, x:1, y:1})


//colour animation
let mouseDown = false
window.addEventListener("mousedown", () => (mouseDown = true))
window.addEventListener("mouseup", () => (mouseDown = false))
let rgb=[]

window.addEventListener("mousemove", (e)=> {
  if (mouseDown) {
    rgb = [Math.round((e.pageX/sizes.width) * 255), 
          Math.round((e.pageY/sizes.height) * 255),
        150,]
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
    gsap.to(mesh.material.color, {r: newColor.r, g: newColor.g, b: newColor.b })
  }
})
