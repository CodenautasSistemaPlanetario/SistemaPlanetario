import * as THREE from 'three';
import {changeScene} from "../Controlador.js";
import { FontLoader } from 'https://unpkg.com/three@latest/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://unpkg.com/three@latest/examples/jsm/geometries/TextGeometry.js';


const path = "./img/Stars/";
const TextureCubeLoader = new THREE.CubeTextureLoader();
const TextureLoader = new THREE.TextureLoader();
const Fontloader = new FontLoader();
const FontName = './font/Roboto_Regular.json';
const Land_texture = TextureLoader.load("./img/3153.jpg");

const ZonasJugables = [];
const dist_colision_zonas = 1;
const Zona1 = new THREE.Group();
const Zona2 = new THREE.Group();
const Zona3 = new THREE.Group();
const Zona4 = new THREE.Group();   
const Zone_box_color = 0xff0000;


//Parametros Secuencia (Zona 1)
const Secuencia = "ABCBCACABABC";
const Posibles_secuencia = ['A','B','C'];
const Correct_answer = 1;
var Can_click = true;
var buttons = [];
var Text_incorrecto;
var Text_correcto;
var Jugada_Zona1 = false;
const Text_color = 0xffffff;
const Background_color = 0x92c5fc;
const Text_size = 0.5;
const Text_height = 0.1;
const Text_depth = 0.1;
let User_input = "";
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
var backgroundtexture;





var clock;

var sceneLuna,cameraLuna, renderer;


var cameraspeed = 2;
var forward = 0;
var right = 0;
var camforward, camright;
var rotsensitivity = 0.001;
let yaw=0;
let pitch=0;

var jugando = false;
var collision = false;


function CreateSceneLuna(globalrenderer)
{
    sceneLuna = new THREE.Scene();
    cameraLuna = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    globalrenderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(globalrenderer.domElement);
    renderer = globalrenderer;


    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, -5).normalize();
    sceneLuna.add(light);
    const lightsecondary = new THREE.DirectionalLight(0xffffff, 0.5);
    lightsecondary.position.set(-5, 10, 5).normalize();
    sceneLuna.add(lightsecondary);
  
    // Suelo Principal
    const groundGeometry = new THREE.PlaneGeometry(120, 120);
    const textureground = Land_texture;
    const groundMaterial = new THREE.MeshStandardMaterial({ map: textureground });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2; // Lo rotamos para que esté plano
    console.log(ground.position);
    sceneLuna.add(ground);




    // Cámara
    cameraLuna.position.set(0, 2, 0);

    clock = new THREE.Clock();
    camforward = new THREE.Vector3();
    camright = new THREE.Vector3();

    CrearSkysphere();
    CrearZonas();
    CreaZona1();


    return [sceneLuna, cameraLuna];
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

        sceneLuna.background = texture;
}

function CrearZonas(){
    Zona1.position.set(20,0,0);//Derecha
    Zona2.position.set(-20,0,0);//Izquierda
    Zona3.position.set(0,0,20);//Delante
    Zona4.position.set(0,0,-20);//Atrás
    ZonasJugables.push(Zona1.position);
    ZonasJugables.push(Zona2.position);
    ZonasJugables.push(Zona3.position);
    ZonasJugables.push(Zona4.position);

    ZonasJugables.forEach(zona => {
        const geometry = new THREE.BoxGeometry(1, 0.1, 1);
        const material = new THREE.MeshBasicMaterial({ color: Zone_box_color });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(zona.x, 0, zona.z);
        sceneLuna.add(cube);
    });

}

function animateSceneLunas() {
    

    const dt = clock.getDelta();

    
    cameraLuna.updateProjectionMatrix();
    
    cameraLuna.getWorldDirection(camforward);
    camright.crossVectors(cameraLuna.up, camforward).normalize();

    if (forward!=0) {
        camforward.y = 0;
        camforward.normalize();
        cameraLuna.position.add(camforward.clone().multiplyScalar(forward * dt *cameraspeed));
    }
    if (right!=0) {
        camright.y = 0;
        camright.normalize();
        cameraLuna.position.add(camright.clone().multiplyScalar(right * dt *cameraspeed));
    }

    CheckZonas();
    CheckBordes();
    

    renderer.render(sceneLuna, cameraLuna);
}

//Funciones

function CheckBordes(){
    if(cameraLuna.position.x >= 30){
        cameraLuna.position.x = 19.9;
    }
    if(cameraLuna.position.x <= -30){
        cameraLuna.position.x = -19.9;
    }
    if(cameraLuna.position.z >= 30){
        cameraLuna.position.z = 19.9;
    }
    if(cameraLuna.position.z <= -30){
        cameraLuna.position.z = -19.9;
    }
}


