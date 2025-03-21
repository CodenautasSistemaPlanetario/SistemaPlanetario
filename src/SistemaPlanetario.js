import * as THREE from "three";
import {changeScene} from "../Controlador.js";
import { LoadArrayPreguntas } from "./Cuestionario.js";
import { manager } from './LoadingManager.js';
import { TextGeometry } from 'https://unpkg.com/three@latest/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'https://unpkg.com/three@latest/examples/jsm/loaders/FontLoader.js';

//Loader
const loadertexture = new THREE.TextureLoader(manager);
const loaderfont = new FontLoader(manager);
let font ;
loaderfont.load('./font/ArcaneNine_Regular.json', 
    // Callback para cuando la fuente se carga con éxito
    function(loadedFont) {
        font = loadedFont;
    PlanetGeometry();
    MoonGeometry();
    console.log("Fuente cargada correctamente");
    },
    // Callback de progreso (opcional)
    undefined,
    // Callback de error
    function(err) {
        console.error("Error cargando fuente:", err);
    }
);
var scenePlanets, cameraPlanets, renderer;

//Planet Text 
const TextSize = 0.5;
const TextHeight = 0.1;
const TextColor = 0xffffff;
const TextDepth = 0.1;

var clock;
const planets = [];
const planetData = [
    { name:'AquaTerra',radius: 2,distance: 8,speed:0.12,  color: 0x2194ce, speedrotation: 0.5026,},//50 seg
    { name:'Zephyria',radius: 2, distance: 18, speed: 0.0739, color: 0x9b7653, speedrotation: 0.2957,},//1:25min
    { name:'Mechanon',radius: 2, distance: 28, speed: 0.0502, color: 0x3d9970, speedrotation: 0.201,},// 2:05min
    { name:'Nymboria',radius: 2, distance: 38, speed: 0.0374, color: 0xa5673f, speedrotation: 0.1496,}, // 2:48 mins
    { name:'Ignis',radius: 2, distance: 48, speed: 0.0292, color: 0xff0000, speedrotation: 0.1169,},//3:35 mins
    { name:'Alcyon',radius: 2, distance: 58, speed: 0.0246, color: 0x00ffff, speedrotation: 0.1117,},//4:15mins
];
var sun;

const moons = [];
const moonData = [
    { name:'Luna', namePlanet:'Mechanon', radius: 0.5, distance: 3.5, speed: 0.00748, speedrotation: 0.5,},
    { name:'Phobos', namePlanet:'Nymboria', radius: 0.5, distance: 3.5, speed: 0.005845, speedrotation: 0.5,},
    { name:'Deimos', namePlanet:'Ignis', radius: 0.5, distance: 3.5, speed:0.005585, speedrotation: 0.5,},
];


//Movimiento de la cámara
var camforward;
var camspeed = 4;
var camCollisionSensitive = 60; //Suvidad con la que la camara colisiona con los planetas


let alreadyplayed = false;

const num_Stars = 1200;

const TexturePath = "./img/Planets/";

let checkedThisFrame = false;


// addEventsPlanets();
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
   


    // Crear geometría
    StarsGeometry();
    SunGeometry();
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
// Fondo estrellado - con tres métodos diferentes
function StarsGeometry() {
    
        const starGeometry = new THREE.BufferGeometry();
        const starVertices = [];
        const starColors = []; // Añadimos colores para más realismo
        const radius = 600; // Radio muy grande para asegurar que estén lejos
        
        for (let i = 0; i < num_Stars; i++) {
            // Posicionar en una esfera usando distribución uniforme
            const u = Math.random();
            const v = Math.random();
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);
            
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);
            
            starVertices.push(x, y, z);
            
            // Añadir variedad de color a las estrellas
            // Algunas blancas, algunas azuladas, algunas rojizas
            if (Math.random() > 0.9) {
                // Estrellas rojizas (10%)
                starColors.push(1.0, 0.8, 0.8);
            } else if (Math.random() > 0.8) {
                // Estrellas azuladas (10%)
                starColors.push(0.8, 0.8, 1.0);
            } else {
                // Estrellas blancas (80%)
                starColors.push(1.0, 1.0, 1.0);
            }
        }
        
        starGeometry.setAttribute(
            "position", 
            new THREE.Float32BufferAttribute(starVertices, 3)
        );
        
        starGeometry.setAttribute(
            "color", 
            new THREE.Float32BufferAttribute(starColors, 3)
        );
        
        const starMaterial = new THREE.PointsMaterial({
            size: 1.5,
            sizeAttenuation: false, // Las estrellas no cambian de tamaño con la distancia
            vertexColors: true // Usar los colores que definimos
        });
        
        const stars = new THREE.Points(starGeometry, starMaterial);
        scenePlanets.add(stars);
    
}

