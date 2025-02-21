import * as THREE from 'three';
import {changeScene} from "../Controlador.js";
import { FontLoader } from 'https://unpkg.com/three@latest/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://unpkg.com/three@latest/examples/jsm/geometries/TextGeometry.js';

//Texturas
const Starspath = "./img/Stars/";
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

//Parametros elección dificultad (Zona 0)
const Opciones = ["Fácil", "Difícil"];
const Button_Color= 0x0000ff;
const FontSizeOpciones = 0.5;
const FontHeightOpciones = 0.1;
const FontDepthOpciones = 0.01;
const FontColorOpciones = 0xffffff;
const Texto_Zona0 = "Elige la dificultad del reto:";
var Difficultad;
var Index_zona;

//Parametros Laberinto de Meteoritos (Zona 1)
const canvas_Zona1 = document.createElement('canvas');
const ctx_Zona1 = canvas_Zona1.getContext('2d');
let Lineas_Zona1 = [
    "🔍 Desafío: Ayuda al astronauta a esquivar los meteoritos y llegar a la zona segura. Muevete con WASD y llega a la zona verde para salir"
];

const Meteoritos = [
    { x: 100, y: 50, w: 50, h: 50, speed: 1.2, direction: 1 },
    { x: 200, y: 150, w: 50, h: 50, speed: 0.8, direction: -1 },
    { x: 300, y: 100, w: 50, h: 50, speed: 1.3, direction: 1 },
    { x: 400, y: 151, w: 50, h: 50, speed: 0.9, direction: -1 },
    { x: 500, y: 180, w: 50, h: 50, speed: 1.4, direction: 1 },
    { x: 600, y: 90, w: 50, h: 50, speed: 0.7, direction: -1 },
    { x: 700, y: 155, w: 50, h: 50, speed: 1.1, direction: 1 },
    { x: 800, y: 90, w: 50, h: 50, speed: 0.6, direction: -1 },
    { x: 900, y: 160, w: 50, h: 50, speed: 1.5, direction: 1 },
    { x: 900, y: 40, w: 50, h: 50, speed: 0.5, direction: -1 }
];
const MeteoritosColor = "#828282";
let nave = { x: 512, y: 430, size: 20 ,color: "#ff0000", speed: 5};
var gameActive_Zona1 = false;
var LastY_Zona1 = 0;
var backgroundtexture_Zona1;
const meteoritos_length = [Meteoritos.length/2, Meteoritos.length];


function CreateScenePhobos(globalrenderer)
{
    scenePhobos = new THREE.Scene();
    cameraPhobos = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    globalrenderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(globalrenderer.domElement);
    renderer = globalrenderer;


    const light = new THREE.DirectionalLight(0xffffff, 0.7);
    light.position.set(0, 10, 0).normalize();
    scenePhobos.add(light);
    const lightsecondary = new THREE.DirectionalLight(0xffffff, 0.3);
    lightsecondary.position.set(-5, 10, 5).normalize();
    scenePhobos.add(lightsecondary);
  
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
    scenePhobos.add(ground);
    

    // Volver 
    const geometry = new THREE.BoxGeometry(1, 0.1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0, 0);
    scenePhobos.add(cube);



    // Cámara
    cameraPhobos.position.set(0, 2, 0);

    clock = new THREE.Clock();
    camforward = new THREE.Vector3();
    camright = new THREE.Vector3();

    CrearSkysphere();
    CrearZonas();
    


    return [scenePhobos, cameraPhobos];
}



function CrearSkysphere(){  
    TextureCubeLoader.setPath(Starspath);
    const texture = TextureCubeLoader.load([
        'px.jpg', // Positivo en X (derecha)
        'nx.jpg', // Negativo en X (izquierda)
        'py.jpg', // Positivo en Y (arriba)
        'ny.jpg', // Negativo en Y (abajo)
        'pz.jpg', // Positivo en Z (frente)
        'nz.jpg'  // Negativo en Z (atrás)
    ]);

    scenePhobos.background = texture;
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
        scenePhobos.add(cube);
    });

}

function reiniciar(){
    cameraPhobos.position.set(0, 2, 0);
    cameraPhobos.rotation.set(0, 0, 0);

    empieza_moverse = false;
    collision = false;

    Zona0.visible = false;
    Zona1.visible = false;
    Zona2.visible = false;
    Zona3.visible = false;
    Zona4.visible = false;
    Zona5.visible = false;

    yaw = 0;
    pitch = 0;
    forward = 0;
    right = 0;

}



