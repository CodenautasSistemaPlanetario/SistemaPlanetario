import * as THREE from 'three';
import { changeScene,removemovementEvents,resetMovimientoCamara,addmovementEvents } from '../Controlador.js';
import { FontLoader } from 'https://unpkg.com/three@latest/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://unpkg.com/three@latest/examples/jsm/geometries/TextGeometry.js';
import {onClickOpcionesPhobos,ZonaParamsPhobos } from './Phobos.js';
import { onClickOpcionesDeimos,ZonaParamsDeimos } from './Deimos.js';
import { onClickOpcionesLuna,ZonasParamsLuna } from './Luna.js';

const path = "./img/Stars/";
const TextureCubeLoader = new THREE.CubeTextureLoader();
const clock = new THREE.Clock();

var empieza_moverse = false;

// const Zona0 = new THREE.Group();

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
let Zona_Params_Activo = [];
let User_input = "";
let LastY_Global = 0;
let Can_write = true;
let collision = false;
// let ya_jugado = false;
const Text_color =" #ffffff";
const Background_color =" #92c5fc";
let Difficultad_Zona;


const dist_colision_zonas = 1.5;

var cono;
var conoPhobos,conoDeimos,conoLuna;

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
    var yajugador = false;
    const pos_zona_elevada = new THREE.Vector3(0, camara.position.y, 0);
    const distance = camara.position.distanceTo(pos_zona_elevada);

    if(!empieza_moverse && distance >= 1.3){
        empieza_moverse = true;
    } else if(empieza_moverse && distance <= 1){
        yajugador = true;
        changeScene("scenePlanets");
        empieza_moverse = false;
    }
    return yajugador;
}

export function CrearFlechaVuelta(scene,nombre_escena){
    const geometry = new THREE.ConeGeometry(0.5, 1, 4);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    cono = new THREE.Mesh(geometry, material);
    cono.rotation.x = Math.PI;
    cono.position.set(0, 2, 0);
    scene.add(cono);
    switch(nombre_escena)
    { 
        case "Phobos":
            conoPhobos = cono;
            break;
        case "Deimos":
            conoDeimos = cono;
            break;
        case "Luna":
            conoLuna = cono;
            break;
    }
}

export function AnimateCono(){
    if(empieza_moverse){
        const elapsedTime = clock.getElapsedTime();
        cono.position.y = 2.5 + Math.sin( elapsedTime * 1.5) * 0.5;
    }
}

export function reiniciar(camara){
    camara.position.set(0, 2, 0);
    camara.rotation.set(0, 0, 0);

    empieza_moverse = false;
    collision = false;

}

export function CheckLlegadaZonas(ZonasJugables, camera, Zona0) {
    

    if (!collision) {
        for (let index = 0; index < ZonasJugables.length; index++) {
            const zona = ZonasJugables[index];
            const pos_zona_elevada = new THREE.Vector3(zona.x, camera.position.y, zona.z);
            const distance = camera.position.distanceTo(pos_zona_elevada);

            if (distance <= dist_colision_zonas) {
                Index_zona = index;
                collision = true;
                CargarZona0(Zona0, zona, camera);
                break; // Salimos del bucle al encontrar la primera colisión
            }
        }
    }

    
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
    switch(lunaActiva)
    {
        case "deimos":
            Zona_Params_Activo = ZonaParamsDeimos;
            cono = conoDeimos;
            break;
        case "luna":
            Zona_Params_Activo = ZonasParamsLuna;
            cono = conoLuna;
            break;
        case "phobos":
            Zona_Params_Activo = ZonaParamsPhobos;
            cono = conoPhobos;
            break;
    }
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
            window.addEventListener("click", (event) => onClickOpcionesPhobos(event, Index_zona));
            break;
        case "deimos":
            window.addEventListener("click",onClickOpcionesDeimos);
            break;
        case "luna":
            window.addEventListener("click",onClickOpcionesLuna);
            break;
    }

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


export function AcabadoZona(){
    window.removeEventListener("keydown", escribirCanvas);
    addmovementEvents();
    Zona_Params_Activo.forEach(element => {
        if(element.zona){
            element.zona.visible = false;
        }
    });
    setTimeout(() => {
        collision = false;
    }, 5000);
}

function checkAnswer(letter) {
    let correcto = false;
    let local_correct_answer = "";
    local_correct_answer = Zona_Params_Activo[Index_zona].Correct_answer[Difficultad_Zona];

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

export function CrearCanvasTexture(scene,camara,Difficultad) {
    let zona, canvas, ctx, lineas,backgroundtexture,tituloreto;

    window.removeEventListener("click", onClickOpcionesDeimos);

    const zonaParams = Zona_Params_Activo[Index_zona];
    if (!zonaParams || !zonaParams.Lineas || !zonaParams.Lineas[Difficultad]) {
        console.error("Invalid zonaParams or Lineas for the given Difficultad");
        return;
    }

    zona = zonaParams.zona;
    tituloreto = zonaParams.titulo;
    canvas = zonaParams.canvas;
    ctx = zonaParams.ctx;
    lineas = zonaParams.Lineas[Difficultad];
    Difficultad_Zona = Difficultad;

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
    camara.lookAt(pos_global);
    scene.add(zona);

    Zona_Params_Activo[Index_zona].backgroundtexture = backgroundtexture;
    Zona_Params_Activo[Index_zona].ctx = ctx;
    Zona_Params_Activo[Index_zona].canvas = canvas;
    backgroundtexture.needsUpdate = true;


    collision = true;
    window.addEventListener("keydown", escribirCanvas);
}

function escribirCanvas(event) {
    let correcto = null;
    let texto_check = "";
    let color_check = "";

    let local_canvas;
    let local_ctx;
    let local_texture

    const zonaParams = Zona_Params_Activo[Index_zona];
    if (!zonaParams) return;

    local_canvas = zonaParams.canvas;
    local_ctx = zonaParams.ctx;
    local_texture = zonaParams.backgroundtexture;
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
