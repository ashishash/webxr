import * as THREE from './three.module.js'
import {GLTFLoader} from './GLTFLoader.js'

const canvas = document.querySelector('.webgl')
const scene = new THREE.Scene()

const loader = new GLTFLoader()
loader.load('./both.glb', function(glb){
    console.log(glb)
    const root = glb.scene;
    root.scale.set(5,5,5)

    scene.add(root);
})

const light = new THREE.DirectionalLight( 0xffffff,1)
light.position.set(2,2,5)
scene.add(light)




const sizes = {

    width: window.innerWidth,
    height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75,sizes.width/sizes.height)
camera.position.set(0,1,2)
scene.add(camera)

const renderer = new THREE.WebGL1Renderer({
    canvas:canvas
})


renderer.setSize(sizes.width,sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
renderer.shadowMap.enabled = true
renderer.gammaOuput = true


function animate(){
    requestAnimationFrame(animate)
    renderer.render(scene,camera)
}

animate()