// Sol
function SunGeometry() {
    const sunGeometry = new THREE.SphereGeometry(4, 19, 19);
    const sunTexture = loadertexture.load('./img/Sun.webp' );  
    sunTexture.mapping = THREE.EquirectangularReflectionMapping;
    const sunMaterial = new THREE.MeshBasicMaterial({
        map: sunTexture,        // Aplicar la textura
        emissive: new THREE.Color(0xFFFF00), // Color de emisión (puedes ajustarlo)
        emissiveIntensity: 1,    // Intensidad de la luz emitida
        toneMapped: false        // Evitar que se haga corrección de tono (si la textura tiene alta intensidad)
    });
    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    sun = sunMesh;
    scenePlanets.add(sunMesh);
}
// Planetas
function PlanetGeometry() {
    planetData.forEach((data) => {

        const planetGroup = new THREE.Group();  

        const geometry = new THREE.SphereGeometry(data.radius, 16, 16);
        const planettexture = loadertexture.load(
            TexturePath + data.name + ".webp"
        );  
        planettexture.mapping = THREE.EquirectangularReflectionMapping;
        const material = new THREE.MeshStandardMaterial({ map: planettexture });
        const planet = new THREE.Mesh(geometry, material);
        planetGroup.add(planet);
        if(font == undefined){
            console.log("Font is undefined");
        }

        const textGeometry = new TextGeometry(data.name, {
            font: font,
            size: TextSize,
            height: TextHeight,
            depth: TextDepth,
        });
        // console.log(textGeometry.text.toString());

        textGeometry.computeBoundingBox();
        const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;

        const textMaterial = new THREE.MeshBasicMaterial({ color: TextColor });
        const text = new THREE.Mesh(textGeometry, textMaterial);
        text.position.set(-textWidth / 2, data.radius + 0.7, 0);
        planetGroup.add(text);


        const angle = Math.random() * Math.PI * 2;
        const initialX = data.distance * Math.cos(angle);
        const initialZ = data.distance * Math.sin(angle);
        planetGroup.position.set(initialX, 0, initialZ);

        planetGroup.userData = {
            distance: data.distance,
            angle: angle,
            speed: data.speed,
            speedrotation: data.speedrotation,
            initialX: initialX,  // Guardamos la posición inicial
            initialZ: initialZ
        };
        planetGroup.name = data.name;
        scenePlanets.add(planetGroup);
        planets.push(planetGroup);
    });

}

function MoonGeometry() {
    moonData.forEach((data) => {
        const parentPlanet = planets.find(p => p.name === data.namePlanet);
        if (!parentPlanet) return; // Si no hay planeta con ese nombre, continuar

        const geometry = new THREE.SphereGeometry(data.radius, 8, 8);
        const moontexture = loadertexture.load(
            TexturePath + data.name + ".webp"
        );  
        const material = new THREE.MeshStandardMaterial({ map: moontexture });
        const moon = new THREE.Mesh(geometry, material);

        moon.name = data.name;
        // Posición inicial relativa al planeta
        const angle = Math.random() * Math.PI * 2;
        moon.position.set(
            parentPlanet.position.x + data.distance * Math.cos(angle),
            0,
            parentPlanet.position.z + data.distance * Math.sin(angle)
        );

        moon.userData = {
            parent: parentPlanet,
            distance: data.distance,
            angle: angle,
            speed: data.speed,
            speedrotation: data.speedrotation,
        };

        scenePlanets.add(moon);
        moons.push(moon);

    });
}

