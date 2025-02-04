import * as THREE from "three";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.157.0/examples/jsm/controls/OrbitControls.js";

//Loader
const loadertexture = new THREE.TextureLoader();
var scene, camera, renderer, controls;

var clock;
const planets = [];
const planetData = [
    { radius: 1,distance: 8,speed: 0.0001, color: 0x2194ce, speedrotation: 0.01,},
    { radius: 1.2, distance: 12, speed: 0.00008, color: 0x9b7653, speedrotation: 0.02,},
    { radius: 1.5, distance: 16, speed: 0.00006, color: 0x3d9970, speedrotation: 0.03,},
    { radius: 1.8, distance: 22, speed: 0.00004, color: 0xa5673f, speedrotation: 0.04,},
];

var camforward, camright;
var camspeed = 2;
var forward = 0;
var right = 0;

init();
animate();
function init() {
    //Clock
    clock = new THREE.Clock();

    // Escena
    scene = new THREE.Scene();

    // Cámara
    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        2,
        1000
    );
    camera.position.set(0, 10, 30);

    // Renderizador
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Controles de órbita
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    //Movimento de la cámara
    camforward = new THREE.Vector3();
    camera.getWorldDirection(camforward);
    camright = new THREE.Vector3();
    camright.crossVectors(camera.up, camforward).normalize();


    // Crear geometría
    StarsGeometry();
    SunGeometry();
    PlanetGeometry();
    //Iluminación
    light();
}

// Luz
function light() {
    const light = new THREE.PointLight(0xffffff, 2, 100);
    light.position.set(0, 0, 0);
    scene.add(light);
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
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
    scene.add(stars);
}

// Sol
function SunGeometry() {
    const sunGeometry = new THREE.SphereGeometry(4, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);
}
// Planetas
function PlanetGeometry() {
    planetData.forEach((data) => {
        const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
        const planettexture = loadertexture.load(
            "../images/planets/earthmap10k.jpg"
        );
        const material = new THREE.MeshPhongMaterial({ map: planettexture });
        const planet = new THREE.Mesh(geometry, material);
        planet.userData = {
            distance: data.distance,
            angle: Math.random() * Math.PI * 2,
            speed: data.speed,
            speedrotation: data.speedrotation,
        };
        scene.add(planet);
        planets.push(planet);
    });
}

// Animación
function animate() {
    requestAnimationFrame(animate);

    // Movimiento de los planetas
    planets.forEach((planet) => {
        planet.userData.angle += planet.userData.speed;
        planet.position.x =
            planet.userData.distance * Math.cos(planet.userData.angle);
        planet.position.z =
            planet.userData.distance * Math.sin(planet.userData.angle);
        planet.rotation.y += planet.userData.speedrotation;
    });

    controls.update();
    renderer.render(scene, camera);

    const dt = clock.getDelta();
  
    camera.updateProjectionMatrix();
    
    camera.getWorldDirection(camforward);
    camright.crossVectors(camera.up, camforward).normalize();

    if (forward!=0) {
        camera.position.add(camforward.clone().multiplyScalar(forward * dt *camspeed));
    }
    if (right!=0) {
        camera.position.add(camright.clone().multiplyScalar(right * dt *camspeed));
    }
}




// Redimensionar
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Teclado
window.addEventListener("keydown", (event) => {
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
            right = -1;
            break;
        case "d":
        case "D":
            right = 1;
            break;
    }

});

window.addEventListener("keyup", (event) => {
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

});
