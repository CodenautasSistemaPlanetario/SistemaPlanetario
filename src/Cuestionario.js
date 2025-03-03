import * as THREE from 'three';
import { FontLoader } from 'https://unpkg.com/three@latest/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://unpkg.com/three@latest/examples/jsm/geometries/TextGeometry.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/controls/OrbitControls.js';
import { changeScene } from '../Controlador.js';
import { Preguntas_AquaTerra,Preguntas_Alcyon,Preguntas_Ignis,Preguntas_Mechanon,Preguntas_Nymboria,Preguntas_Zephyria } from './Preguntas.js';

var sceneCuestions, cameraCuestions,renderer, controls;


const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


const Fontloader = new FontLoader();
const TextureLoader = new THREE.CubeTextureLoader();

var alreadypladed = false;


let Preguntas =[];
var cuestionIndex = 0;
var points = 0;
var QuizElements = [];

//Configuración visual del cuestionario
const basicPath = './img/';
const FontName = './font/ArcaneNine_Regular.json';
//Parametros letras Preguntas
const FontColorCuestions = 0xEBEBD3;
const FontSizeCuestions = 0.3;
const FontHeightCuestions = 0.05;
const FontCurveSegmentsCuestions = 12;
const FontDepthCuestions = 0.03;
//Paremtros letras respuestas
const FontColorAnswers = 0xffffff;
const FontSizeAnswers = 0.2;
const FontHeightAnswers = 0.02;
const FontCurveSegmentsAnswers = 12;
const FontDepthAnswers = 0.02;
var ButtonColorAnswers = 0x007BFF;

function CreateSceneCuestions(globalrenderer){

    //Configuración elementos de la escena
    sceneCuestions = new THREE.Scene();
    cameraCuestions = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 2, 1000);
    cameraCuestions.position.z = -5;
    cameraCuestions.rotateY(Math.PI);

    renderer = globalrenderer;
    
    //Controles de la cámara
    controls = new OrbitControls(cameraCuestions, renderer.domElement);
    controls.enableDamping = true;

    

    return [sceneCuestions,cameraCuestions];
}


function CrearSkysphere(){  
    const texture = TextureLoader.load([
        'px.png', // Positivo en X (derecha)
        'nx.png', // Negativo en X (izquierda)
        'py.png', // Positivo en Y (arriba)
        'ny.png', // Negativo en Y (abajo)
        'pz.png', // Positivo en Z (frente)
        'nz.png'  // Negativo en Z (atrás)
    ]);

        sceneCuestions.background = texture;
}

function CreatePregunta(cuestion){
    Fontloader.load(FontName, function (font) {
        const textGeometry = new TextGeometry(cuestion, {
            font: font,
            size: FontSizeCuestions,
            height: FontHeightCuestions,
            curveSegments: FontCurveSegmentsCuestions,
            depth: FontDepthCuestions,
            bevelEnabled: false   
        }, undefined, undefined, { generateMipmaps: false });
    
        textGeometry.computeBoundingBox();
        textGeometry.center();

        const textMaterial = new THREE.MeshBasicMaterial({ color: FontColorCuestions });
    
        var textMesh = new THREE.Mesh( textGeometry, textMaterial );
        textMesh.position.set(0, 2, 0 );
        textMesh.rotation.y = Math.PI;
        
        sceneCuestions.add( textMesh );
        QuizElements.push(textMesh);
    
    });
}

function CreateRespuestas(options){
    options.forEach((option, index) => {
        const geometry = new THREE.BoxGeometry(10, 0.5, 0.1);
        const material = new THREE.MeshBasicMaterial({ color: ButtonColorAnswers });
        const button = new THREE.Mesh(geometry, material);
        
        button.position.set( 0,1-index, 0);
        button.rotation.y = Math.PI;
        button.userData = { index }; // Guardar el índice de la opción
        sceneCuestions.add(button);
        QuizElements.push(button);
    
        
        Fontloader.load(FontName, function (font) {
            const textGeometry = new TextGeometry(option, {
                font: font,
                size: FontSizeAnswers, 
                height: FontHeightAnswers,
                depth: FontDepthAnswers,
                curveSegments: FontCurveSegmentsAnswers,
                bevelEnabled: false
            });
    
            textGeometry.computeBoundingBox();
            textGeometry.center(); // Centrar texto correctamente
    
            const textMaterial = new THREE.MeshBasicMaterial({ color:FontColorAnswers });
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.position.set(button.position.x, button.position.y, button.position.z - 0.06);
            textMesh.rotation.y = Math.PI;
            QuizElements.push(textMesh);
            sceneCuestions.add(textMesh);
        });
    });
}

function CargarPregunta(){
    QuizElements.forEach((element) => {
        sceneCuestions.remove(element);
    });

    CreatePregunta(Preguntas[cuestionIndex][0]);
    CreateRespuestas(Preguntas[cuestionIndex][1]);
}


