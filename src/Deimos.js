import * as THREE from 'three';
import { CrearSkysphere,CheckBordes,CheckVuelta,CrearZonas,CrearCanvasTexture,CheckLlegadaZonas,reiniciar,CrearFlechaVuelta,AnimateCono } from './FucionesComunesLunas.js';
import { manager } from './LoadingManager.js';

//Texturas
const TextureLoader = new THREE.TextureLoader(manager);
const Groundpath = "./img/Lunas/Gravel009_1K-JPG_";
const Land_texture_albedo = TextureLoader.load(Groundpath + "ColorDeimos.jpg");
const Land_texture_normal = TextureLoader.load(Groundpath + "Normal.jpg");
const Land_texture_roughness = TextureLoader.load(Groundpath + "Roughness.jpg");
const Land_texture_ao = TextureLoader.load(Groundpath + "AmbientOcclusion.jpg");
const Land_texture_height = TextureLoader.load(Groundpath + "Displacement.jpg");

//Variables
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


var sceneDeimos,cameraDeimos, renderer;

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
var Difficultad;

//Parametros Codigos Interestelares (Zona1)
export const ZonaParamsDeimos = [
    {
        zona: Zona1,
        canvas: document.createElement("canvas"),
        ctx: null,
        backgroundtexture: null,
        Lineas: [
            ["🔍 Desafío: Los astronautas quieren mandar un mensaje encriptado, ayudales a cifrar el mensaje antes de mandarlo.",
            "📝 Cifra el codigo sustituyendo la letro por un número donde A = 1, B = 2, C = 3,... Recuerda que el alfabeto español tiene ñ",
            "🤖 Pregunta:¿Como seria el mensaje cifrado si queremos enviar \"espacio\"?"],
            ["🔍 Desafío: Los astronautas quieren mandar un mensaje encriptado, ayudales a cifrar el mensaje antes de mandarlo.",
            "📝 Cifra el codigo sustituyendo la letro por un número, calculado con la siguiente formula: x * 2 +1, donde x es: A = 1, B = 2, C = 3,... Recuerda que el alfabeto español tiene ñ",
            "🤖 Pregunta:¿Como seria el mensaje cifrado si queremos enviar \"espacio\"?"]
        ],
        titulo: "🛰 Reto 1: Códigos Interestelares 🧩",
        Correct_answer: ["5201713916", "114135371933"]
    },
     {
        zona: Zona2,
        canvas: document.createElement("canvas"),
        ctx: null,
        backgroundtexture: null,
        Lineas: [
            ["🔍 Desafío: Los astronautas necesitan calcular el combustible necesario para el viaje de regreso. Si la nave consume 5 litros por minuto de combustible y el viaje de vuelta es de 10 minutos.",
            "🤖 Pregunta: ¿Cuántos litro de combustible consumira la nave?"],
            ["🔍 Desafío: Los astronautas necesitan calcular cuanto tiempo pueden volar para el viaje de regreso. Si la nave consume 8 litros por minuto de combustible y el tanque de la nave es de 240 litros.",
            "🤖 Pregunta: ¿Cuántos minutos de vuelo podrá volar la nave?"]
        ],
        titulo: "🛰 Reto 2: Calculos de Combustible ⛽",
        Correct_answer: ["50", "30"]
    },
     {
        zona: Zona3,
        canvas: document.createElement("canvas"),
        ctx:  null,
        backgroundtexture: null,
        Lineas: [
            ["🔍 Desafío: Los astronautas necesitan calcular cuanto tiempo van a tardar en llegar a la base. Si la nave viaja a una velocidad de 500 km/h y la estación esta a 1000Km.",
            "🤖 Pregunta: ¿Cuánto tardará la nave en llegar a la base?"],
            ["🔍 Desafío: Los astronautas necesitan calcular cuanto tiempo van a tardar en llegar a la base. Si la nave viaja a 0.01 veces la velocidad de la tierra (100,000 km/s) y la estación esta a 1000km.",
            "🤖 Pregunta: ¿Cuánto tardará la nave en llegar a la base?"]
        ],
        titulo: "🛰 Reto 3: Velocidad de la nave 🚀",
        Correct_answer: ["2", "1"]
    },
     {
        zona: Zona4,
        canvas: document.createElement("canvas"),
        ctx: null,
        backgroundtexture: null,
        Lineas: [
            ["🔍 Desafío: Los astronautas necesitan calcular cuanto tiempo de viaje ahorrarian si cruzan un agujero de gusano. Si este agujero acorta el viaje de 100 años luz a solo 10 años luz.",
            "🤖 Pregunta:  ¿Cuánto tiempo ahorrarian los astronautas?"],
            ["🔍 Desafío: Los astronautas necesitan calcular cuanta distancia de viaje ahorrarian si cruzan un agujero de gusano. Si este agujero reduce la distancia 1/20.",
            "🤖 Pregunta:  ¿Cuánta distancia ahorrarían si tienen que hacer un viaje de 200 años luz?"]
        ],
        titulo: "🛰 Reto 4: Agujeros de Gusano 🌀",
        Correct_answer: ["90", "190"]
    },
    {
        zona: Zona5,
        canvas: document.createElement("canvas"),
        ctx:  null,
        backgroundtexture: null,
        Lineas: [
            ["🔍 Desafío: Los astronautas necesitan calcular el area de la estación espacial, para saber cuanto espacio van a tener para aterrizar. Si la base de la estación tiene una anchura de 10 metros y una altura de 5 metros.",
            "🤖 Pregunta:  ¿Cuál es el área de aterrizaje de la estación?"],
            ["🔍 Desafío: Los astronautas necesitan calcular el area de la estación espacial, para saber cuanto espacio van a tener para aterrizar. Si la base de la estación tiene una anchura de 20 metros y una altura de 10 metros, pero hay un area inutilizable de 8 m².",
            "🤖 Pregunta:  ¿Cuál es el área de aterrizaje de la estación?"]
        ],
        titulo: "🛰 Reto 5: Area de la estación 🏗",
        Correct_answer: ["50", "192"]
    }
];

// Initialize contexts
Object.keys(ZonaParamsDeimos).forEach(key => {
    ZonaParamsDeimos[key].ctx = ZonaParamsDeimos[key].canvas.getContext("2d");
});



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
    CrearFlechaVuelta(sceneDeimos,"Deimos");



    // Cámara
    cameraDeimos.position.set(0, 2, 0);

    

    CrearSkysphere(sceneDeimos);
    CrearZonas(ZonasJugables,sceneDeimos,Zona0,Zona1,Zona2,Zona3,Zona4,Zona5);
    


    return [sceneDeimos, cameraDeimos];
}

//Geometria


function animateSceneDeimos() {
    
    if(ya_jugado){
        reiniciar(cameraDeimos,Zona0);
        ya_jugado = false;
    }

    CheckVuelta(cameraDeimos);
    
    CheckLlegadaZonas(ZonasJugables,cameraDeimos,Zona0);
    CheckBordes(cameraDeimos);
    AnimateCono();

    renderer.render(sceneDeimos, cameraDeimos);
}

//Funciones




// //Eventos
export function onClickOpcionesDeimos(event){
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, cameraDeimos);

    const intersects = raycaster.intersectObjects(Zona0.children, true);
    if (intersects.length > 0) {
        const clickedButton = intersects[0].object;
        if (clickedButton.userData.index !== undefined) {
            Difficultad = clickedButton.userData.index;
            Zona0.visible = false;
            CrearCanvasTexture(sceneDeimos,cameraDeimos,Difficultad);
        }
    }
}


export{CreateSceneDeimos, animateSceneDeimos};