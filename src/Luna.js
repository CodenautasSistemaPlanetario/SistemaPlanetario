import * as THREE from 'three';
import {changeScene} from "../Controlador.js";


const keys = { w: false, s: false, a: false, d: false };
var clock;

var sceneLuna,cameraLuna, renderer;
var character;

function CreateSceneLuna(globalrenderer)
{
    sceneLuna = new THREE.Scene();
    cameraLuna = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    globalrenderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(globalrenderer.domElement);
    renderer = globalrenderer;


    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 5).normalize();
    sceneLuna.add(light);
  
    // Suelo
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, side: THREE.DoubleSide });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2; // Lo rotamos para que esté plano
    sceneLuna.add(ground);

    // Personaje
    const characterGeometry = new THREE.BoxGeometry(1, 2, 1);
    const characterMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    character = new THREE.Mesh(characterGeometry, characterMaterial);
    character.position.set(0, 1, 0); // Levantarlo un poco para que no esté dentro del suelo
    sceneLuna.add(character);

    // Cámara
    cameraLuna.position.set(0, 5, 10);
    cameraLuna.lookAt(character.position);

    return [sceneLuna, cameraLuna];
}



function animateSceneLunas() {
    requestAnimationFrame(animateSceneLunas);

    // Mover el personaje
    const speed = 0.1;
    if (keys.w) character.position.z -= speed;
    if (keys.s) character.position.z += speed;
    if (keys.a) character.position.x -= speed;
    if (keys.d) character.position.x += speed;

    renderer.render(sceneLuna, cameraLuna);
}

function onkeydown(event) {
    const key = event.key;

    switch (key) {
        case "w":
        case "W":
            keys.w = true;
            break;
        case "s":
        case "S":
            keys.s = true;
            break;
        case "a":
        case "A":
            keys.a = true;
            break;
        case "d":
        case "D":
            keys.d = true;
            break;
    }

};

function onkeyup(event) {
    const key = event.key;

    switch (key) {
        case "w":
        case "W":
            keys.w = false;
            break;
        case "s":
        case "S":
            keys.s = false;
            break;
        case "a":
        case "A":
            keys.a = false;
            break;
        case "d":
        case "D":
            keys.d = false;
            break;
    }

}

function resize(event){
    renderer.setSize(window.innerWidth, window.innerHeight);
    cameraPlanets.aspect = window.innerWidth / window.innerHeight;
    cameraPlanets.updateProjectionMatrix();
};

function addEventsLuna(){
    window.addEventListener("resize", resize);
    window.addEventListener("keydown", onkeydown);
    window.addEventListener("keyup", onkeyup);

}

function removeEventsLuna(){
    window.removeEventListener("resize", resize);
    window.removeEventListener("keydown", onkeydown);
    window.removeEventListener("keyup", onkeyup);
}

export { CreateSceneLuna, animateSceneLunas, addEventsLuna, removeEventsLuna };
