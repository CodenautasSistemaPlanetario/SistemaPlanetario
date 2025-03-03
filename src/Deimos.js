import * as THREE from 'three';
import { clearZone,CrearSkysphere,CheckBordes,CheckVuelta,CrearZonas,DividirLineas,CheckLlegadaZonas, AcabadoZona } from './FucionesComunesLunas.js';



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


var sceneDeimos,cameraDeimos, renderer;




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

const Text_color =" #ffffff";
const Background_color =" #92c5fc";
var LastY_Global;  
var Can_write = true;
let User_input = "";


//Parametros elección dificultad (Zona 0)
var Difficultad;
var Index_zona;

//Parametros Codigos Interestelares (Zona1)
const canvas_Zona1 = document.createElement("canvas");
const ctx_Zona1 = canvas_Zona1.getContext("2d");
var backgroundtexture_Zona1;
let Lineas_Zona1 = [
    ["🔍 Desafío: Los astronautas quieren mandar un mensaje encriptado, ayudales a cifrar el mensaje antes de mandarlo.",
    "📝 Cifra el codigo sustituyendo la letro por un número donde A = 1, B = 2, C = 3,... Recuerda que el alfabeto español tiene ñ",
    "🤖 Pregunta:¿Como seria el mensaje cifrado si queremos enviar \"espacio\"?"],
    ["🔍 Desafío: Los astronautas quieren mandar un mensaje encriptado, ayudales a cifrar el mensaje antes de mandarlo.",
    "📝 Cifra el codigo sustituyendo la letro por un número, calculado con la siguiente formula: x * 2 +1, donde x es: A = 1, B = 2, C = 3,... Recuerda que el alfabeto español tiene ñ",
    "🤖 Pregunta:¿Como seria el mensaje cifrado si queremos enviar \"espacio\"?"]
];
const titulo_Reto_Zona1 = "🛰 Reto 1: Códigos Interestelares 🧩";
const Correct_answer_Zona1 =["5201713916", "114135371933"];


//Parametros Calculos de combustible (Zona2)
const canvas_Zona2 = document.createElement("canvas");
const ctx_Zona2 = canvas_Zona2.getContext("2d");
var backgroundtexture_Zona2;
let Lineas_Zona2 = [
    ["🔍 Desafío: Los astronautas necesitan calcular el combustible necesario para el viaje de regreso. Si la nave consume 5 litros por minuto de combustible y el viaje de vuelta es de 10 minutos.",
    "🤖 Pregunta: ¿Cuántos litro de combustible consumira la nave?"],
    ["🔍 Desafío: Los astronautas necesitan calcular cuanto tiempo pueden volar para el viaje de regreso. Si la nave consume 8 litros por minuto de combustible y el tanque de la nave es de 240 litros.",
    "🤖 Pregunta: ¿Cuántos minutos de vuelo podrá volar la nave?"]
];
const titulo_Reto_Zona2 = "🛰 Reto 2: Calculos de Combustible ⛽";
const Correct_answer_Zona2 = ["50", "30"];

//Parametros Velcidad de la nave (Zona3)
const canvas_Zona3 = document.createElement("canvas");
const ctx_Zona3 = canvas_Zona3.getContext("2d");
var backgroundtexture_Zona3;
let Lineas_Zona3 = [
    ["🔍 Desafío: Los astronautas necesitan calcular cuanto tiempo van a tardar en llegar a la base. Si la nave viaja a una velocidad de 500 km/h y la estación esta a 1000Km.",
    "🤖 Pregunta: ¿Cuánto tardará la nave en llegar a la base?"],
    ["🔍 Desafío: Los astronautas necesitan calcular cuanto tiempo van a tardar en llegar a la base. Si la nave viaja a 0.01 veces la velocidad de la tierra (100,000 km/s) y la estación esta a 1000km.",
       "🤖 Pregunta: ¿Cuánto tardará la nave en llegar a la base?"]
];
const titulo_Reto_Zona3 = "🛰 Reto 3: Velocidad de la nave 🚀";
const Correct_answer_Zona3 = ["2", "1"];

//Parametros Agujeros de gusano (Zona4)
const canvas_Zona4 = document.createElement("canvas");
const ctx_Zona4 = canvas_Zona4.getContext("2d");
var backgroundtexture_Zona4;
let Lineas_Zona4 = [
    ["🔍 Desafío: Los astronautas necesitan calcular cuanto tiempo de viaje ahorrarian si cruzan un agujero de gusano. Si este agujero acorta el viaje de 100 años luz a solo 10 años luz.",
    "🤖 Pregunta:  ¿Cuánto tiempo ahorrarian los astronautas?"],
    ["🔍 Desafío: Los astronautas necesitan calcular cuanta distancia de viaje ahorrarian si cruzan un agujero de gusano. Si este agujero reduce la distancia 1/20.",
    "🤖 Pregunta:  ¿Cuánta distancia ahorrarían si tienen que hacer un viaje de 200 años luz?"]
    ];
