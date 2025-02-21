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

var sceneLuna,cameraLuna, renderer;


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
var LastY_Zona1, LastY_Zona2, LastY_Zona3, LastY_Zona4, LastY_Zona5;
var LastY_Global;  


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

//Parametros comunes Zonas
var Can_write = true;
const Text_color =" #ffffff";
const Background_color =" #92c5fc";
const Zone_box_color = 0xff0000;
const dist_colision_zonas = 1;
let User_input = "";

//Parametros Secuencia (Zona 1)
const Correct_answer_Zona1 =["12", "47"];
const canvas_Zona1 = document.createElement("canvas");
const ctx_Zona1 = canvas_Zona1.getContext("2d");
var backgroundtexture_Zona1;
let Lineas_Zona1 = [
    ["🔍 Desafío: Los astronautas descubren una pantalla con números que representan las estrellas de una constelación, pero hay un número que falta.",
    "📝 Código en pantalla: 3 - 6 - 9 - ? - 15",
    "🤖 Pregunta: ¿Cuál es el número que falta?"],
    ["🔍 Desafío: Los astronautas descubren una pantalla con números que representan las estrellas de una constelación, pero hay un número que falta.",
    "📝 Código en pantalla: 2 - 5 - 11 - 23 - ?",
    "🤖 Pregunta: ¿Cuál es el número que falta?"]
];

//Parametros La suma de planetas (Zona 2)
const canvas_Zona2 = document.createElement("canvas");
const ctx_Zona2 = canvas_Zona2.getContext("2d");
var backgroundtexture_Zona2;
let Lineas_Zona2 = [["🔍 Desafío: Un robot de la nave solo abrirá la puerta si los astronautas resuelven esta operación basada en el número de lunas de algunos planetas:",
    "Júpiter tiene 79 lunas.          Saturno tiene 83 lunas.",
    "Venus no tiene lunas.            Marte tiene 2 lunas.",
    "🤖 Pregunta: ¿Cuántas lunas tienen en total Júpiter y Marte?"],
    ["🔍 Desafío: Un robot de la nave solo abrirá la puerta si los astronautas resuelven esta operación basada en el número de lunas de algunos planetas:",
        "Júpiter tiene 79 lunas.          Saturno tiene 83 lunas.",
        "Urano tiene 27 lunas.            Marte tiene 2 lunas.",
        "🤖 Pregunta: Si restamos las lunas de Marte y Urano a la suma de Júpiter y Saturno, ¿cuántas lunas quedan?"]
];
const Correct_answer_Zona2 = ["81", "133"];

//Parametros Coordenadas de la nave (Zona 3)
const canvas_Zona3 = document.createElement("canvas");
const ctx_Zona3 = canvas_Zona3.getContext("2d");
var backgroundtexture_Zona3;
let Lineas_Zona3 = [["🔍 Desafío: Los astronautas encuentran un mapa estelar con estas coordenadas:",
    "(2,5) 🌕 (3,6) 🛸 (4,7) 🌎 (?)",
    "¿Qué números tendran las coordenadas faltantes? Escribelo con el siguiente formato: (x,y)"],
    ["🔍 Desafío: Los astronautas encuentran un mapa estelar con estas coordenadas:",
        "(2,5) 🌕 (3,8) 🛸 (4,12) 🌎 (?)",
        "🤖 Pregunta: ¿Cuál es la siguiente coordenada? Escribelo con el siguiente formato: (x,y)"]
];
const Correct_answer_Zona3 = ["(5,8)", "(5,17)"];

//Parametros Zona 4
const canvas_Zona4 = document.createElement("canvas");
const ctx_Zona4 = canvas_Zona4.getContext("2d");
var backgroundtexture_Zona4;
let Lineas_Zona4 = [["🔍 Desafío: La nave necesita recargar energía solar y tenemos un panel solar para hacerlo. El panel solar tiene forma rectangular y mide 4 metros de largo por 3 metros de ancho.",
    "🤖 Pregunta: ¿Cuántos metros cuadrados tiene el panel solar del que vamos a obtener la energía?"],
    ["🔍 Desafío: La nave necesita recargar energía solar, para activar la energía, deben calcular el área total de los paneles solares.",
        "Cada panel tiene forma de rectángulo: 6 metros de largo × 4 metros de ancho.",
        "Hay 3 paneles, pero uno está cubierto a la mitad por polvo espacial y no genera energía.",
        "🤖 Pregunta: ¿Cuántos metros cuadrados de paneles pueden generar energía?"
    ]];
