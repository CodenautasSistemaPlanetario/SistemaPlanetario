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

let User_input = "";
var LastY_Global = 0;
var Can_write = true;


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

//Parametros Gravedad invertida (Zona 2)
const canvas_Zona2 = document.createElement('canvas');
const ctx_Zona2 = canvas_Zona2.getContext('2d');
let Lineas_Zona2 = [
    "🔍 Desafío: El sistema de gravedad de la nave está fallando. Los astronautas deben presionar los botones de emergencia en el orden correcto para restablecer la gravedad normal."
];

const Simbolos_Zona2 = ["🛸","🌟","⚡","🔮"];
const Correct_answer_Zona2 = [[0,2,3,1],[2,3,2,1,0]];
const tamaño_simbolos = 200;
const distancia_click = 40;
let pos_simbolos = [[0.0,0.0],[0.0,0.0],[0.0,0.0],[0.0,0.0]];
var gameActive_Zona2 = false;
var Pos_Secuence_Zona2 = 0;
var backgroundtexture_Zona2;
var indice_secuencia = 0;
var empieza_secuencia = false;
let Secuencia_Input = [];
var canClick = false;

// Parametros Código del Alien (Zona 3)
const canvas_Zona3 = document.createElement('canvas');
const ctx_Zona3 = canvas_Zona3.getContext('2d');
let Lineas_Zona3 = [
    ["🔍 Desafío: Los alienígenas han dejado un mensaje encriptado. Descifra el código y descubre el mensaje oculto.",
        "Mensaje encriptado de los aliens: aloh sonamuh, somos sol rahtyn"],
    ["🔍 Desafío: Los alienígenas han dejado un mensaje encriptado. Descifra el código y descubre el mensaje oculto.",
        "Mensaje encriptado de los aliens: mpt ñzuibs ibñ ftubep brvj"]];
var backgroundtexture_Zona3;
const Correct_answer_Zona3 = ["hola humanos, somos los nythar", "los nythar han estado aqui"];
var LastY_Zona3 = 0;

// Parametros Código del Alien (Zona 4)
const canvas_Zona4 = document.createElement('canvas');
const ctx_Zona4 = canvas_Zona4.getContext('2d');
let Lineas_Zona4 = [
    ["Los astronautas tienen que visitar los planetas del sistema solar en el orden correcto para encontrar la salida.",
        "🔍 Desafío: Ordena los planetas desde más cercano al Sol hasta el más lejano. Escribelo con el siguiente formato: x-x-x",
        "📝 Planetas desordenados: Venus - Mercurio - Júpiter"],
    ["Los astronautas tienen que visitar los planetas del sistema solar en el orden correcto para encontrar la salida.",
        "🔍 Desafío: Ordena los planetas desde más cercano al Sol hasta el más lejano. Escribelo con el siguiente formato: x-x-x",
        "📝 Planetas desordenados: Venus - Marte - Mercurio - Saturno - Júpiter"]];
var backgroundtexture_Zona4;
const Correct_answer_Zona4 = ["mercurio-venus-jupiter", "mercurio-venus-marte-jupiter-saturno"];
var LastY_Zona4 = 0;

// Parametros Adivina el planeta (Zona 5)
const canvas_Zona5 = document.createElement('canvas');
const ctx_Zona5 = canvas_Zona5.getContext('2d');
let Lineas_Zona5 = [
    ["Los astronautas estan explorando la galaxia nebuloria y se han encontrado un planeta desconocido, que no saben si explorar o no.",
        "🔍 Desafío: descubre que planeta es el que se han encontrado los astronautas.",
        "📝 Descripción del planeta: es un planeta azul y verde con un clima extremo donde existe una neblina constante en la superficie.",
        "🤖 Pregunta:¿Qué planeta es este, basándote en las pistas dadas?"],
        ["Los astronautas estan explorando la galaxia nebuloria y se han encontrado un planeta desconocido, que no saben si explorar o no.",
            "🔍 Desafío: descubre que planeta es el que se han encontrado los astronautas.",
            "📝 Descripción del planeta: es un planeta con temperaturas extremas: 45 grados por la mañana y -10 por la noche y una presión atmosferica de 0.9 veces la de la tierra",
            "🤖 Pregunta:¿Qué planeta es este, basándote en las pistas dadas?"]];