const titulo_Reto_Zona4 = "🛰 Reto 4: Agujeros de Gusano 🌀";
const Correct_answer_Zona4 = ["90", "190"];

//Parametros Area de la estación espacial (Zona5)
const canvas_Zona5 = document.createElement("canvas");
const ctx_Zona5 = canvas_Zona5.getContext("2d");
var backgroundtexture_Zona5;
let Lineas_Zona5 = [
    ["🔍 Desafío: Los astronautas necesitan calcular el area de la estación espacial, para saber cuanto espacio van a tener para aterrizar. Si la base de la estación tiene una anchura de 10 metros y una altura de 5 metros.",
    "🤖 Pregunta:  ¿Cuál es el área de aterrizaje de la estación?"],
    ["🔍 Desafío: Los astronautas necesitan calcular el area de la estación espacial, para saber cuanto espacio van a tener para aterrizar. Si la base de la estación tiene una anchura de 20 metros y una altura de 10 metros, pero hay un area inutilizable de 8 m².",
        "🤖 Pregunta:  ¿Cuál es el área de aterrizaje de la estación?"]
];
const titulo_Reto_Zona5 = "🛰 Reto 5: Area de la estación 🏗";
const Correct_answer_Zona5 = ["50", "192"];



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

    

    CrearSkysphere(sceneDeimos);
    CrearZonas(ZonasJugables,sceneDeimos,Zona0,Zona1,Zona2,Zona3,Zona4,Zona5);
    


    return [sceneDeimos, cameraDeimos];
}

//Geometria


function animateSceneDeimos() {
    
    if(ya_jugado){
        reiniciar();
        ya_jugado = false;
    }

    CheckVuelta(cameraDeimos);
    [collision,Index_zona] = CheckLlegadaZonas(ZonasJugables,cameraDeimos,Zona0,collision);
    CheckBordes(cameraDeimos);
    

    renderer.render(sceneDeimos, cameraDeimos);
}

//Funciones

// function CrearCanvasTexture(indice) {
//     let zona, canvas, ctx, lineas,backgroundtexture,tituloreto;

//     window.removeEventListener("click", onClickOpcionesDeimos);

//     switch (indice) {
//         case 0:
//             zona = Zona1;
//             tituloreto = titulo_Reto_Zona1;
//             canvas = canvas_Zona1;
//             ctx = ctx_Zona1;
//             lineas = Lineas_Zona1[Difficultad];
//             break;
//         case 1:
//             zona = Zona2;
//             tituloreto = titulo_Reto_Zona2;
//             canvas = canvas_Zona2;
//             ctx = ctx_Zona2;
//             lineas = Lineas_Zona2[Difficultad];
//             break;
//         case 2:
//             zona = Zona3;
//             tituloreto = titulo_Reto_Zona3;
//             canvas = canvas_Zona3;
//             ctx = ctx_Zona3;
//             lineas = Lineas_Zona3[Difficultad];
//             break;
//         case 3:
//             zona = Zona4;
//             tituloreto = titulo_Reto_Zona4;
//             canvas = canvas_Zona4;
//             ctx = ctx_Zona4;
//             lineas = Lineas_Zona4[Difficultad];
//             break;
//         case 4:
//             zona = Zona5;
//             tituloreto = titulo_Reto_Zona5;
//             canvas = canvas_Zona5;
//             ctx = ctx_Zona5;
//             lineas = Lineas_Zona5[Difficultad];
//             break;
//         default:
//             return;
//     }

//     clearZone(zona);

//     canvas.width = 1024;
//     canvas.height = 512;

//     ctx.fillStyle = Background_color;
//     ctx.fillRect(0, 0, canvas.width, canvas.height);
//     ctx.fillStyle = Text_color;
//     ctx.font = "50px Arial";
//     ctx.fillText(tituloreto, 10, 50);

//     ctx.font = "30px Arial";
//     let startY = 100;
//     let Height = 35;
//     for (let linea of lineas) {
//         startY += DividirLineas(ctx, linea, 10, startY, canvas.width - 20, Height);
//     }

//     LastY_Global = startY;

//     const backgroundGeometry = new THREE.PlaneGeometry(10, 5);
//     backgroundtexture = new THREE.CanvasTexture(canvas);
//     const backgroundMaterial = new THREE.MeshBasicMaterial({
//         map: backgroundtexture,
//         opacity: 0.8,
//         transparent: true,
//     });

//     const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
//     backgroundMesh.position.set(0, 2, -4);
//     zona.add(backgroundMesh);

//     zona.visible = true;
//     const pos_global = new THREE.Vector3();
//     zona.children[0].getWorldPosition(pos_global);
//     cameraDeimos.lookAt(pos_global);
//     sceneDeimos.add(zona);

//     switch (indice) {
//         case 0:
//             backgroundtexture_Zona1 = backgroundtexture;
//             break;
//         case 1:
//             backgroundtexture_Zona2 = backgroundtexture;
//             break;
//         case 2:
//             backgroundtexture_Zona3 = backgroundtexture;
//             break;
//         case 3:
//             backgroundtexture_Zona4 = backgroundtexture;
//             break;
//         case 4:
//             backgroundtexture_Zona5 = backgroundtexture;
//             break;
//         default:
//             return;
//     }

