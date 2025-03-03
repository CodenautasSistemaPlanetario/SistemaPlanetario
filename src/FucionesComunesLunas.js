import * as THREE from 'three';
import { changeScene,removemovementEvents,resetMovimientoCamara } from '../Controlador.js';
import { FontLoader } from 'https://unpkg.com/three@latest/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://unpkg.com/three@latest/examples/jsm/geometries/TextGeometry.js';
import {onClickOpcionesPhobos } from './Phobos.js';
import { onClickOpcionesDeimos } from './Deimos.js';
import { onClickOpcionesLuna } from './Luna.js';

const path = "./img/Stars/";
const TextureCubeLoader = new THREE.CubeTextureLoader();

var empieza_moverse = false;

//Parametros Zona 0
const Opciones = ["Fácil", "Difícil"];
const Button_Color= 0x0000ff;
const FontSizeOpciones = 0.5;
const FontHeightOpciones = 0.1;
const FontDepthOpciones = 0.01;
const FontColorOpciones = 0xffffff;
const Texto_Zona0 = "Elige la dificultad del reto:";
const Fontloader = new FontLoader();
const FontName = './font/Roboto_Regular.json';


const Zone_box_color = 0xff0000;
var lunaActiva ="";
let Index_zona = -1;


const dist_colision_zonas = 1.5;

export function clearZone(zone) {
    for (let i = zone.children.length - 1; i >= 0; i--) {
        let obj = zone.children[i];
        if (obj.isMesh) {
            zone.remove(obj);
            obj.geometry.dispose();
            obj.material.dispose();
        }
    }
}

export function CrearSkysphere(scene){  
    TextureCubeLoader.setPath(path);
    const texture = TextureCubeLoader.load([
        'px.jpg', // Positivo en X (derecha)
        'nx.jpg', // Negativo en X (izquierda)
        'py.jpg', // Positivo en Y (arriba)
        'ny.jpg', // Negativo en Y (abajo)
        'pz.jpg', // Positivo en Z (frente)
        'nz.jpg'  // Negativo en Z (atrás)
    ]);

        scene.background = texture;
}

export function CheckBordes(camera){
    if(camera.position.x >= 30){
        camera.position.x = 19.9;
    }
    if(camera.position.x <= -30){
        camera.position.x = -19.9;
    }
    if(camera.position.z >= 30){
        camera.position.z = 19.9;
    }
    if(camera.position.z <= -30){
        camera.position.z = -19.9;
    }
}

export function CheckVuelta(camara){
    const pos_zona_elevada = new THREE.Vector3(0, camara.position.y, 0);
    const distance = camara.position.distanceTo(pos_zona_elevada);

    if(!empieza_moverse && distance >= 1.3){
        empieza_moverse = true;
    } else if(empieza_moverse && distance <= 1){
        ya_jugado = true;
        changeScene("scenePlanets");
        empieza_moverse = false;
    }
}

export function CheckLlegadaZonas(ZonasJugables, camera, Zona0, collision) {
    

    if (!collision) {
        for (let index = 0; index < ZonasJugables.length; index++) {
            const zona = ZonasJugables[index];
            const pos_zona_elevada = new THREE.Vector3(zona.x, camera.position.y, zona.z);
            const distance = camera.position.distanceTo(pos_zona_elevada);

            if (distance <= dist_colision_zonas) {
                Index_zona = index;
                collision = CargarZona0(Zona0, zona, camera);
                break; // Salimos del bucle al encontrar la primera colisión
            }
        }
    }

    return [collision, Index_zona];
}


function CrearZona0(Zona0,scene) {
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
    scene.add(Zona0);
    return Zona0;
}

export function CrearZonas(ZonasJugables,scene,Zona0,Zona1,Zona2,Zona3,Zona4,Zona5){
    CrearZona0(Zona0,scene);   
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
        scene.add(cube);
    });
}

export function setLunaActiva(luna){
    lunaActiva = luna;
}

function CargarZona0(Zona0,position,camera){
   
    Zona0.position.set(position.x, position.y, position.z);
    Zona0.visible = true;
    const pos_global = new THREE.Vector3();
    Zona0.children[0].getWorldPosition(pos_global);
    
    camera.position.set(Zona0.position.x, 2, Zona0.position.z);
    camera.lookAt(pos_global);

    
    removemovementEvents();
    resetMovimientoCamara();

    switch(lunaActiva)
    {
        case "phobos":
            window.addEventListener("click",onClickOpcionesPhobos);
            break;
        case "deimos":
            window.addEventListener("click",onClickOpcionesDeimos);
            break;
        case "luna":
            window.addEventListener("click",onClickOpcionesLuna);
            break;
    }

    return true;
}

export function DividirLineas(ctx, text, x, y, width, height) {
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