function animateScenePhobos() {
    
    if(ya_jugado){
        reiniciar();
        ya_jugado = false;
    }


    const dt = clock.getDelta();

    
    cameraPhobos.updateProjectionMatrix();
    
    cameraPhobos.getWorldDirection(camforward);
    camright.crossVectors(cameraPhobos.up, camforward).normalize();

    if (forward!=0) {
        camforward.y = 0;
        camforward.normalize();
        cameraPhobos.position.add(camforward.clone().multiplyScalar(forward * dt *cameraspeed));
    }
    if (right!=0) {
        camright.y = 0;
        camright.normalize();
        cameraPhobos.position.add(camright.clone().multiplyScalar(right * dt *cameraspeed));
    }

    CheckVuelta();
    CheckLlegadaZonas();
    CheckBordes();

    if(gameActive_Zona1){
        updateMeteoritos();
        ColisionMeteoritos();
        updateCollisionMeteoritos();
        LlegadaNaveZona1();
        DibujarJuegoZona1();
    }
    

    renderer.render(scenePhobos, cameraPhobos);
}



function CheckVuelta(){
    const pos_zona_elevada = new THREE.Vector3(0, cameraPhobos.position.y, 0);
    const distance = cameraPhobos.position.distanceTo(pos_zona_elevada);

    if(!empieza_moverse && distance >= 1.3){
        empieza_moverse = true;
    } else if(empieza_moverse && distance <= 1){
        ya_jugado = true;
        changeScene("scenePlanets");
        empieza_moverse = false;
    }
}

function CheckBordes(){
    if(cameraPhobos.position.x >= 30){
        cameraPhobos.position.x = 19.9;
    }
    if(cameraPhobos.position.x <= -30){
        cameraPhobos.position.x = -19.9;
    }
    if(cameraPhobos.position.z >= 30){
        cameraPhobos.position.z = 19.9;
    }
    if(cameraPhobos.position.z <= -30){
        cameraPhobos.position.z = -19.9;
    }
}

function CheckLlegadaZonas(){
    if(!collision){
        ZonasJugables.forEach((zona,index) => {
            const pos_zona_elevada = new THREE.Vector3(zona.x, cameraPhobos.position.y, zona.z);
            const distance = cameraPhobos.position.distanceTo(pos_zona_elevada);
    
            if(distance <= dist_colision_zonas){
                CargarZona0(index);
            }
        });
    }

}



function CargarZona0(index){
    var position = Zona0.position;
    Index_zona = index;
    switch(index){
        case 0:
            position = Zona1.position;
            break;
       case 1:
            position = Zona2.position;
            break;
        case 2:
            position = Zona3.position;
            break;
        case 3:
            position = Zona4.position;
            break;
        case 4:
            position = Zona5.position;
            break;
        default:
            return;

    }
    Zona0.position.set(position.x, position.y, position.z);
    Zona0.visible = true;
    const pos_global = new THREE.Vector3();
    Zona0.children[0].getWorldPosition(pos_global);
    
    cameraPhobos.position.set(Zona0.position.x, 2, Zona0.position.z);
    cameraPhobos.lookAt(pos_global);

    collision = true;
    removemovementEvents();
    forward = 0;
    right = 0;
    yaw = 0;
    pitch = 0;
    window.addEventListener("click", onClickOpciones);
}

function CrearZona0() {
    // Plano Background
    const geometry = new THREE.PlaneGeometry(10, 5);
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x000000, 
        opacity: 0.5, 
        transparent: true, 
        side: THREE.DoubleSide  // Permite ver el plano desde ambos lados
    });
    const background = new THREE.Mesh(geometry, material);
    background.position.set(0, 2, -4);
    Zona0.add(background);

    // Texto principal
    Fontloader.load(FontName, function (font) {
        const textGeometry = new TextGeometry(Texto_Zona0, {
            font: font,
            size: FontSizeOpciones,
            height: FontHeightOpciones,
            depth: FontDepthOpciones
        });

        textGeometry.computeBoundingBox();
        textGeometry.center();

        const textMaterial = new THREE.MeshBasicMaterial({ color: FontColorOpciones });

        var textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(0, 2, -4);

        Zona0.add(textMesh);
    });

    // Botones
    Opciones.forEach((option, index) => {
        const geometry = new THREE.BoxGeometry(3, 1, 0.1);
        const material = new THREE.MeshBasicMaterial({ 
            color: Button_Color, 
            side: THREE.DoubleSide  // Asegura que las caras sean visibles desde ambos lados
        });
        const button = new THREE.Mesh(geometry, material);

        button.position.set(-3 + (6 * index), 1, -4);
        button.userData = { index };
        Zona0.add(button);

        // Texto dentro del botón
        Fontloader.load(FontName, function (font) {
            const textGeometry = new TextGeometry(option, {
                font: font,
                size: FontSizeOpciones * 0.5, 
                height: FontHeightOpciones * 0.5,
                depth: FontDepthOpciones
            });

            textGeometry.computeBoundingBox();
            textGeometry.center();

            const textMaterial = new THREE.MeshBasicMaterial({ color: FontColorOpciones });
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);

            textMesh.position.set(button.position.x, button.position.y, button.position.z + 0.06); // Mover texto hacia adelante
            Zona0.add(textMesh);
        });
    });

    Zona0.visible = false;
    scenePhobos.add(Zona0);
}