const Correct_answer_Zona4 = ["12","60"];

//Parametros Zona 5
const canvas_Zona5 = document.createElement("canvas");
const ctx_Zona5 = canvas_Zona5.getContext("2d");
var backgroundtexture_Zona5;
let Lineas_Zona5 = [["🔍 Desafío: Para activar el motor de velocidad luz, los astronautas deben elegir la cifra correcta.",
        "La luz viaja a 299,792,458 metros por segundo. ¿Cuál de estas opciones se acerca más?",
        "a) 300,000,000    b) 150,000,000   c) 299,000,000",
        "📝 Escribe la respuesta en formato numérico.(xxx,xxx,xxx)"],
    ["🔍 Desafío: La nave necesita alcanzar la velocidad de la luz, y para eso tiene que encender el motor de velocidad de la luz, por solo se encendera si eligen la cifra correcta.",
        "🤖 Pregunta: ¿Cuál de estas opciones es el resultado de dividir la velocidad de la luz entre 1000 y redondear al número entero más cercano?",
        "La velocidad de la luz es 299,792,458 metros por segundo.",
        "a) 299,792    b) 300,000   c) 299,000",
        "📝 Escribe la respuesta en formato numérico.(xxx,xxx)"]];
const Correct_answer_Zona5 = ["300,000,000","299,792"];





function CreateSceneLuna(globalrenderer)
{
    sceneLuna = new THREE.Scene();
    cameraLuna = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    globalrenderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(globalrenderer.domElement);
    renderer = globalrenderer;


    const light = new THREE.DirectionalLight(0xffffff, 0.7);
    light.position.set(0, 10, 0).normalize();
    sceneLuna.add(light);
    const lightsecondary = new THREE.DirectionalLight(0xffffff, 0.3);
    lightsecondary.position.set(-5, 10, 5).normalize();
    sceneLuna.add(lightsecondary);
  
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
    sceneLuna.add(ground);
    

    // Volver 
    const geometry = new THREE.BoxGeometry(1, 0.1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0, 0);
    sceneLuna.add(cube);



    // Cámara
    cameraLuna.position.set(0, 2, 0);

    clock = new THREE.Clock();
    camforward = new THREE.Vector3();
    camright = new THREE.Vector3();

    CrearSkysphere();
    CrearZonas();
    


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
        sceneLuna.add(cube);
    });

}

function animateSceneLunas() {
    
    if(ya_jugado){
        reiniciar();
        ya_jugado = false;
    }


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

    CheckVuelta();
    CheckLlegadaZonas();
    CheckBordes();
    

    renderer.render(sceneLuna, cameraLuna);
}

function reiniciar(){
    cameraLuna.position.set(0, 2, 0);
    cameraLuna.rotation.set(0, 0, 0);

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

//Funciones
function CheckVuelta(){
    const pos_zona_elevada = new THREE.Vector3(0, cameraLuna.position.y, 0);
    const distance = cameraLuna.position.distanceTo(pos_zona_elevada);

    if(!empieza_moverse && distance >= 1.3){
        empieza_moverse = true;
    } else if(empieza_moverse && distance <= 1){
        ya_jugado = true;
        changeScene("scenePlanets");
        empieza_moverse = false;
    }
}

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

function CheckLlegadaZonas(){
    if(!collision){
        ZonasJugables.forEach((zona,index) => {
            const pos_zona_elevada = new THREE.Vector3(zona.x, cameraLuna.position.y, zona.z);
            const distance = cameraLuna.position.distanceTo(pos_zona_elevada);
    
            if(distance <= dist_colision_zonas){
                CargarZona0(index);
            }
        });
    }

}



function CargarZonas(index){
    // console.log("Cargando Zona: "+index);
    window.removeEventListener("click", onClickOpciones);
    switch(index){
        case 0:
            CreaZona1();
            LastY_Global = LastY_Zona1;
            break;
       case 1:
            CrearZona2();
            LastY_Global = LastY_Zona2;
            break;
        case 2:
            CrearZona3();
            LastY_Global = LastY_Zona3;
            break;
        case 3:
            CrearZona4();
            LastY_Global = LastY_Zona4;
            break;
        case 4:
            CrearZona5();
            LastY_Global = LastY_Zona5;
            break;
        default:
            return;

    }
        
        collision = true;
        removemovementEvents();
        forward = 0;
        right = 0;
        yaw = 0;
        pitch = 0;
        window.addEventListener("keydown", escribirCanvas);
    
}

//Zona 0
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
    sceneLuna.add(Zona0);
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
    
    cameraLuna.position.set(Zona0.position.x, 2, Zona0.position.z);
    cameraLuna.lookAt(pos_global);

    collision = true;
    removemovementEvents();
    forward = 0;
    right = 0;
    yaw = 0;
    pitch = 0;
    window.addEventListener("click", onClickOpciones);
}