// Animación
function animateScenePlanets() {
    

    if(alreadyplayed){
        alreadyplayed = false;
        rebootScene();
    }

    const dt = clock.getDelta();


    
    //Planet Movement
    planets.forEach((planet) => {
        planet.userData.angle += dt * planet.userData.speed;
        planet.position.x = planet.userData.distance * Math.sin(planet.userData.angle);
        planet.position.z = planet.userData.distance * Math.cos(planet.userData.angle);


        planet.rotation.y -= dt* planet.userData.speedrotation;
    });

    //Moon Movement
    moons.forEach((moon) => {
        moon.userData.angle += dt * moon.userData.speed;
    
        const parent = moon.userData.parent;
        

        moon.position.x = parent.position.x + moon.userData.distance * Math.sin(-moon.userData.angle);
        moon.position.z = parent.position.z + moon.userData.distance * Math.cos(-moon.userData.angle);
        moon.rotation.y += dt * moon.userData.speedrotation;
    });

    



    planets.forEach((planet) => planet.updateMatrixWorld(true));
    cameraPlanets.updateMatrixWorld(true);

    checkedThisFrame = false;
    // Colisiones
    CheckPlanetsCollisions();
    CheckSunCollision();
    CheckMoonCollision();
    


    renderer.render(scenePlanets, cameraPlanets);
}

//Collisions
function CheckPlanetsCollisions() {

    if(checkedThisFrame){
        return;
    }
    checkedThisFrame = true;


    //Check planet collisions
    planets.forEach((planetGroup) => {
        
        const planetWorldPos = new THREE.Vector3();
        planetGroup.getWorldPosition(planetWorldPos);

        const cameraWorldPos = new THREE.Vector3();
        cameraPlanets.getWorldPosition(cameraWorldPos);
        const distance = cameraWorldPos.distanceTo(planetWorldPos);
        const planet = planetGroup.children[0];

        if (distance < planet.geometry.parameters.radius + cameraPlanets.near +.2) {
            LoadArrayPreguntas(planetGroup.name);
            document.exitPointerLock();
            alreadyplayed = true;
            changeScene("sceneCuestions");
        }
    });
}

function CheckSunCollision(){
    const distance = cameraPlanets.position.distanceTo(sun.position);
    if (distance < sun.geometry.parameters.radius + cameraPlanets.near + 0.2) {
        const dt = clock.getDelta();
        camforward = new THREE.Vector3();
        cameraPlanets.getWorldDirection(camforward);
        const newpos = cameraPlanets.position.clone().add(camforward.clone().multiplyScalar(-camspeed));
        cameraPlanets.position.lerp(newpos, dt * camCollisionSensitive);
    }
}

function CheckMoonCollision(){
    moons.forEach((moon) => {
        const moonWorldPos = new THREE.Vector3();
        moon.getWorldPosition(moonWorldPos);

        const cameraWorldPos = new THREE.Vector3();
        cameraPlanets.getWorldPosition(cameraWorldPos);
        const distance = cameraWorldPos.distanceTo(moonWorldPos);

        if (distance < moon.geometry.parameters.radius + cameraPlanets.near +.2) {
            alreadyplayed = true;
            const nuevascene ="scene"+moon.name;
            changeScene(nuevascene);
            document.exitPointerLock();
        }
    });
}

//reboot the escene
function rebootScene(){
    cameraPlanets.position.set(0, 5, 8);
    cameraPlanets.rotation.set(0, 0, 0);
    // resetMovimientoCamara();
}



export { CreateScenePlanets,animateScenePlanets};