function DividirLineas(ctx, text, x, y, width, height) {
    const words = text.split(" ");
    let line = "";
    let lines = 0;
    for (let word of words) {
        const testLine = line + word + " ";
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > width && line !== "") {
            ctx.fillText(line, x, y + (lines * height));
            line = word + " ";
            lines++;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, y + (lines * height));
    return (lines + 1) * height;
}

function CargarZonas(index){
    // Zona0.visible = false;
    switch(index){
        case 0:
            CreaZona1();
            window.addEventListener("keydown", NaveMoverse);
            break;
        case 1:
            Zona2.visible = true;
            break;
        case 2:
            Zona3.visible = true;
            break;
        case 3:
            Zona4.visible = true;
            break;
        case 4:
            Zona5.visible = true;
            break;
        default:
            return;
    }

    forward = 0;
    right = 0;
    yaw = 0;
    pitch = 0;
    
    window.removeEventListener("click", onClickOpciones);
    
}

//Zona 1
function CreaZona1() {
    for (let i = Zona1.children.length - 1; i >= 0; i--) {
        let obj = Zona1.children[i];
        if (obj.isMesh) {
            Zona1.remove(obj);
            obj.geometry.dispose();
            obj.material.dispose();
        }
    }

    canvas_Zona1.width = 1024;
    canvas_Zona1.height = 512;
    ctx_Zona1.fillStyle = Background_color;
    ctx_Zona1.fillRect(0, 0, canvas_Zona1.width, canvas_Zona1.height);
    ctx_Zona1.fillStyle = Text_color;
    ctx_Zona1.font = "50px Arial";
    ctx_Zona1.fillText("🛰 Reto 1: Laberinto de Meteoritos ☄️", 10, 50);

    ctx_Zona1.font = "30px Arial";
    let startY = 100;
    let Height = 35;
    for (let linea of Lineas_Zona1) {
        startY += DividirLineas(ctx_Zona1, linea, 10, startY, canvas_Zona1.width - 20, Height);
    }
    LastY_Zona1 = startY - Height + 10;

    backgroundtexture_Zona1 = new THREE.CanvasTexture(canvas_Zona1);

    const backgroundGeometry = new THREE.PlaneGeometry(10, 5);
    const backgroundMaterial = new THREE.MeshBasicMaterial({
        map: backgroundtexture_Zona1,
        opacity: 0.8,
        transparent: true
    });

    const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
    backgroundMesh.position.set(0, 2, -4);

    Zona1.add(backgroundMesh);

    DibujarJuegoZona1();

    gameActive_Zona1 = true;

    Zona1.visible = true;
    const pos_global = new THREE.Vector3();
    Zona1.children[0].getWorldPosition(pos_global);
    cameraPhobos.lookAt(pos_global);
    scenePhobos.add(Zona1);
}

function DibujarJuegoZona1(){
    ctx_Zona1.fillStyle = Background_color;
    ctx_Zona1.fillRect(0, LastY_Zona1, canvas_Zona1.width, canvas_Zona1.height);
    ctx_Zona1.fillStyle = "#00ff00";
    ctx_Zona1.fillRect(0, LastY_Zona1, canvas_Zona1.width, 20);

    ctx_Zona1.fillStyle = MeteoritosColor;
    for(let i =0; i < meteoritos_length[Difficultad]; i++){
        ctx_Zona1.fillRect(Meteoritos[i].x, Meteoritos[i].y+LastY_Zona1, Meteoritos[i].w, Meteoritos[i].h);
    }

    ctx_Zona1.fillStyle = nave.color;
    ctx_Zona1.fillRect(nave.x, nave.y, nave.size, nave.size);

    backgroundtexture_Zona1.needsUpdate = true;
}

function resetZona1() {
    nave.x = 512;
    nave.y = 430;
}

function updateMeteoritos() {
    Meteoritos.forEach(m => {
        m.x += m.speed * m.direction;
        if (m.x <= 50 || m.x >= 1000) { // Límite del movimiento
            m.direction *= -1; // Cambia de dirección
        }
    });
    
}