//     collision = true;
//     window.addEventListener("keydown", escribirCanvas);
// }


// //Eventos
// export function onClickOpcionesDeimos(event){
//     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//     raycaster.setFromCamera(mouse, cameraDeimos);

//     const intersects = raycaster.intersectObjects(Zona0.children, true);
//     if (intersects.length > 0) {
//         const clickedButton = intersects[0].object;
//         if (clickedButton.userData.index !== undefined) {
//             Difficultad = clickedButton.userData.index;
//             Zona0.visible = false;
//             CrearCanvasTexture(Index_zona);
//         }
//     }
// }


// function escribirCanvas(event) {
//     let correcto = null;
//     let texto_check = "";
//     let color_check = "";

//     let local_canvas;
//     let local_ctx;
//     let local_texture

//     switch (Index_zona) {
//         case 0:
//             local_canvas = canvas_Zona1;
//             local_ctx = ctx_Zona1;
//             local_texture = backgroundtexture_Zona1;
//             break;
//         case 1:
//             local_canvas = canvas_Zona2;
//             local_ctx = ctx_Zona2;
//             local_texture = backgroundtexture_Zona2;
//             break;
//         case 2:
//             local_canvas = canvas_Zona3;
//             local_ctx = ctx_Zona3;
//             local_texture = backgroundtexture_Zona3;
//             break;
//         case 3:
//             local_canvas = canvas_Zona4;
//             local_ctx = ctx_Zona4;
//             local_texture = backgroundtexture_Zona4;
//             break;
//         case 4:
//             local_canvas = canvas_Zona5;
//             local_ctx = ctx_Zona5;
//             local_texture = backgroundtexture_Zona5;
//             break;
//         default:
//             return;
//     }

//     if (!Can_write) {
//         return;
//     }

//     if (event.key === "Backspace") {
//         User_input = User_input.slice(0, -1);
//         texto_check = "";
//     } else if (event.key.length === 1) {
//         User_input += event.key;
//         texto_check = "";
//     } else if (event.key === "Enter") {
//         correcto = checkAnswer(User_input);
//         User_input = "";
//         if (correcto) {
//             texto_check = "Correcto";
//             color_check = "#00ff00";
//         } else if (!correcto) {
//             texto_check = "Incorrecto";
//             color_check = "#ff0000";
//         }
//     }

    

   
//     const espacio_disponible = local_canvas.height - LastY_Global;
//     local_ctx.fillStyle = Background_color;
//     local_ctx.fillRect(250, LastY_Global, local_canvas.width - 500, espacio_disponible);
   

//     local_ctx.fillStyle = Text_color;


//     let userinput_width = local_ctx.measureText(User_input).width;
//     let userinput_x = (local_canvas.width - userinput_width) / 2;
//     let userinput_y = LastY_Global + (espacio_disponible / 4);
//     local_ctx.fillText(User_input, userinput_x, userinput_y);

//     if (correcto != null) {
//         local_ctx.fillStyle = color_check;
//         let texto_width = local_ctx.measureText(texto_check).width;
//         let texto_x = (local_canvas.width - texto_width) / 2;
//         local_ctx.fillText(texto_check, texto_x, userinput_y);
//         setTimeout(() => {
//             texto_check = "";
//             color_check = "";
//             local_ctx.fillStyle = Background_color;
//             local_ctx.fillRect(250, LastY_Global, local_canvas.width - 500, 90);
//             local_texture.needsUpdate = true;
//         }, 2000);
//     }

//     local_texture.needsUpdate = true;
// }

// function checkAnswer(letter) {
//     let correcto = false;
//     let local_correct_answer = "";
//     switch(Index_zona){
//         case 0:
//             local_correct_answer = Correct_answer_Zona1[Difficultad];
//             break;
//         case 1:
//             local_correct_answer = Correct_answer_Zona2[Difficultad];
//             break;
//         case 2:
//             local_correct_answer = Correct_answer_Zona3[Difficultad];
//             break;
//         case 3:
//             local_correct_answer = Correct_answer_Zona4[Difficultad];
//             break;
//         case 4:
//             local_correct_answer = Correct_answer_Zona5[Difficultad];
//             break;
//     }

//     if (letter === local_correct_answer) {
//         Can_write = false; // Bloquear clics temporalmente
//         correcto = true;
//         setTimeout(() => {
//             Can_write = true; // Reactivar clics después de 2 segundos
//             collision = AcabadoZona(Zona1,Zona2,Zona3,Zona4,Zona5);
//         }, 2000);
//     } else {
//         Can_write = false; // Bloquear clics temporalmente
//         correcto = false;
//         setTimeout(() => {
//             Can_write = true;
//         }, 2000);
//     }

//     return correcto;
// }


export{CreateSceneDeimos, animateSceneDeimos};