function CargarResultado(){
    QuizElements.forEach((element) => {
        sceneCuestions.remove(element);
    });

    // Mostrar puntuación
    Fontloader.load(FontName, function (font) {
        const textGeometry = new TextGeometry('Tu puntuación es: ' + points, {
            font: font,
            size: 0.6, // Ajustar tamaño para evitar estiramiento
            height: 0.05,
            curveSegments: 12,
            depth: 0.05,
            bevelEnabled: false   
        }, undefined, undefined, { generateMipmaps: false });
    
        textGeometry.computeBoundingBox();
        textGeometry.center();

        const textMaterial = new THREE.MeshBasicMaterial({ color: FontColorAnswers });
    
        var textMesh = new THREE.Mesh( textGeometry, textMaterial );
        textMesh.position.set(0, 1, 0 );
        textMesh.rotation.y = Math.PI;
        
        sceneCuestions.add( textMesh );
        QuizElements.push(textMesh);
    
    });
    
    // Botón para volver a la escena de los planetas
    const geometry = new THREE.BoxGeometry(6, -1, 0.1);
    const material = new THREE.MeshBasicMaterial({ color: ButtonColorAnswers });
    const button = new THREE.Mesh(geometry, material);
    button.position.set( 0,-2, 0);
    button.rotation.y = Math.PI;
    button.userData = { index: 4 }; // Guardar el índice de la opción    
    QuizElements.push(button);

    // Texto del botón
    Fontloader.load(FontName, function (font) {
        const textGeometry = new TextGeometry("Volver a Nebuloria", {
            font: font,
            size: 0.3, // Ajustar tamaño para evitar estiramiento
            height: 0.05,
            curveSegments: 12,
            depth: 0.05,
            bevelEnabled: false   
        }, undefined, undefined, { generateMipmaps: false });
    
        textGeometry.computeBoundingBox();
        textGeometry.center();

        const textMaterial = new THREE.MeshBasicMaterial({ color: FontColorAnswers });
    
        var textMesh = new THREE.Mesh( textGeometry, textMaterial );
        textMesh.position.set(button.position.x, button.position.y, button.position.z + 0.06);
        textMesh.rotation.y = Math.PI;
        
        sceneCuestions.add( textMesh );
        
        QuizElements.push(textMesh);
    
    });
       
   
    sceneCuestions.add(button);


}

function LoadArrayPreguntas(planetname){
    let path = basicPath;

    switch(planetname){
        case "AquaTerra":
            Preguntas = Preguntas_AquaTerra;
            path += "AquaTerra/";
            ButtonColorAnswers = 0X4A90E2;
            break;
        case "Zephyria":
            Preguntas = Preguntas_Zephyria;
            path += "Zephyria/";
            ButtonColorAnswers = 0x28A745;
            break;
        case "Nymboria":
            Preguntas = Preguntas_Nymboria;
            path += "Nymboria/";
            ButtonColorAnswers =0x007BFF;
            break;
        case "Mechanon":
            Preguntas = Preguntas_Mechanon;
            path += "Mechanon/";
            ButtonColorAnswers = 0xFFA500;
            break;
        case "Ignis":
            Preguntas = Preguntas_Ignis;
            path += "Ignis/";
            ButtonColorAnswers = 0xE63946;
            break;
        case "Alcyon":
            Preguntas = Preguntas_Alcyon;
            path += "Alcyon/";
            ButtonColorAnswers = 0x6F42C1;
            break;
    }
    
    
    if(alreadypladed)
    {
        alreadypladed = false;
        rebootScene();
        CargarPregunta();
    } else {
        CargarPregunta();
    }
    TextureLoader.setPath(path);
    CrearSkysphere();
}

function CargarSiguientePregunta(){
    cuestionIndex++;
    if(cuestionIndex >= Preguntas.length){
        CargarResultado();
    }else if(cuestionIndex < Preguntas.length){
        CargarPregunta();
    }
}


function rebootScene(){
    cuestionIndex = 0;
    points = 0;
    QuizElements.forEach((element) => {
        sceneCuestions.remove(element);
    });
}

function animateSceneCuestions() {
    
    controls.update();
    renderer.render(sceneCuestions, cameraCuestions);
}

function addEventsCuestions(){
    window.addEventListener('click', onClick);
    window.addEventListener('resize', resize);
}
function removeEventsCuestions(){
    window.removeEventListener('click', onClick);
    window.removeEventListener('resize', resize);
}


function onClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, cameraCuestions);

    const intersects = raycaster.intersectObjects(sceneCuestions.children, true);
    if (intersects.length > 0) {
        const clickedButton = intersects[0].object;
        if (clickedButton.userData.index !== undefined) {
            if (cuestionIndex < Preguntas.length && clickedButton.userData.index === Preguntas[cuestionIndex][2]) {
                points++;
            }
            if(clickedButton.userData.index === 4){
                alreadypladed = true;
                changeScene("scenePlanets");
            }
            CargarSiguientePregunta();
        }
    }

};


// 📏 Ajustar tamaño en caso de cambio de ventana
function resize(event) {
    cameraCuestions.aspect = window.innerWidth / window.innerHeight;
    cameraCuestions.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
};


export {CreateSceneCuestions,animateSceneCuestions,addEventsCuestions,removeEventsCuestions,LoadArrayPreguntas };