//Zona 1
function CreaZona1(){
    clearZone(Zona1);

    canvas_Zona1.width = 1024;
    canvas_Zona1.height = 512;

    ctx_Zona1.fillStyle = Background_color;
    ctx_Zona1.fillRect(0, 0, canvas_Zona1.width, canvas_Zona1.height);
    ctx_Zona1.fillStyle = Text_color;
    ctx_Zona1.font = "50px Arial";
    ctx_Zona1.fillText("🛰 Reto 1: Código de las Constelaciones⭐", 10, 50);
    
    ctx_Zona1.font = "30px Arial";
    let startY=100;
    let Height = 35;
    for (let linea of Lineas_Zona1[Difficultad]) {
        startY +=DividirLineas(ctx_Zona1, linea, 10, startY, canvas_Zona1.width - 20, Height);
    }

    LastY_Zona1 = startY;

    const backgroundGeometry = new THREE.PlaneGeometry(10, 5);
    backgroundtexture_Zona1 = new THREE.CanvasTexture(canvas_Zona1);
    const backgroundMaterial =  new THREE.MeshBasicMaterial({ map: backgroundtexture_Zona1,
        opacity: 0.8,
        transparent: true
     });
    
    const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
    backgroundMesh.position.set(0, 2, -4);
    Zona1.add(backgroundMesh);

    Zona1.visible = true;
    const pos_global = new THREE.Vector3();
    Zona1.children[0].getWorldPosition(pos_global);
    cameraLuna.lookAt(pos_global);
    sceneLuna.add(Zona1);
}

//Zona 2
function CrearZona2(){
    clearZone(Zona2);

    canvas_Zona2.width = 1024;
    canvas_Zona2.height = 512;

    ctx_Zona2.fillStyle = Background_color;
    ctx_Zona2.fillRect(0, 0, canvas_Zona2.width, canvas_Zona2.height);
    ctx_Zona2.fillStyle = Text_color;
    ctx_Zona2.font = "50px Arial";
    ctx_Zona2.fillText("🌍 Reto 2: La Suma de los Planetas 🪐", 10, 50);
    
    ctx_Zona2.font = "30px Arial";
    let startY=100;
    let Height = 35;
    for (let linea of Lineas_Zona2[Difficultad]) {
        startY +=DividirLineas(ctx_Zona2, linea, 10, startY, canvas_Zona2.width - 20, Height);
    }

    LastY_Zona2 = startY;

    const backgroundGeometry = new THREE.PlaneGeometry(10, 5);
    backgroundtexture_Zona2 = new THREE.CanvasTexture(canvas_Zona2);
    const backgroundMaterial =  new THREE.MeshBasicMaterial({ map: backgroundtexture_Zona2,
        opacity: 0.8,
        transparent: true
    });
    
    const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
    backgroundMesh.position.set(0, 2, -4);
    Zona2.add(backgroundMesh);

    Zona2.visible = true;
    const pos_global = new THREE.Vector3();
    Zona2.children[0].getWorldPosition(pos_global);
    cameraLuna.lookAt(pos_global);
    sceneLuna.add(Zona2);
}

