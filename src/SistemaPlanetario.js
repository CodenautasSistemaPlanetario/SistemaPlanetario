import * as THREE from "three";
import {changeScene} from "../Controlador.js";
import { LoadArrayPreguntas } from "./Cuestionario.js";

//Loader
const loadertexture = new THREE.TextureLoader();
var scenePlanets, cameraPlanets, renderer;

var clock;
const planets = [];
const planetData = [
    { name:'AquaTerra',radius: 2,distance: 8,speed: 0, color: 0x2194ce, speedrotation: 0.01,},
    { name:'Zephyria',radius: 2, distance: 14, speed: 0, color: 0x9b7653, speedrotation: 0.002,},
    { name:'Mechanon',radius: 2, distance: 20, speed: 0, color: 0x3d9970, speedrotation: 0.003,},
    { name:'Nymboria',radius: 2, distance: 26, speed: 0, color: 0xa5673f, speedrotation: 0.004,},
    { name:'Ignis',radius: 2, distance: 32, speed: 0, color: 0xff0000, speedrotation: 0.005,},
    { name:'Alcyon',radius: 2, distance: 38, speed: 0, color: 0x00ffff, speedrotation: 0.006,},
];
var sun;


//Movimiento de la cámara
var camforward, camright;
var camspeed = 2;
var forward = 0;
var right = 0;
var rotsensitivity = 0.001;
let yaw=0;
let pitch=0;
var camCollisionSensitive = 60; //Suvidad con la que la camara colisiona con los planetas
var collision = false;


let alreadyplayed = false;

CreateScenePlanets();
addEventsPlanets();
function CreateScenePlanets(globalrenderer) {
    //Clock
    clock = new THREE.Clock();

    // Escena
    scenePlanets = new THREE.Scene();

    // Cámara
    cameraPlanets = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        2,
        1000
    );
    cameraPlanets.position.set(0, 5, 8);

    renderer = globalrenderer;
   


    //Movimento de la cámara
    camforward = new THREE.Vector3();
    cameraPlanets.getWorldDirection(camforward);
    camright = new THREE.Vector3();
    camright.crossVectors(cameraPlanets.up, camforward).normalize();


    // Crear geometría
    StarsGeometry();
    SunGeometry();
    PlanetGeometry();
    //Iluminación
    light();

    return [scenePlanets,cameraPlanets];
}

// Luz
function light() {
    const light = new THREE.PointLight(0xffffff, 2, 100);
    light.position.set(0, 0, 0);
    scenePlanets.add(light);
    const ambientLight = new THREE.AmbientLight(0x333333);
    scenePlanets.add(ambientLight);
}

// Fondo estrellado
function StarsGeometry() {
    const starGeometry = new THREE.BufferGeometry();
    const starVertices = [];
    for (let i = 0; i < 6000; i++) {
        starVertices.push((Math.random() - 0.5) * 2000);
        starVertices.push((Math.random() - 0.5) * 2000);
        starVertices.push((Math.random() - 0.5) * 2000);
    }
    starGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(starVertices, 3)
    );
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scenePlanets.add(stars);
}

