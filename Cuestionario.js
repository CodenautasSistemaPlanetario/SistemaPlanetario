import * as THREE from 'three';
import { FontLoader } from 'https://unpkg.com/three@latest/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://unpkg.com/three@latest/examples/jsm/geometries/TextGeometry.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/controls/OrbitControls.js';

var scene, camera, renderer, controls;


const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


const Fontloader = new FontLoader();
const TextureLoader = new THREE.CubeTextureLoader();

//Preguntas y respuestas
const cuestions = [
    'En Aquaterra vive una especie llamada...',
    'Los Aquarians',
    'Los Aquarians es una sociedad basada en la cooperación y la conservación del medio ambiente marino.',
    'La temperatura de Aquaterra ronda los...',
    'En los arrecifes de coral de Aquaterra podemos encontrar...',
    'La atmosfera de Aquaterra esta compuesta de oxígeno y nitrógeno, similar a la tierra',
    'En el abismo profundo podemos descubrir...',
    'La ciudad submarina es...',
    'En la cueva de los secretos...',
    'En el santuario de los cetáceos'
];
const answers=[
    ['Pulparians','Aquarians','Tiburonions','Pecerians'],
    ['Son seres anfibios adaptados a la vida marina','Son mitad pulpo mitad robot','Son humanos que siempre van en bañador','Son microorganismos como algas'],
    ['',''],
    ['','','',''],
    ['','','',''],
    ['',''],
    ['','','',''],
    ['','','',''],
    ['','','',''],
    ['','','','']
]
const correctAnswer =[
    1,
    0,
    0,
    3,
    1,
    0,
    3,
    0,
    1,
    0
]

var cuestionIndex = 0;
var points = 0;
var QuizElements = [];

init();
animate();
function init(){

    //Configuración elementos de la escena
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    camera.position.z = 5;

    
    //Controles de la cámara
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;


    //Configuración de la luz
    //light();

    CrearSkysphere();
    CargarPregunta();

}

// function light() {
//     const light = new THREE.PointLight(0xffffff, 2, 100);
//     light.position.set(0, 0, 0);
//     scene.add(light);
//     const ambientLight = new THREE.AmbientLight(0x333333);
//     scene.add(ambientLight);
// }

function CrearSkysphere(){
    TextureLoader.setPath('./img/');
    const texture = TextureLoader.load([
        'px.png', 'nx.png', 
        'py.png', 'ny.png', 
        'pz.png', 'nz.png']);

    scene.background = texture;
}

function CreatePregunta(cuestion){
    Fontloader.load('./ArcaneNine_Regular.json', function (font) {
        const textGeometry = new TextGeometry(cuestion, {
            font: font,
            size: 0.3, // Ajustar tamaño para evitar estiramiento
            height: 0.05,
            curveSegments: 12,
            depth: 0.05,
            bevelEnabled: false   
        }, undefined, undefined, { generateMipmaps: false });
    
        textGeometry.computeBoundingBox();
        textGeometry.center();

        const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    
        var textMesh = new THREE.Mesh( textGeometry, textMaterial );
        textMesh.position.set(0, 2, 0 );
        
        scene.add( textMesh );
        QuizElements.push(textMesh);
    
    });
}

function CreateRespuestas(options){
    options.forEach((option, index) => {
        const geometry = new THREE.BoxGeometry(6, 0.5, 0.1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const button = new THREE.Mesh(geometry, material);
        
        button.position.set( 0,1-index, 0);
        button.userData = { index }; // Guardar el índice de la opción
        scene.add(button);
        QuizElements.push(button);
    
        
        Fontloader.load('./ArcaneNine_Regular.json', function (font) {
            const textGeometry = new TextGeometry(option, {
                font: font,
                size: 0.2,
                height: 0.02,
                depth: 0.02,
            });
    
            textGeometry.computeBoundingBox();
            textGeometry.center(); // Centrar texto correctamente
    
            const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.position.set(button.position.x, button.position.y, button.position.z + 0.06);
            QuizElements.push(textMesh);
            scene.add(textMesh);
        });
    });
}

function CargarPregunta(){
    QuizElements.forEach((element) => {
        scene.remove(element);
    });

    CreatePregunta(cuestions[cuestionIndex]);
    CreateRespuestas(answers[cuestionIndex]);
}


function CargarResultado(){
    QuizElements.forEach((element) => {
        scene.remove(element);
    });

    Fontloader.load('./ArcaneNine_Regular.json', function (font) {
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

        const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    
        var textMesh = new THREE.Mesh( textGeometry, textMaterial );
        textMesh.position.set(0, 1, 0 );
        
        scene.add( textMesh );
    
    });

    const geometry = new THREE.BoxGeometry(6, 2, 0.1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const button = new THREE.Mesh(geometry, material);
        
        button.position.set( 0,2, 0);
        scene.add(button);


}

function CargarSiguientePregunta(){
    cuestionIndex++;
    if(cuestionIndex >= cuestions.length){
        CargarResultado();
    }else if(cuestionIndex < cuestions.length){
        CargarPregunta();
    }
}

window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
        const clickedButton = intersects[0].object;
        if (clickedButton.userData.index !== undefined) {
            if (clickedButton.userData.index === correctAnswer[cuestionIndex]) {
                points++;
                console.log('Correcto');
            }
            CargarSiguientePregunta();
        }
    }

});


function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}


// 📏 Ajustar tamaño en caso de cambio de ventana
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