//Zona 3
function CrearZona3(){
    clearZone(Zona3);

    canvas_Zona3.width = 1024;
    canvas_Zona3.height = 512;

    ctx_Zona3.fillStyle = Background_color;
    ctx_Zona3.fillRect(0, 0, canvas_Zona3.width, canvas_Zona3.height);
    ctx_Zona3.fillStyle = Text_color;
    ctx_Zona3.font = "50px Arial";
    ctx_Zona3.fillText("🚀 Reto 3: Coordenadas Espaciales 📡", 10, 50);
    
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
    cameraLuna.lookAt(pos_global);
    sceneLuna.add(Zona3);

}

//Zona 4
function CrearZona4(){
    clearZone(Zona4);

    canvas_Zona4.width = 1024;
    canvas_Zona4.height = 512;

    ctx_Zona4.fillStyle = Background_color;
    ctx_Zona4.fillRect(0, 0, canvas_Zona4.width, canvas_Zona4.height);
    ctx_Zona4.fillStyle = Text_color;
    ctx_Zona4.font = "50px Arial";
    ctx_Zona4.fillText("🔥 Reto 4: Energía Solar de la Nave ☀️🔋", 10, 50);
    
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
    cameraLuna.lookAt(pos_global);
    sceneLuna.add(Zona4);
}

//Zona 5
function CrearZona5(){  
    clearZone(Zona5);

    canvas_Zona5.width = 1024;
    canvas_Zona5.height = 512;

    ctx_Zona5.fillStyle = Background_color;
    ctx_Zona5.fillRect(0, 0, canvas_Zona5.width, canvas_Zona5.height);
    ctx_Zona5.fillStyle = Text_color;
    ctx_Zona5.font = "50px Arial";
    ctx_Zona5.fillText("🌠 Reto 5: La Velocidad de la Luz ⚡", 10, 50);
    
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
    cameraLuna.lookAt(pos_global);
    sceneLuna.add(Zona5);
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

function DividirLineas(ctx, text, x, y, maxWidth, lineHeight) {
    let words = text.split(" ");
    let line = "";
    let lineCount = 0; // Contador de líneas

    for (let i = 0; i < words.length; i++) {
        let testLine = line + words[i] + " ";
        let metrics = ctx.measureText(testLine);
        let testWidth = metrics.width;

        if (testWidth > maxWidth && i > 0) {
            ctx.fillText(line, x, y);
            line = words[i] + " ";
            y += lineHeight;
            lineCount++; // Aumentar el contador de líneas
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, y);
    lineCount++; // Incluir la última línea también

    return lineCount * lineHeight; // Devolver el espacio utilizado
}

function checkAnswer(letter) {
    let correcto = false;
    let local_correct_answer = "";
    switch(Index_zona){
        case 0:
            local_correct_answer = Correct_answer_Zona1[Difficultad];
            break;
        case 1:
            local_correct_answer = Correct_answer_Zona2[Difficultad];
            break;
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

function AcabadoZona(){
    window.removeEventListener("keydown", escribirCanvas);
    addEventsLuna();
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

function onClickOpciones(event){
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, cameraLuna);

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
    cameraLuna.quaternion.copy(quaternionYaw);
    cameraLuna.quaternion.multiply(quaternionPitch);
};


function escribirCanvas(event) {
    let correcto = null;
    let texto_check = "";
    let color_check = "";

    let local_canvas;
    let local_ctx;
    let local_texture

    switch (Index_zona) {
        case 0:
            local_canvas = canvas_Zona1;
            local_ctx = ctx_Zona1;
            local_texture = backgroundtexture_Zona1;
            break;
        case 1:
            local_canvas = canvas_Zona2;
            local_ctx = ctx_Zona2;
            local_texture = backgroundtexture_Zona2;
            break;
        case 2:
            local_canvas = canvas_Zona3;
            local_ctx = ctx_Zona3;
            local_texture = backgroundtexture_Zona3;
            break;
        case 3:
            local_canvas = canvas_Zona4;
            local_ctx = ctx_Zona4;
            local_texture = backgroundtexture_Zona4;
            break;
        case 4:
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


export { CreateSceneLuna, animateSceneLunas, addEventsLuna, removeEventsLuna };


