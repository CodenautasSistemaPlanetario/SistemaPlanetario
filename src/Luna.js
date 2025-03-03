import * as THREE from 'three';
import {  CrearSkysphere,CheckBordes,CheckVuelta,CrearZonas,CrearCanvasTexture,CheckLlegadaZonas,reiniciar } from './FucionesComunesLunas.js';


//Texturas
const TextureLoader = new THREE.TextureLoader();
const Groundpath = "./img/Luna/Gravel009_1K-JPG_";
const Land_texture_albedo = TextureLoader.load(Groundpath + "Color.jpg");
const Land_texture_normal = TextureLoader.load(Groundpath + "Normal.jpg");
const Land_texture_roughness = TextureLoader.load(Groundpath + "Roughness.jpg");
const Land_texture_ao = TextureLoader.load(Groundpath + "AmbientOcclusion.jpg");
const Land_texture_height = TextureLoader.load(Groundpath + "Displacement.jpg");

//Variables
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


var sceneLuna,cameraLuna, renderer;



var ya_jugado = false;

//Parametros Zonas
const ZonasJugables = [];

const Zona0 = new THREE.Group();
const Zona1 = new THREE.Group();
const Zona2 = new THREE.Group();
const Zona3 = new THREE.Group();
const Zona4 = new THREE.Group();
const Zona5 = new THREE.Group();


//Parametros elección dificultad (Zona 0)
var Index_zona;

//Parametros comunes Zonas
var Can_write = true;
const Text_color =" #ffffff";
const Background_color =" #92c5fc";
let User_input = "";

