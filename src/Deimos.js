import * as THREE from 'three';
import {changeScene} from "../Controlador.js";
import { FontLoader } from 'https://unpkg.com/three@latest/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://unpkg.com/three@latest/examples/jsm/geometries/TextGeometry.js';

//Texturas
const path = "./img/Stars/";
const TextureCubeLoader = new THREE.CubeTextureLoader();
const TextureLoader = new THREE.TextureLoader();
const Fontloader = new FontLoader();
const FontName = './font/Roboto_Regular.json';
const Groundpath = "./img/Luna/Gravel009_1K-JPG_";
const Land_texture_albedo = TextureLoader.load(Groundpath + "Color.jpg");
const Land_texture_normal = TextureLoader.load(Groundpath + "Normal.jpg");
const Land_texture_roughness = TextureLoader.load(Groundpath + "Roughness.jpg");
const Land_texture_ao = TextureLoader.load(Groundpath + "AmbientOcclusion.jpg");
const Land_texture_height = TextureLoader.load(Groundpath + "Displacement.jpg");

//Variables
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

var clock;

var scenePhobos,cameraPhobos, renderer;


var cameraspeed = 2;
var forward = 0;
var right = 0;
var camforward, camright;
var rotsensitivity = 0.0005;
let yaw=0;
let pitch=0;

var empieza_moverse = false;
var collision = false;

var ya_jugado = false;

//Parametros Zonas
const ZonasJugables = [];

const Zona0 = new THREE.Group();
const Zona1 = new THREE.Group();
const Zona2 = new THREE.Group();
const Zona3 = new THREE.Group();
const Zona4 = new THREE.Group();
const Zona5 = new THREE.Group();

const Zone_box_color = 0xff0000;
const dist_colision_zonas = 1.5;
const Text_color =" #ffffff";
const Background_color =" #92c5fc";

function CreateSceneDeimos(globalrenderer)
{
    sceneDeimos = new THREE.Scene();
    cameraDeimos = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    globalrenderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(globalrenderer.domElement);
    renderer = globalrenderer;


    const light = new THREE.DirectionalLight(0xffffff, 0.7);
    light.position.set(0, 10, 0).normalize();
    sceneDeimos.add(light);
    const lightsecondary = new THREE.DirectionalLight(0xffffff, 0.3);
    lightsecondary.position.set(-5, 10, 5).normalize();
    sceneDeimos.add(lightsecondary);
  
    // Suelo Principal
    const groundGeometry = new THREE.PlaneGeometry(120, 120, 256, 256); // Más subdivisiones
    if (!groundGeometry.attributes.uv2) {
        groundGeometry.setAttribute('uv2', new THREE.BufferAttribute(groundGeometry.attributes.uv.array, 2));
    }

    const groundMaterial = new THREE.MeshStandardMaterial({ 
        map: Land_texture_albedo,
        normalMap: Land_texture_normal,
        roughnessMap: Land_texture_roughness,
        aoMap: Land_texture_ao,
        displacementMap: Land_texture_height,
        displacementScale: 0.05 ,
        side: THREE.DoubleSide
    });
    
    
    // // Ajustar repetición de texturas
    const repeatValue = 10;
    [Land_texture_albedo, Land_texture_normal, Land_texture_roughness, Land_texture_ao, Land_texture_height].forEach(texture => {
        if (texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(repeatValue, repeatValue);
        }
    });
    
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    sceneDeimos.add(ground);
    

    // Volver 
    const geometry = new THREE.BoxGeometry(1, 0.1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0, 0);
    sceneDeimos.add(cube);



    // Cámara
    cameraDeimos.position.set(0, 2, 0);

    clock = new THREE.Clock();
    camforward = new THREE.Vector3();
    camright = new THREE.Vector3();

    CrearSkysphere();
    CrearZonas();
    


    return [sceneDeimos, cameraDeimos];
}

//Geometria

function CrearSkysphere(){  
    TextureCubeLoader.setPath(path);
    const texture = TextureCubeLoader.load([
        'px.jpg', // Positivo en X (derecha)
        'nx.jpg', // Negativo en X (izquierda)
        'py.jpg', // Positivo en Y (arriba)
        'ny.jpg', // Negativo en Y (abajo)
        'pz.jpg', // Positivo en Z (frente)
        'nz.jpg'  // Negativo en Z (atrás)
    ]);

        sceneDeimos.background = texture;
}

function CrearZonas(){
    CrearZona0();   
    Zona1.position.set(20,0,0);//Derecha
    Zona2.position.set(6.18,0,19.02);//Izquierda
    Zona3.position.set(-16.18,0,11.76);//Delante
    Zona4.position.set(-16.18,0,-11.76);//Atrás
    Zona5.position.set(6.18,0,-19.02);//Atrás
    ZonasJugables.push(Zona1.position);
    ZonasJugables.push(Zona2.position);
    ZonasJugables.push(Zona3.position);
    ZonasJugables.push(Zona4.position);
    ZonasJugables.push(Zona5.position);

    ZonasJugables.forEach(zona => {
        const geometry = new THREE.BoxGeometry(1, 0.1, 1);
        const material = new THREE.MeshBasicMaterial({ color: Zone_box_color });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(zona.x, 0, zona.z);
        sceneDeimos.add(cube);
    });

}

function animateSceneDeimos() {
    
    if(ya_jugado){
        reiniciar();
        ya_jugado = false;
    }


    const dt = clock.getDelta();

    
    cameraDeimos.updateProjectionMatrix();
    
    cameraDeimos.getWorldDirection(camforward);
    camright.crossVectors(cameraDeimos.up, camforward).normalize();

    if (forward!=0) {
        camforward.y = 0;
        camforward.normalize();
        cameraDeimos.position.add(camforward.clone().multiplyScalar(forward * dt *cameraspeed));
    }
    if (right!=0) {
        camright.y = 0;
        camright.normalize();
        cameraDeimos.position.add(camright.clone().multiplyScalar(right * dt *cameraspeed));
    }

    CheckVuelta();
    CheckLlegadaZonas();
    CheckBordes();
    

    renderer.render(sceneDeimos, cameraDeimos);
}

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

function resize(event){
    renderer.setSize(window.innerWidth, window.innerHeight);
    cameraDeimos.aspect = window.innerWidth / window.innerHeight;
    cameraDeimos.updateProjectionMatrix();
};

function onClick(event) {
    document.body.requestPointerLock();
};

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
    
    yaw -= dx * rotsensitivity;
    pitch -= dy * rotsensitivity;

    pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));

    const quaternionYaw = new THREE.Quaternion();
    quaternionYaw.setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw);

    const quaternionPitch = new THREE.Quaternion();
    quaternionPitch.setFromAxisAngle(new THREE.Vector3(1, 0, 0), pitch);

    cameraDeimos.quaternion.copy(quaternionYaw);
    cameraDeimos.quaternion.multiply(quaternionPitch);
};

function addEventsDeimos(){
    
}

function removeEventDeimos(){
    window.removeEventListener("resize", resize);
    window.removeEventListener("keydown", onkeydown);
    window.removeEventListener("keyup", onkeyup);
    
    document.removeEventListener("pointerlockchange", onPointerLockChange);
}

export{CreateSceneDeimos, animateSceneDeimos, addEventsDeimos, removeEventDeimos};