var backgroundtexture_Zona5;
const Correct_answer_Zona5 = ["nymboria", "nymboria"];
var LastY_Zona5 = 0;


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
    } else if(gameActive_Zona2){
        if(!empieza_secuencia){
            empieza_secuencia = true;
            setTimeout(() => {
                mostrarSecuenciaZona2(indice_secuencia);
            }, 3000);
        }
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
            CreaZona2();
            window.addEventListener("click", ClickSimbolos);
            break;
        case 2:
            CreaZona3();
            window.addEventListener("keydown", escribirCanvas);
            break;
        case 3:
            CreaZona4();
            window.addEventListener("keydown", escribirCanvas);
            Zona4.visible = true;
            break;
        case 4:
            CreaZona5();
            window.addEventListener("keydown", escribirCanvas);
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
    clearZone(Zona1);

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
    clearZone(Zona2);

    canvas_Zona2.width = 1024;
    canvas_Zona2.height = 512;
    ctx_Zona2.fillStyle = Background_color;
    ctx_Zona2.fillRect(0, 0, canvas_Zona2.width, canvas_Zona2.height);
    ctx_Zona2.fillStyle = Text_color;
    ctx_Zona2.font = "50px Arial";
    ctx_Zona2.fillText("🛰 Reto 2: Gravedad Invertida 🌌", 10, 50);

    ctx_Zona2.font = "30px Arial";
    let startY = 100;
    let Height = 35;
    for (let linea of Lineas_Zona2) {
        startY += DividirLineas(ctx_Zona2, linea, 10, startY, canvas_Zona2.width - 20, Height);
    }
    Pos_Secuence_Zona2 = startY ;

    ctx_Zona2.fillStyle = Text_color;
    ctx_Zona2.font = "30px Arial";
    ctx_Zona2.fillText("Secuencia:", 300, Pos_Secuence_Zona2+50 );

    let X_step =tamaño_simbolos/ (Simbolos_Zona2.length -1);
    const espacio_disponible = canvas_Zona2.height - Pos_Secuence_Zona2;
    
    Simbolos_Zona2.forEach((simbolo, index) => {
        const x_pos = canvas_Zona2.width /2 -tamaño_simbolos/2 + (index * X_step)+ ctx_Zona2.measureText(simbolo).width/2;
        const y_pos =(canvas_Zona2.height / 2) + espacio_disponible * 0.65;
        pos_simbolos[index] = [x_pos, y_pos];
        console.log("Posicion simbolo: " + simbolo + " X: " + x_pos + " Y: " + y_pos);
        ctx_Zona2.fillText(simbolo, x_pos, y_pos);
    });

    

    backgroundtexture_Zona2 = new THREE.CanvasTexture(canvas_Zona2);

    const backgroundGeometry = new THREE.PlaneGeometry(10, 5);
    const backgroundMaterial = new THREE.MeshBasicMaterial({
        map: backgroundtexture_Zona2,
        opacity: 1,
        transparent: false
    });

    const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
    backgroundMesh.position.set(0, 2.5, -4);

    Zona2.add(backgroundMesh);

    gameActive_Zona2 = true;

    Zona2.visible = true;

    const pos_global = new THREE.Vector3();
    Zona2.children[0].getWorldPosition(pos_global);
    cameraPhobos.lookAt(pos_global);
    scenePhobos.add(Zona2);
}

function mostrarSecuenciaZona2(local_indice_secuencia){
    ctx_Zona2.fillStyle = Background_color;
    ctx_Zona2.fillRect(450, Pos_Secuence_Zona2-10, canvas_Zona2.width, 150);

    ctx_Zona2.fillText(Simbolos_Zona2[Correct_answer_Zona2[Difficultad][local_indice_secuencia]], 512, Pos_Secuence_Zona2+50 );
    backgroundtexture_Zona2.needsUpdate = true;
    if(indice_secuencia < Correct_answer_Zona2[Difficultad].length -1){
        setTimeout(() => {
            indice_secuencia++;
            mostrarSecuenciaZona2(indice_secuencia);
        }, 2000);
    } else if(indice_secuencia === Correct_answer_Zona2[Difficultad].length -1){
        setTimeout(() => {
            ctx_Zona2.fillStyle = Background_color;
            ctx_Zona2.fillRect(450, Pos_Secuence_Zona2-10, canvas_Zona2.width, 100);
            backgroundtexture_Zona2.needsUpdate = true;
            canClick = true;
        }, 2000);
    }
}