export const ZonasParamsLuna = [
    {
        correctAnswers: ["12", "47"],
        canvas: document.createElement("canvas"),
        ctx: null,
        backgroundTexture: null,
        lines: [
            ["🔍 Desafío: Los astronautas descubren una pantalla con números que representan las estrellas de una constelación, pero hay un número que falta.",
                "📝 Código en pantalla: 3 - 6 - 9 - ? - 15",
                "🤖 Pregunta: ¿Cuál es el número que falta?"],
            ["🔍 Desafío: Los astronautas descubren una pantalla con números que representan las estrellas de una constelación, pero hay un número que falta.",
                "📝 Código en pantalla: 2 - 5 - 11 - 23 - ?",
                "🤖 Pregunta: ¿Cuál es el número que falta?"]
        ],
        title: "🛰 Reto 1: Código de las Constelaciones⭐"
    },
    {
        correctAnswers: ["81", "133"],
        canvas: document.createElement("canvas"),
        ctx: null,
        backgroundTexture: null,
        lines: [
            ["🔍 Desafío: Un robot de la nave solo abrirá la puerta si los astronautas resuelven esta operación basada en el número de lunas de algunos planetas:",
                "Júpiter tiene 79 lunas.          Saturno tiene 83 lunas.",
                "Venus no tiene lunas.            Marte tiene 2 lunas.",
                "🤖 Pregunta: ¿Cuántas lunas tienen en total Júpiter y Marte?"],
            ["🔍 Desafío: Un robot de la nave solo abrirá la puerta si los astronautas resuelven esta operación basada en el número de lunas de algunos planetas:",
                "Júpiter tiene 79 lunas.          Saturno tiene 83 lunas.",
                "Urano tiene 27 lunas.            Marte tiene 2 lunas.",
                "🤖 Pregunta: Si restamos las lunas de Marte y Urano a la suma de Júpiter y Saturno, ¿cuántas lunas quedan?"]
        ],
        title: "🌍 Reto 2: La Suma de los Planetas 🪐"
    },
    {
        correctAnswers: ["(5,8)", "(5,17)"],
        canvas: document.createElement("canvas"),
        ctx: null,
        backgroundTexture: null,
        lines: [
            ["🔍 Desafío: Los astronautas encuentran un mapa estelar con estas coordenadas:",
                "(2,5) 🌕 (3,6) 🛸 (4,7) 🌎 (?)",
                "¿Qué números tendran las coordenadas faltantes? Escribelo con el siguiente formato: (x,y)"],
            ["🔍 Desafío: Los astronautas encuentran un mapa estelar con estas coordenadas:",
                "(2,5) 🌕 (3,8) 🛸 (4,12) 🌎 (?)",
                "🤖 Pregunta: ¿Cuál es la siguiente coordenada? Escribelo con el siguiente formato: (x,y)"]
        ],
        title: "🚀 Reto 3: Coordenadas Espaciales 📡"
    },
    {
        correctAnswers: ["12", "60"],
        canvas: document.createElement("canvas"),
        ctx: null,
        backgroundTexture: null,
        lines: [
            ["🔍 Desafío: La nave necesita recargar energía solar y tenemos un panel solar para hacerlo. El panel solar tiene forma rectangular y mide 4 metros de largo por 3 metros de ancho.",
                "🤖 Pregunta: ¿Cuántos metros cuadrados tiene el panel solar del que vamos a obtener la energía?"],
            ["🔍 Desafío: La nave necesita recargar energía solar, para activar la energía, deben calcular el área total de los paneles solares.",
                "Cada panel tiene forma de rectángulo: 6 metros de largo × 4 metros de ancho.",
                "Hay 3 paneles, pero uno está cubierto a la mitad por polvo espacial y no genera energía.",
                "🤖 Pregunta: ¿Cuántos metros cuadrados de paneles pueden generar energía?"]
        ],
        title: "🔥 Reto 4: Energía Solar de la Nave ☀️🔋"
    },
    {
        correctAnswers: ["300,000,000", "299,792"],
        canvas: document.createElement("canvas"),
        ctx: null,
        backgroundTexture: null,
        lines: [
            ["🔍 Desafío: Para activar el motor de velocidad luz, los astronautas deben elegir la cifra correcta.",
                "La luz viaja a 299,792,458 metros por segundo. ¿Cuál de estas opciones se acerca más?",
                "a) 300,000,000    b) 150,000,000   c) 299,000,000",
                "📝 Escribe la respuesta en formato numérico.(xxx,xxx,xxx)"],
            ["🔍 Desafío: La nave necesita alcanzar la velocidad de la luz, y para eso tiene que encender el motor de velocidad de la luz, por solo se encendera si eligen la cifra correcta.",
                "🤖 Pregunta: ¿Cuál de estas opciones es el resultado de dividir la velocidad de la luz entre 1000 y redondear al número entero más cercano?",
                "La velocidad de la luz es 299,792,458 metros por segundo.",
                "a) 299,792    b) 300,000   c) 299,000",
                "📝 Escribe la respuesta en formato numérico.(xxx,xxx)"]
        ],
        title: "🌠 Reto 5: La Velocidad de la Luz ⚡"
    }
];

// Initialize contexts
ZonasParamsLuna.forEach(zona => {
    zona.ctx = zona.canvas.getContext("2d");
});


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

    cameraLuna.position.set(0, 2, 0);


    CrearSkysphere(sceneLuna);
    CrearZonas(ZonasJugables,sceneLuna,Zona0,Zona1,Zona2,Zona3,Zona4,Zona5);
    
    return [sceneLuna, cameraLuna];
}

//Geometria
function animateSceneLunas() {
    
    if(ya_jugado){
        reiniciar(cameraLuna,Zona0);
        ya_jugado = false;
    }

    CheckVuelta(cameraLuna);
    CheckLlegadaZonas(ZonasJugables,cameraLuna,Zona0);
    CheckBordes(cameraLuna);
    

    renderer.render(sceneLuna, cameraLuna);
}

//Eventos
export function onClickOpcionesLuna(event){
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, cameraLuna);

    const intersects = raycaster.intersectObjects(Zona0.children, true);
    if (intersects.length > 0) {
        const clickedButton = intersects[0].object;
        if (clickedButton.userData.index !== undefined) {
            Difficultad = clickedButton.userData.index;
            Zona0.visible = false;
            CrearCanvasTexture(sceneLuna,cameraLuna,Difficultad);
        }
    }
}


export { CreateSceneLuna, animateSceneLunas};