function CheckZonas(){
    if(!collision){
        ZonasJugables.forEach((zona,index) => {
            const pos_zona_elevada = new THREE.Vector3(zona.x, cameraLuna.position.y, zona.z);
            const distance = cameraLuna.position.distanceTo(pos_zona_elevada);
    
            if(distance <= dist_colision_zonas){
                CargarZonas(index);
            }
        });
    }

}

function CargarZonas(index){
    console.log("Zona uno jugada: "+Jugada_Zona1);

    switch(index){
        case 0:
            if(Jugada_Zona1){
                return;
            }
            CargarZona1();
            break;
       case 1:
            CargarZona2();
            break;
        case 2:
            CargarZona3();
            break;
        case 3:
            CargarZona4();
            break;
        default:
            return;

    }
    jugando = true;

    if(jugando){
        collision = true;
        removemovementEvents();
        forward = 0;
        right = 0;
        yaw = 0;
        pitch = 0;
        addZoneListeners(index);
    }
}

//Zona 1
function CreaZona1(){

    canvas.width = 1024;
    canvas.height = 512;

    ctx.fillStyle = Background_color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = Text_color;
    ctx.font = "50px Arial";
    ctx.fillText("🛰 Reto 1: Código de las Constelaciones ⭐", 256, 100);
    ctx.font = "30px Arial";
    ctx.fillText("🔍 Desafío:Los astronautas descubren una pantalla con números que representan las estrellas de una constelación, pero hay un número que falta.", 256, 300);
    ctx.fillText("📝 Código en pantalla: 3 - 6 - 9 - ? - 15", 256, 350);

    const backgroundGeometry = new THREE.PlaneGeometry(10, 5);
    backgroundtexture = new THREE.CanvasTexture(canvas);
    const backgroundMaterial =  new THREE.MeshBasicMaterial({ map: backgroundtexture,
        opacity: 0.5,
     });
    
    const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
    backgroundMesh.position.set(0, 2, -4);
    const edges = new THREE.EdgesGeometry(backgroundGeometry);
    const edgeMaterial = new THREE.LineBasicMaterial({ 
        color: 0xffffff, // Blanco para el borde brillante
        linewidth: 4,
        linecap: 'round', // Redondear los extremos de la línea
        linejoin: 'round' // Redondear las esquinas de la línea
    });
    const border = new THREE.LineSegments(edges, edgeMaterial);
    border.position.set(0, 2, -4);
    Zona1.add(backgroundMesh);
    Zona1.add(border);

    //Secuencia de texto
    Fontloader.load(FontName, function (font) {
        let textGeometry = new TextGeometry(Secuencia, {
            font: font,
            size: Text_size,
            height: Text_height,
            depth: Text_depth
        });

        let textMaterial = new THREE.MeshBasicMaterial({ color: Text_color });
        let textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textGeometry.computeBoundingBox();

        // Obtener las coordenadas del bounding box
        const boundingBox = textGeometry.boundingBox;
        const width = boundingBox.max.x - boundingBox.min.x;
        textMesh.position.set(-width / 2, 2.75, -4);
        Zona1.add(textMesh);
    });

    // //Botones
    // Posibles_secuencia.forEach((posible, index) => {
    //     Fontloader.load(FontName, function (font) {
    //         let buttonGeometry = new TextGeometry(posible, {
    //             font: font,
    //             size: Text_size - 0.1,
    //             height: Text_height,
    //             depth: Text_depth
    //         });

    //         let buttonMaterial = new THREE.MeshBasicMaterial({ color: Text_color });
    //         let buttonMesh = new THREE.Mesh(buttonGeometry, buttonMaterial);
    //         buttonMesh.position.set(0 - 1 + (1 * index), 1.25, -4);
    //         buttonMesh.userData = { indice: index }; // Guardar letra en datos
    //         Zona1.add(buttonMesh);
    //         buttons.push(buttonMesh);
    //     });
    // });

    //Texto incorrecto
    Fontloader.load(FontName, function (font) {
        let textGeometry = new TextGeometry("Incorrecto", {
            font: font,
            size: Text_size - 0.3,
            height: Text_height,
            depth: Text_depth
        });
        let textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        Text_incorrecto = new THREE.Mesh(textGeometry, textMaterial);
        textGeometry.computeBoundingBox();
        const boundingBox = textGeometry.boundingBox;
        const width = boundingBox.max.x - boundingBox.min.x;
        Text_incorrecto.position.set(-width / 2, 2, -4);
        Text_incorrecto.visible = false;
        Zona1.add(Text_incorrecto);
    });

    //Texto correcto
    Fontloader.load(FontName, function (font) {
        let textGeometry = new TextGeometry("Correcto", {
            font: font,
            size: Text_size - 0.3,
            height: Text_height,
            depth: Text_depth
        });
        let textMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        Text_correcto = new THREE.Mesh(textGeometry, textMaterial);
        textGeometry.computeBoundingBox();
        const boundingBox = textGeometry.boundingBox;
        const width = boundingBox.max.x - boundingBox.min.x;
        Text_correcto.position.set(-width / 2, 2, -4);
        Text_correcto.visible = false;
        Zona1.add(Text_correcto);
    });

    Zona1.visible = false;
    sceneLuna.add(Zona1);
}