function animarSimbolo(index) {
    canClick = false;
    let size = 50;
    ctx_Zona2.fillStyle = Background_color;
    ctx_Zona2.fillRect(pos_simbolos[index][0], pos_simbolos[index][1]-size,size+10, size+10);
    ctx_Zona2.font = `${size}px Arial`;       
    ctx_Zona2.fillText(Simbolos_Zona2[index], pos_simbolos[index][0]-size/4, pos_simbolos[index][1]);
    backgroundtexture_Zona2.needsUpdate = true;
    setTimeout(() => {
        ctx_Zona2.fillStyle = Background_color;
        ctx_Zona2.fillRect(pos_simbolos[index][0]-size/4, pos_simbolos[index][1]-size, size+10, size+10);
        ctx_Zona2.fillStyle = Text_color;
        ctx_Zona2.font = "30px Arial";
        ctx_Zona2.fillText(Simbolos_Zona2[index], pos_simbolos[index][0], pos_simbolos[index][1]);
        backgroundtexture_Zona2.needsUpdate = true;
        canClick = true;
    }, 1000);
    
    
}

function resetZona2() {
  gameActive_Zona2 = false;
  canClick = false;
  setTimeout(() => {
    Zona2.visible = false;
    addEventsPhobos();
    Secuencia_Input = [];
    empieza_secuencia = false;
    indice_secuencia = 0;
    canClick = false;
    window.removeEventListener("click", ClickSimbolos);
    setTimeout(() => {
      collision = false;
    }, 5000);
  }, 2000);
}

//Zona 3
function CreaZona3() {
    clearZone(Zona3);

    canvas_Zona3.width = 1024;
    canvas_Zona3.height = 512;

    ctx_Zona3.fillStyle = Background_color;
    ctx_Zona3.fillRect(0, 0, canvas_Zona3.width, canvas_Zona3.height);
    ctx_Zona3.fillStyle = Text_color;
    ctx_Zona3.font = "50px Arial";
    ctx_Zona3.fillText("👽 Reto 3: Código de los Alienigenas", 10, 50);
    
    ctx_Zona3.font = "30px Arial";
    let startY=100;
    let Height = 35;
    for (let linea of Lineas_Zona3[Difficultad]) {
        startY +=DividirLineas(ctx_Zona3, linea, 10, startY, canvas_Zona3.width - 20, Height);
    }

    LastY_Zona3 = startY;

    const backgroundGeometry = new THREE.PlaneGeometry(10, 5);
    backgroundtexture_Zona3 = new THREE.CanvasTexture(canvas_Zona3);
    const backgroundMaterial =  new THREE.MeshBasicMaterial({ map: backgroundtexture_Zona3,
        opacity: 0.8,
        transparent: true
    });
    
    const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
    backgroundMesh.position.set(0, 2, -4);
    Zona3.add(backgroundMesh);

    Zona3.visible = true;
    const pos_global = new THREE.Vector3();
    Zona3.children[0].getWorldPosition(pos_global);
    cameraPhobos.lookAt(pos_global);
    scenePhobos.add(Zona3);
}

//Zona 4
function CreaZona4() {
    clearZone(Zona4);

    canvas_Zona4.width = 1024;
    canvas_Zona4.height = 512;

    ctx_Zona4.fillStyle = Background_color;
    ctx_Zona4.fillRect(0, 0, canvas_Zona4.width, canvas_Zona4.height);
    ctx_Zona4.fillStyle = Text_color;
    ctx_Zona4.font = "50px Arial";
    ctx_Zona4.fillText("🔭 Reto 5: El Enigma de los Planetas", 10, 50);
    
    ctx_Zona4.font = "30px Arial";
    let startY=100;
    let Height = 35;
    for (let linea of Lineas_Zona4[Difficultad]) {
        startY +=DividirLineas(ctx_Zona4, linea, 10, startY, canvas_Zona4.width - 20, Height);
    }

    LastY_Zona4 = startY;

    const backgroundGeometry = new THREE.PlaneGeometry(10, 5);
    backgroundtexture_Zona4 = new THREE.CanvasTexture(canvas_Zona4);
    const backgroundMaterial =  new THREE.MeshBasicMaterial({ map: backgroundtexture_Zona4,
        opacity: 0.8,
        transparent: true
    });
    
    const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
    backgroundMesh.position.set(0, 2, -4);
    Zona4.add(backgroundMesh);

    Zona4.visible = true;
    const pos_global = new THREE.Vector3();
    Zona4.children[0].getWorldPosition(pos_global);
    cameraPhobos.lookAt(pos_global);
    scenePhobos.add(Zona4);
}

