import * as THREE from 'three';
import { clearZone,CrearSkysphere,CheckBordes,CheckVuelta,CrearZonas,DividirLineas,CheckLlegadaZonas ,CrearCanvasTexture,CrearFlechaVuelta,AnimateCono} from './FucionesComunesLunas.js';
import {addmovementEvents} from '../Controlador.js';

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


var scenePhobos,cameraPhobos, renderer;



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



//Parametros elección dificultad (Zona 0)

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
export const ZonaParamsPhobos = [
    { zona: null, canvas: null, ctx: null, backgroundtexture: null, Lineas: [], titulo: "", Correct_answer: [] },
    { zona: null, canvas: null, ctx: null, backgroundtexture: null, Lineas: [], titulo: "", Correct_answer: [] },
    {
        zona: Zona3,
        canvas: document.createElement("canvas"),
        ctx: null,
        backgroundtexture: null,
        Lineas: [
            ["🔍 Desafío: Los alienígenas han dejado un mensaje encriptado. Descifra el código y descubre el mensaje oculto.",
                "Mensaje encriptado de los aliens: aloh sonamuh, somos sol rahtyn"],
            ["🔍 Desafío: Los alienígenas han dejado un mensaje encriptado. Descifra el código y descubre el mensaje oculto.",
                "Mensaje encriptado de los aliens: mpt ñzuibs ibñ ftubep brvj"]
        ],
        titulo: "👽 Reto 3: Código de los Alienigenas",
        Correct_answer: ["hola humanos, somos los nythar", "los nythar han estado aqui"]
    },
    {
        zona: Zona4,
        canvas: document.createElement("canvas"),
        ctx: null,
        backgroundtexture: null,
        Lineas: [
            ["Los astronautas tienen que visitar los planetas del sistema solar en el orden correcto para encontrar la salida.",
                "🔍 Desafío: Ordena los planetas desde más cercano al Sol hasta el más lejano. Escribelo con el siguiente formato: x-x-x",
                "📝 Planetas desordenados: Venus - Mercurio - Júpiter"],
            ["Los astronautas tienen que visitar los planetas del sistema solar en el orden correcto para encontrar la salida.",
                "🔍 Desafío: Ordena los planetas desde más cercano al Sol hasta el más lejano. Escribelo con el siguiente formato: x-x-x",
                "📝 Planetas desordenados: Venus - Marte - Mercurio - Saturno - Júpiter"]
        ],
        titulo: "🔭 Reto 4: El Enigma de los Planetas",
        Correct_answer: ["mercurio-venus-jupiter", "mercurio-venus-marte-jupiter-saturno"]
    },
    {
        zona: Zona5,
        canvas: document.createElement("canvas"),
        ctx: null,
        backgroundtexture: null,
        Lineas: [
            ["Los astronautas están explorando la galaxia nebuloria y se han encontrado un planeta desconocido, que no saben si explorar o no.",
                "🔍 Desafío: descubre qué planeta es el que se han encontrado los astronautas.",
                "📝 Descripción del planeta: es un planeta azul y verde con un clima extremo donde existe una neblina constante en la superficie.",
                "🤖 Pregunta: ¿Qué planeta es este, basándote en las pistas dadas?"],
            ["Los astronautas están explorando la galaxia nebuloria y se han encontrado un planeta desconocido, que no saben si explorar o no.",
                "🔍 Desafío: descubre qué planeta es el que se han encontrado los astronautas.",
                "📝 Descripción del planeta: es un planeta con temperaturas extremas: 45 grados por la mañana y -10 por la noche y una presión atmosférica de 0.9 veces la de la Tierra",
                "🤖 Pregunta: ¿Qué planeta es este, basándote en las pistas dadas?"]
        ],
        titulo: "🔭 Reto 5: El Enigma de los Planetas",
        Correct_answer: ["nymboria", "nymboria"]
    }
];

// Initialize contexts
Object.keys(ZonaParamsPhobos).forEach(key => {
    if(ZonaParamsPhobos[key].canvas){
        ZonaParamsPhobos[key].ctx = ZonaParamsPhobos[key].canvas.getContext("2d");
    }
});

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
    CrearFlechaVuelta(scenePhobos);



    // Cámara
    cameraPhobos.position.set(0, 2, 0);

    
    CrearSkysphere(scenePhobos);
    CrearZonas(ZonasJugables,scenePhobos,Zona0,Zona1,Zona2,Zona3,Zona4,Zona5);
    


    return [scenePhobos, cameraPhobos];
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


}



function animateScenePhobos() {
    
    if(ya_jugado){
        reiniciar();
        ya_jugado = false;
    }


    ya_jugado = CheckVuelta(cameraPhobos);
    CheckLlegadaZonas(ZonasJugables,cameraPhobos,Zona0);
    CheckBordes(cameraPhobos);
    AnimateCono();

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


function CargarZonas(index){
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
        case 3:
        case 4:
            CrearCanvasTexture(scenePhobos,cameraPhobos,Difficultad);
            break;
        default:
            return;
    }

    window.removeEventListener("click", onClickOpcionesPhobos);
    
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
            addmovementEvents();
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
    addmovementEvents();
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


//Eventos
export function onClickOpcionesPhobos(event, index){
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, cameraPhobos);

    const intersects = raycaster.intersectObjects(Zona0.children, true);
    if (intersects.length > 0) {
        const clickedButton = intersects[0].object;
        if (clickedButton.userData.index !== undefined) {
            Difficultad = clickedButton.userData.index;
            Zona0.visible = false;
            Index_zona = index;
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

        const click = new THREE.Vector2(canvasX, canvasY);
        Simbolos_Zona2.forEach((simbolo, index) => {
            const simbolo_pos = new THREE.Vector2(pos_simbolos[index][0], pos_simbolos[index][1]);
            const distance = click.distanceTo(simbolo_pos);
            
            if(distance <= distancia_click){
                Secuencia_Input.push(index);
                animarSimbolo(index);
                
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




export {CreateScenePhobos, animateScenePhobos};