function CargarZona1(){
    Zona1.visible = true;
    const pos_global = new THREE.Vector3();
    Zona1.children[0].getWorldPosition(pos_global);
    cameraLuna.position.set(Zona1.position.x, 2, Zona1.position.z);
    console.log(cameraLuna.position);
    cameraLuna.lookAt(pos_global);
    
}


function checkAnswer(letter) {
    
    if (letter === Correct_answer) {
        Text_correcto.visible = true;
        Can_click = false; // Bloquear clics temporalmente
        setTimeout(() => {
            Can_click = true; // Reactivar clics después de 2 segundos
            Text_correcto.visible = false;
            AcabadoZona1();
        }, 2000);
    } else {
        Can_click = false; // Bloquear clics temporalmente
        Text_incorrecto.visible = true;
        setTimeout(() => {
            Can_click = true; // Reactivar clics después de 2 segundos
            Text_incorrecto.visible = false;
        }, 2000);
    }
}

function AcabadoZona1(){
    window.removeEventListener("click", click);
    window.removeEventListener("keydown", escribirCanvas);
    addEventsLuna();
    Jugada_Zona1 = true;
    console.log("Zona 1 Completada");
    console.log(Jugada_Zona1);
    
    setTimeout(() => {
        collision = false;
    }, 5000);
}

function CargarZona2(){
    console.log("Cargando Zona 2");
}

function CargarZona3(){
    console.log("Cargando Zona 3");
}

function CargarZona4(){
    console.log("Cargando Zona 4");
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
}

function resize(event){
    renderer.setSize(window.innerWidth, window.innerHeight);
    cameraLuna.aspect = window.innerWidth / window.innerHeight;
    cameraLuna.updateProjectionMatrix();
};

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
    cameraLuna.quaternion.copy(quaternionYaw);
    cameraLuna.quaternion.multiply(quaternionPitch);
};

function click(event){
    if(!Can_click){
        return;
    }

    let mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    );

    let raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraLuna);
    let intersects = raycaster.intersectObjects(buttons);

    if (intersects.length > 0) {
        let selectedButton = intersects[0].object;
        checkAnswer(selectedButton.userData.indice);
    }
}

function escribirCanvas(event) {
    if (event.key === "Backspace") {
        User_input = userInput.slice(0, -1);
    } else if (event.key.length === 1) {
        User_input += event.key;
    }

    // Actualizar el canvas con el nuevo texto
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillText(User_input, 256, 600);
    
    backgroundtexture.needsUpdate = true;
}

function addEventsLuna(){
    window.addEventListener("resize", resize);
    window.addEventListener("keydown", onkeydown);
    window.addEventListener("keyup", onkeyup);
    window.addEventListener("click", onClick);
    document.addEventListener("pointerlockchange", onPointerLockChange);

}


function removeEventsLuna(){
    window.removeEventListener("resize", resize);
    window.removeEventListener("keydown", onkeydown);
    window.removeEventListener("keyup", onkeyup);
    
    document.removeEventListener("pointerlockchange", onPointerLockChange);
}

function removemovementEvents(){
    window.removeEventListener("keydown", onkeydown);
    window.removeEventListener("keyup", onkeyup);
    window.removeEventListener("click", onClick);
    document.exitPointerLock();
}

function addZoneListeners(index){
    switch(index){
        case 0:
            window.addEventListener("click", click);
            window.addEventListener("keydown", escribirCanvas);
            break;
        case 1:
            break;
        case 2:
            break;
        case 3:
            break;
        default:
            return;
    }
}

export { CreateSceneLuna, animateSceneLunas, addEventsLuna, removeEventsLuna };