//Zona 5
function CreaZona5() {
    clearZone(Zona5);

    canvas_Zona5.width = 1024;
    canvas_Zona5.height = 512;

    ctx_Zona5.fillStyle = Background_color;
    ctx_Zona5.fillRect(0, 0, canvas_Zona5.width, canvas_Zona5.height);
    ctx_Zona5.fillStyle = Text_color;
    ctx_Zona5.font = "50px Arial";
    ctx_Zona5.fillText("🔭 Reto 5: El Enigma de los Planetas", 10, 50);
    
    ctx_Zona5.font = "30px Arial";
    let startY=100;
    let Height = 35;
    for (let linea of Lineas_Zona5[Difficultad]) {
        startY +=DividirLineas(ctx_Zona5, linea, 10, startY, canvas_Zona5.width - 20, Height);
    }

    LastY_Zona5 = startY;

    const backgroundGeometry = new THREE.PlaneGeometry(10, 5);
    backgroundtexture_Zona5 = new THREE.CanvasTexture(canvas_Zona5);
    const backgroundMaterial =  new THREE.MeshBasicMaterial({ map: backgroundtexture_Zona5,
        opacity: 0.8,
        transparent: true
    });
    
    const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
    backgroundMesh.position.set(0, 2, -4);
    Zona5.add(backgroundMesh);

    Zona5.visible = true;
    const pos_global = new THREE.Vector3();
    Zona5.children[0].getWorldPosition(pos_global);
    cameraPhobos.lookAt(pos_global);
    scenePhobos.add(Zona5);
}

function clearZone(zone) {
    for (let i = zone.children.length - 1; i >= 0; i--) {
        let obj = zone.children[i];
        if (obj.isMesh) {
            zone.remove(obj);
            obj.geometry.dispose();
            obj.material.dispose();
        }
    }
}

function checkAnswer(letter) {
    let correcto = false;
    let local_correct_answer = "";
    switch(Index_zona){
        case 2:
            local_correct_answer = Correct_answer_Zona3[Difficultad];
            break;
        case 3:
            local_correct_answer = Correct_answer_Zona4[Difficultad];
            break;
        case 4:
            local_correct_answer = Correct_answer_Zona5[Difficultad];
            break;
    }

    if (letter === local_correct_answer) {
        Can_write = false; // Bloquear clics temporalmente
        correcto = true;
        setTimeout(() => {
            Can_write = true; // Reactivar clics después de 2 segundos
            AcabadoZona();
        }, 2000);
    } else {
        Can_write = false; // Bloquear clics temporalmente
        correcto = false;
        setTimeout(() => {
            Can_write = true;
        }, 2000);
    }

    return correcto;
}

function AcabadoZona() {
    window.removeEventListener("keydown", escribirCanvas);
        addEventsPhobos();
        Zona1.visible = false;
        Zona2.visible = false;
        Zona3.visible = false;
        Zona4.visible = false;
        Zona5.visible = false;
        setTimeout(() => {
            collision = false;
        }, 5000);
}


//Eventos

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