function ColisionMeteoritos() {
    for(let i =0; i < meteoritos_length[Difficultad]; i++){
        let meteoritocenterX = Meteoritos[i].x + Meteoritos[i].w / 2;
        let meteoritocenterY = Meteoritos[i].y+LastY_Zona1 + Meteoritos[i].h / 2;
        let navecenterX = nave.x + nave.size / 2;
        let navecenterY = nave.y + nave.size / 2;

        let dx = meteoritocenterX - navecenterX;
        let dy = meteoritocenterY - navecenterY;
        let distance = Math.sqrt(dx * dx + dy * dy);


        if (distance < Meteoritos[i].w / 2 + nave.size / 2) {
            resetZona1();
        }
    }
}

function updateCollisionMeteoritos() {
    for (let i = 0; i < meteoritos_length[Difficultad]; i++) {
        for (let j = i + 1; j < meteoritos_length[Difficultad]; j++) { // No repetir pares
            let m1 = Meteoritos[i];
            let m2 = Meteoritos[j];

            // Calcular la distancia en X
            let dx = m2.x - m1.x;
            let dy = (m2.y + LastY_Zona1) - (m1.y + LastY_Zona1);
            let distance = Math.sqrt(dx * dx + dy * dy);

            let minDistance = 50; // Distancia mínima para colisión

            if (distance < minDistance) { // Si hay colisión
                m1.direction *= -1;
                m2.direction *= -1;
                let overlap = minDistance - distance;
                let pushX = (dx / distance) * (overlap / 2);
                
                m1.x -= pushX;
                m2.x += pushX;
            }
        }
    }
}

function LlegadaNaveZona1(){
    if (nave.y <= LastY_Zona1+10) {
        gameActive_Zona1 = false;

        
        setTimeout(() => {
            Zona1.visible = false;
            window.removeEventListener("keydown", NaveMoverse);
            addEventsPhobos();
            resetZona1();
            setTimeout(() => {
                collision = false;
                
            }, 5000);
        }, 2000);
    }
}

//Zona 2
function CreaZona2() {
    const geometry = new THREE.PlaneGeometry(10, 5);
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x000000, 
        opacity: 0.5, 
        transparent: true, 
        side: THREE.DoubleSide  // Permite ver el plano desde ambos lados
    });
    const background = new THREE.Mesh(geometry, material);
    background.position.set(0, 2, -4);
    Zona0.add(background);
     // Texto principal
     Fontloader.load(FontName, function (font) {
        const textGeometry = new TextGeometry(Texto_Zona0, {
            font: font,
            size: FontSizeOpciones,
            height: FontHeightOpciones,
            depth: FontDepthOpciones
        });

        textGeometry.computeBoundingBox();
        textGeometry.center();

        const textMaterial = new THREE.MeshBasicMaterial({ color: FontColorOpciones });

        var textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(0, 2, -4);

        Zona0.add(textMesh);
    });

    const starShape = new THREE.Shape();
    const spikes = 5;
    const outerRadius = 2;
    const innerRadius = 1;
    starShape.moveTo(outerRadius, 0);
    for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i / (spikes * 2)) * Math.PI * 2;
        starShape.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
    starShape.lineTo(outerRadius, 0);

    const starGeometry = new THREE.ShapeGeometry(starShape);
    const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
    const starMesh = new THREE.Mesh(starGeometry, starMaterial);
    starMesh.position.set(10, 0, 0);
    scene.add(starMesh);
}

//Eventos
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
    cameraPhobos.aspect = window.innerWidth / window.innerHeight;
    cameraPhobos.updateProjectionMatrix();
};

function onClick(event) {
    document.body.requestPointerLock();
};

function onClickOpciones(event){
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, cameraPhobos);

    const intersects = raycaster.intersectObjects(Zona0.children, true);
    if (intersects.length > 0) {
        const clickedButton = intersects[0].object;
        if (clickedButton.userData.index !== undefined) {
            Difficultad = clickedButton.userData.index;
            Zona0.visible = false;
            CargarZonas(Index_zona);
        }
    }
}

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
    cameraPhobos.quaternion.copy(quaternionYaw);
    cameraPhobos.quaternion.multiply(quaternionPitch);
};

function NaveMoverse(event){
    const key = event.key;

    switch (key) {
        case "w":
        case "W":
            nave.y -= 10;
            break;
        case "s":
        case "S":
            nave.y += 10;
            break;
        case "a":
        case "A":
            nave.x -= 10;
            break;
        case "d":
        case "D":
            nave.x += 10;
            break;
    }


}



function addEventsPhobos(){
    window.addEventListener("resize", resize);
    window.addEventListener("keydown", onkeydown);
    window.addEventListener("keyup", onkeyup);
    window.addEventListener("click", onClick);
    document.addEventListener("pointerlockchange", onPointerLockChange);

}

function removeEventsPhobos(){
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

export {CreateScenePhobos, animateScenePhobos, addEventsPhobos, removeEventsPhobos};