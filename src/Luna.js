import * as THREE from 'three';
import {changeScene,removemovementEvents,resetMovimientoCamara,addmovementEvents} from "../Controlador.js";
import { FontLoader } from 'https://unpkg.com/three@latest/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://unpkg.com/three@latest/examples/jsm/geometries/TextGeometry.js';
import { clearZone,CrearSkysphere,CheckBordes,CheckVuelta,CrearZonas,DividirLineas } from './FucionesComunesLunas.js';


//Texturas
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


var sceneLuna,cameraLuna, renderer;


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
const titulo_Reto_Zona1 = "🛰 Reto 1: Código de las Constelaciones⭐";

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
const titulo_Reto_Zona2 = "🌍 Reto 2: La Suma de los Planetas 🪐";

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
const titulo_Reto_Zona3 = "🚀 Reto 3: Coordenadas Espaciales 📡";

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
const titulo_Reto_Zona4 = "🔥 Reto 4: Energía Solar de la Nave ☀️🔋";

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
const titulo_Reto_Zona5 = "🌠 Reto 5: La Velocidad de la Luz ⚡";





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
        reiniciar();
        ya_jugado = false;
    }


    CheckVuelta(cameraLuna);
    CheckLlegadaZonas();
    CheckBordes(cameraLuna);
    

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

    resetMovimientoCamara();

}

//Funciones


function CheckLlegadaZonas(){
    if(!collision){
        ZonasJugables.forEach((zona,index) => {
            const pos_zona_elevada = new THREE.Vector3(zona.x, cameraLuna.position.y, zona.z);
            const distance = cameraLuna.position.distanceTo(pos_zona_elevada);
    
            if(distance <= dist_colision_zonas){
                Index_zona = index;
                CargarZona0(index,Zona0,Zona1,Zona2,Zona3,Zona4,Zona5,cameraLuna);
            }
        });
    }

}


function CrearCanvasTexture(indice) {
    let zona, canvas, ctx, lineas,backgroundtexture,tituloreto;

    window.removeEventListener("click", onClickOpcionesLuna);

    switch (indice) {
        case 0:
            zona = Zona1;
            tituloreto = titulo_Reto_Zona1;
            canvas = canvas_Zona1;
            ctx = ctx_Zona1;
            lineas = Lineas_Zona1[Difficultad];
            break;
        case 1:
            zona = Zona2;
            tituloreto = titulo_Reto_Zona2;
            canvas = canvas_Zona2;
            ctx = ctx_Zona2;
            lineas = Lineas_Zona2[Difficultad];
            break;
        case 2:
            zona = Zona3;
            tituloreto = titulo_Reto_Zona3;
            canvas = canvas_Zona3;
            ctx = ctx_Zona3;
            lineas = Lineas_Zona3[Difficultad];
            break;
        case 3:
            zona = Zona4;
            tituloreto = titulo_Reto_Zona4;
            canvas = canvas_Zona4;
            ctx = ctx_Zona4;
            lineas = Lineas_Zona4[Difficultad];
            break;
        case 4:
            zona = Zona5;
            tituloreto = titulo_Reto_Zona5;
            canvas = canvas_Zona5;
            ctx = ctx_Zona5;
            lineas = Lineas_Zona5[Difficultad];
            break;
        default:
            return;
    }

    clearZone(zona);

    canvas.width = 1024;
    canvas.height = 512;

    ctx.fillStyle = Background_color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = Text_color;
    ctx.font = "50px Arial";
    ctx.fillText(tituloreto, 10, 50);

    ctx.font = "30px Arial";
    let startY = 100;
    let Height = 35;
    for (let linea of lineas) {
        startY += DividirLineas(ctx, linea, 10, startY, canvas.width - 20, Height);
    }

    LastY_Global = startY;

    const backgroundGeometry = new THREE.PlaneGeometry(10, 5);
    backgroundtexture = new THREE.CanvasTexture(canvas);
    const backgroundMaterial = new THREE.MeshBasicMaterial({
        map: backgroundtexture,
        opacity: 0.8,
        transparent: true,
    });

    const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
    backgroundMesh.position.set(0, 2, -4);
    zona.add(backgroundMesh);

    zona.visible = true;
    const pos_global = new THREE.Vector3();
    zona.children[0].getWorldPosition(pos_global);
    cameraLuna.lookAt(pos_global);
    sceneLuna.add(zona);

    switch (indice) {
        case 0:
            backgroundtexture_Zona1 = backgroundtexture;
            break;
        case 1:
            backgroundtexture_Zona2 = backgroundtexture;
            break;
        case 2:
            backgroundtexture_Zona3 = backgroundtexture;
            break;
        case 3:
            backgroundtexture_Zona4 = backgroundtexture;
            break;
        case 4:
            backgroundtexture_Zona5 = backgroundtexture;
            break;
        default:
            return;
    }

    collision = true;
        // removemovementEvents();
    resetMovimientoCamara();
     window.addEventListener("keydown", escribirCanvas);
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
    addmovementEvents();
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
            CrearCanvasTexture(Index_zona);
        }
    }
}


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


export { CreateSceneLuna, animateSceneLunas};