// Sol
function SunGeometry() {
    const sunGeometry = new THREE.SphereGeometry(4, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    sun = sunMesh;
    scenePlanets.add(sunMesh);
}
// Planetas
function PlanetGeometry() {
    planetData.forEach((data) => {
        const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
        const planettexture = loadertexture.load(
            "./img/earthmap4k.jpg"
        );
        planettexture.wrapS = THREE.RepeatWrapping;
        planettexture.wrapT = THREE.RepeatWrapping;
        planettexture.repeat.set(1, 1);
        const material = new THREE.MeshPhongMaterial({ map: planettexture });
        const planet = new THREE.Mesh(geometry, material);
        planet.position.x = data.distance;
        planet.position.y = 0;
        planet.position.z = 0;
        planet.userData = {
            distance: data.distance,
            angle: Math.random() * Math.PI * 2,
            speed: data.speed,
            speedrotation: data.speedrotation,
        };
        planet.name = data.name;
        scenePlanets.add(planet);
        planets.push(planet);
    });
}

// Animación
function animateScenePlanets() {
    if(alreadyplayed){
        alreadyplayed = false;
        rebootScene();
    }

    //Planet Movement
    planets.forEach((planet) => {
        planet.userData.angle += planet.userData.speed;
        planet.position.x =
            planet.userData.distance * Math.cos(planet.userData.angle);
        planet.position.z =
            planet.userData.distance * Math.sin(planet.userData.angle);
        planet.rotation.y += planet.userData.speedrotation;
    });

    
    //Camera Movement
    const dt = clock.getDelta();
  
    cameraPlanets.updateProjectionMatrix();
    
    cameraPlanets.getWorldDirection(camforward);
    camright.crossVectors(cameraPlanets.up, camforward).normalize();
    
    if(!collision){
        if (forward!=0) {
            cameraPlanets.position.add(camforward.clone().multiplyScalar(forward * dt *camspeed));
        }
        if (right!=0) {
            cameraPlanets.position.add(camright.clone().multiplyScalar(right * dt *camspeed));
        }
    }   

    // Colisiones
    CheckPlanetsCollisions();
    CheckSunCollision();


    renderer.render(scenePlanets, cameraPlanets);
}

//Collisions
function CheckPlanetsCollisions() {
    //Check planet collisions
    planets.forEach((planet) => {
        collision = false;
        const distance = cameraPlanets.position.distanceTo(planet.position);
        if (distance < planet.geometry.parameters.radius + cameraPlanets.near + 0.2) {
            LoadArrayPreguntas(planet.name);
            document.exitPointerLock();
            changeScene("sceneCuestions");
        }
    });
}

function CheckSunCollision(){
    collision = false;
    const distance = cameraPlanets.position.distanceTo(sun.position);
    if (distance < sun.geometry.parameters.radius + cameraPlanets.near + 0.2) {
        const dt = clock.getDelta();
        const newpos = cameraPlanets.position.clone().add(camforward.clone().multiplyScalar(-camspeed));
        cameraPlanets.position.lerp(newpos, dt * camCollisionSensitive);
        collision = true;
    }
}

//reboot the escene
function rebootScene(){
    cameraPlanets.position.set(0, 5, 8);
    cameraPlanets.rotation.set(0, 0, 0);
    forward = 0;
    right = 0;
    yaw = 0;
    pitch = 0;
    collision = false;
}

// Eventos
function addEventsPlanets(){
    window.addEventListener("resize", resize);
    window.addEventListener("keydown", onkeydown);
    window.addEventListener("keyup", onkeyup);
    window.addEventListener("click", onClick);
    document.addEventListener("pointerlockchange", onPointerLockChange);

}

function removeEventsPlanets(){
    window.removeEventListener("resize", resize);
    window.removeEventListener("keydown", onkeydown);
    window.removeEventListener("keyup", onkeyup);
    window.removeEventListener("click", onClick);
    document.removeEventListener("pointerlockchange", onPointerLockChange);
    alreadyplayed = true;

}
// Redimensionar
function resize(event){
    renderer.setSize(window.innerWidth, window.innerHeight);
    cameraPlanets.aspect = window.innerWidth / window.innerHeight;
    cameraPlanets.updateProjectionMatrix();
};

// Teclado
function onkeydown(event) {
    const key = event.key;

    switch (key) {
        case "w":
        case "W":
            forward = 1;
            break;
        case "s":
        case "S":
            forward = -1;
            break;
        case "a":
        case "A":
            right = 1;
            break;
        case "d":
        case "D":
            right = -1;
            break;
    }

};

function onkeyup(event) {
    const key = event.key;
   
    switch (key) {
        case "w":
        case "W":
            forward = 0;
            break;
        case "s":
        case "S":
            forward = 0;
            break;
        case "a":
        case "A":
            right = 0;
            break;
        case "d":
        case "D":
            right = 0;
            break;
    }

};

// Activar el modo de captura del cursor al hacer clic
function onClick(event) {
    document.body.requestPointerLock();
};

// Escuchar cambios en el estado del Pointer Lock
function onPointerLockChange() {
    if (document.pointerLockElement === document.body) {
        document.addEventListener("mousemove", onMouseMove, false);
    } else {
        document.removeEventListener("mousemove", onMouseMove, false);
    }
};

function onMouseMove(event) {
   
    const dx = event.movementX || 0;
    const dy = event.movementY || 0;
    
    // Ajustar la rotación con la sensibilidad configurada
    yaw -= dx * rotsensitivity;
    pitch -= dy * rotsensitivity;

    // Limitar el ángulo de pitch para que la cámara no gire al revés
    pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));
    // Crear quaterniones para rotación en Y (yaw) y X (pitch)
    const quaternionYaw = new THREE.Quaternion();
    quaternionYaw.setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw);

    const quaternionPitch = new THREE.Quaternion();
    quaternionPitch.setFromAxisAngle(new THREE.Vector3(1, 0, 0), pitch);

    // Aplicar la rotación directamente a la cámara, no al cameraHolder
    cameraPlanets.quaternion.copy(quaternionYaw);
    cameraPlanets.quaternion.multiply(quaternionPitch);
};

export { CreateScenePlanets,animateScenePlanets,addEventsPlanets,removeEventsPlanets };