function ClickSimbolos(event){
    if(!canClick) return;
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, cameraPhobos);

    const intersects = raycaster.intersectObject(Zona2.children[0]); 

    if (intersects.length > 0) {
        const uv = intersects[0].uv; 
        
        
        const canvasX = uv.x * canvas_Zona2.width;
        const canvasY = (1 - uv.y) * canvas_Zona2.height; 

        console.log(`Clic en Canvas: X=${canvasX}, Y=${canvasY}`)
        const click = new THREE.Vector2(canvasX, canvasY);
        Simbolos_Zona2.forEach((simbolo, index) => {
            const simbolo_pos = new THREE.Vector2(pos_simbolos[index][0], pos_simbolos[index][1]);
            const distance = click.distanceTo(simbolo_pos);
            
            if(distance <= distancia_click){
                Secuencia_Input.push(index);
                animarSimbolo(index);
                console.log(Secuencia_Input);
                
                console.log("Distancia: " + distance);
                console.log("Posición simbolo "+simbolo+ " antes del mesure : "+ pos_simbolos[index][0] + " " + pos_simbolos[index][1]);
                console.log("Posición simbolo despues del mesure: " + simbolo_pos.x + " " + simbolo_pos.y);
                if(Secuencia_Input.length >= Correct_answer_Zona2[Difficultad].length){
                    var Text_answer = "";
                    var Text_answer_color = "";
                    if(JSON.stringify(Secuencia_Input) === JSON.stringify(Correct_answer_Zona2[Difficultad])){
                        resetZona2();
                        Text_answer = "Correcto";
                        Text_answer_color = "#00ff00";
                    } else {
                        Text_answer = "Incorrecto";
                        Text_answer_color = "#ff0000";
                        canClick = false;
                        setTimeout(() => {
                            Secuencia_Input = [];
                            empieza_secuencia = false;
                            indice_secuencia = 0;
                            canClick = false;
                        }, 2000);
                    }
                    ctx_Zona2.fillStyle = Background_color;
                    ctx_Zona2.fillRect(450, Pos_Secuence_Zona2+100, canvas_Zona2.width, 100);
                    ctx_Zona2.fillStyle = Text_answer_color;
                    ctx_Zona2.font = "50px Arial";
                    ctx_Zona2.fillText(Text_answer, 512, Pos_Secuence_Zona2+100 );
                    backgroundtexture_Zona2.needsUpdate = true;
                }
            }
    
        });
    }
    
}

function escribirCanvas(event) {
    let correcto = null;
    let texto_check = "";
    let color_check = "";

    let local_canvas;
    let local_ctx;
    let local_texture;

    switch (Index_zona) {
        case 2:
            LastY_Global = LastY_Zona3;
            local_canvas = canvas_Zona3;
            local_ctx = ctx_Zona3;
            local_texture = backgroundtexture_Zona3;
            break;
        case 3:
            LastY_Global = LastY_Zona4;
            local_canvas = canvas_Zona4;
            local_ctx = ctx_Zona4;
            local_texture = backgroundtexture_Zona4;
            break;
        case 4:
            LastY_Global = LastY_Zona5;
            local_canvas = canvas_Zona5;
            local_ctx = ctx_Zona5;
            local_texture = backgroundtexture_Zona5;
            break;
        default:
            return;
    }

    if (!Can_write) {
        return;
    }

    if (event.key === "Backspace") {
        User_input = User_input.slice(0, -1);
        texto_check = "";
    } else if (event.key.length === 1) {
        User_input += event.key;
        texto_check = "";
        
    } else if (event.key === "Enter") {
        User_input = User_input.toLocaleLowerCase(); 
        User_input = User_input.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); 
        console.log(User_input); 
        
        correcto = checkAnswer(User_input);
        User_input = "";
        if (correcto) {
            texto_check = "Correcto";
            color_check = "#00ff00";
        } else if (!correcto) {
            texto_check = "Incorrecto";
            color_check = "#ff0000";
        }
    }

    const espacio_disponible = local_canvas.height - LastY_Global;
    local_ctx.fillStyle = Background_color;
    local_ctx.fillRect(250, LastY_Global, local_canvas.width - 500, espacio_disponible);
   

    local_ctx.fillStyle = Text_color;


    let userinput_width = local_ctx.measureText(User_input).width;
    let userinput_x = (local_canvas.width - userinput_width) / 2;
    let userinput_y = LastY_Global + (espacio_disponible / 4);
    local_ctx.fillText(User_input, userinput_x, userinput_y);

    if (correcto != null) {
        local_ctx.fillStyle = color_check;
        let texto_width = local_ctx.measureText(texto_check).width;
        let texto_x = (local_canvas.width - texto_width) / 2;
        local_ctx.fillText(texto_check, texto_x, userinput_y);
        setTimeout(() => {
            texto_check = "";
            color_check = "";
            local_ctx.fillStyle = Background_color;
            local_ctx.fillRect(250, LastY_Global, local_canvas.width - 500, 90);
            local_texture.needsUpdate = true;
        }, 2000);
    }

    local_texture.needsUpdate = true;
}



//Movimiento de la cámara
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
    cameraPhobos.aspect = window.innerWidth / window.innerHeight;
    cameraPhobos.updateProjectionMatrix();
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