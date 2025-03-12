import * as THREE from "three";
import {CreateScenePlanets, animateScenePlanets }from "./src/SistemaPlanetario.js";
import { CreateSceneCuestions, animateSceneCuestions,addEventsCuestions,removeEventsCuestions }from "./src/Cuestionario.js";
import{CreateSceneLuna,animateSceneLunas} from "./src/Luna.js";
import { CreateScenePhobos,animateScenePhobos } from "./src/Phobos.js";
import { CreateSceneDeimos,animateSceneDeimos } from "./src/Deimos.js";
import {setLunaActiva} from "./src/FucionesComunesLunas.js";

//Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const clock = new THREE.Clock();

//Variable Value
let sceneCuestions, cameraCuestions,scenePlanets,cameraPlanets,sceneLuna,cameraLuna,scenePhobos,cameraPhobos;
let sceneDeimos,cameraDeimos;
[sceneCuestions,cameraCuestions]= CreateSceneCuestions(renderer);
[scenePlanets,cameraPlanets]= CreateScenePlanets(renderer);
[sceneLuna,cameraLuna]= CreateSceneLuna(renderer);
[scenePhobos,cameraPhobos]= CreateScenePhobos(renderer);
[sceneDeimos,cameraDeimos]= CreateSceneDeimos(renderer);



//Active Variables
let scene = scenePlanets;
let camera = cameraPlanets;
let Activeanimate = animateScenePlanets;
let endActiveanimate = null;

// Variables de movimiento de la cámara
let forward = 0;
let right = 0;
let yaw = 0;
let pitch = 0;
let rotsensitivity =0.01;
let camspeed = 4;
let camforward, camright;
let EstoyScenePlanets = true;


initMovimientoCamera();
addEvents();
function changeScene(newScene){
    if(endActiveanimate != null){
        cancelAnimationFrame(endActiveanimate);
    }

    if(scene == sceneCuestions){
        removeEventsCuestions();
    }

    if(newScene == "scenePlanets"){
        scene = scenePlanets;
        camera = cameraPlanets;
        Activeanimate = animateScenePlanets;
    }else if(newScene == "sceneCuestions"){
        scene = sceneCuestions;
        camera = cameraCuestions;
        Activeanimate = animateSceneCuestions;
        addEventsCuestions();
    } else if(newScene == "sceneLuna"){
        scene = sceneLuna;
        camera = cameraLuna;
        setLunaActiva("luna");
        Activeanimate = animateSceneLunas;
    } else if(newScene == "scenePhobos"){
        scene = scenePhobos;
        camera = cameraPhobos;
        setLunaActiva("phobos");
        Activeanimate = animateScenePhobos;
    } else if(newScene == "sceneDeimos"){
        scene = sceneDeimos;    
        camera = cameraDeimos;
        setLunaActiva("deimos");
        Activeanimate = animateSceneDeimos;
    }

    if(newScene == "scenePlanets" && EstoyScenePlanets == false){
        camspeed = 4;
        EstoyScenePlanets = true;
        
    }
    else if(newScene != "scenePlanets" && EstoyScenePlanets == true){
        EstoyScenePlanets = false;
        camspeed = 2;
    }

    if(newScene == "sceneCuestions"){
        removemovementEvents();
    }
    else{
        addmovementEvents();
    }

    

    resetMovimientoCamara();
    
   
   if (Activeanimate) {
    Animate();
   }
}

function Animate(){
    endActiveanimate= requestAnimationFrame(Animate);
    if (Activeanimate) {
        MoverCamara();
        Activeanimate();
    }
}

function initMovimientoCamera(){
    camforward = new THREE.Vector3();
    cameraPlanets.getWorldDirection(camforward);
    camright = new THREE.Vector3();
    camright.crossVectors(cameraPlanets.up, camforward).normalize();
}

function MoverCamara(){

    const dt = clock.getDelta();

    camera.updateProjectionMatrix();
    
    // camera.getWorldDirection(camforward);
    camright.crossVectors(camera.up, camforward).normalize();

    if(!EstoyScenePlanets){
        camforward.y = 0;
        camright.y = 0;
        camforward.normalize();
        camright.normalize();
    }

    if (forward!=0) {
        camera.position.add(camforward.clone().multiplyScalar(forward * dt *camspeed));
    }
    if (right!=0) {
        camera.position.add(camright.clone().multiplyScalar(right * dt *camspeed));
    }

    camera.updateMatrixWorld(true);
}


function resetMovimientoCamara(){
    forward = 0;
    right = 0;
    yaw = 0;
    pitch = 0;
}

//Eventos
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

}


function onkeyup(event) {
    const key = event.key;

    switch (key) {
        case "w":
        case "W":
        case "s":
        case "S":
            forward = 0;
            break;
        case "a":
        case "A":
        case "d":
        case "D":
            right = 0;
            break;
    }
}

function resize(event){
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
};

function onClick(event) {
    if(document.pointerLockElement !== document.body)
        document.body.requestPointerLock();
};

function onPointerLockChange() {
    if (document.pointerLockElement === document.body) {
        document.addEventListener("mousemove", onMouseMove, false);
    } else {
        document.removeEventListener("mousemove", onMouseMove, false);
    }

    resetMovimientoCamara();
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
    camera.quaternion.copy(quaternionYaw);
    camera.quaternion.multiply(quaternionPitch);
};


function addEvents(){
    window.addEventListener("resize", resize);
    window.addEventListener("keydown", onkeydown);
    window.addEventListener("keyup", onkeyup);
    window.addEventListener("click", onClick);
    document.addEventListener("pointerlockchange", onPointerLockChange);

}


function removemovementEvents(){
    window.removeEventListener("keydown", onkeydown);
    window.removeEventListener("keyup", onkeyup);
    window.removeEventListener("click", onClick);
    document.exitPointerLock();
}

function addmovementEvents(){
    window.addEventListener("keydown", onkeydown);
    window.addEventListener("keyup", onkeyup);
    window.addEventListener("click", onClick);
}

Animate();


export{changeScene,removemovementEvents,resetMovimientoCamara,addmovementEvents};