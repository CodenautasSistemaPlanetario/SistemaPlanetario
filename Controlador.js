import * as THREE from "three";
import {CreateScenePlanets, animateScenePlanets,addEventsPlanets,removeEventsPlanets }from "./src/SistemaPlanetario.js";
import { CreateSceneCuestions, animateSceneCuestions,addEventsCuestions,removeEventsCuestions }from "./src/Cuestionario.js";
import{CreateSceneLuna,animateSceneLunas,addEventsLuna,removeEventsLuna} from "./src/Luna.js";
import { CreateScenePhobos,animateScenePhobos,addEventsPhobos,removeEventsPhobos } from "./src/Phobos.js";

//Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Variable Value
let sceneCuestions, cameraCuestions,scenePlanets,cameraPlanets,sceneLuna,cameraLuna,scenePhobos,cameraPhobos;
[sceneCuestions,cameraCuestions]= CreateSceneCuestions(renderer);
[scenePlanets,cameraPlanets]= CreateScenePlanets(renderer);
[sceneLuna,cameraLuna]= CreateSceneLuna(renderer);
[scenePhobos,cameraPhobos]= CreateScenePhobos(renderer);


//Active Variables
let scene = scenePlanets;
let camera = cameraPlanets;
let Activeanimate = animateScenePlanets;
let endActiveanimate = null;


function changeScene(newScene){
    if(endActiveanimate != null){
        cancelAnimationFrame(endActiveanimate);
    }

    if (scene === scenePlanets) {
        removeEventsPlanets();
    } else if (scene === sceneCuestions) {
        removeEventsCuestions();
    } else if (scene === sceneLuna) {
        removeEventsLuna();
    } else if (scene === scenePhobos) {
        removeEventsPhobos();
    }

    if(newScene == "scenePlanets"){
        scene = scenePlanets;
        camera = cameraPlanets;
        Activeanimate = animateScenePlanets;
        addEventsPlanets();
    }else if(newScene == "sceneCuestions"){
        scene = sceneCuestions;
        camera = cameraCuestions;
        Activeanimate = animateSceneCuestions;
        addEventsCuestions();
    } else if(newScene == "sceneLuna"){
        scene = sceneLuna;
        camera = cameraLuna;
        Activeanimate = animateSceneLunas;
        addEventsLuna();
    } else if(newScene == "scenePhobos"){
        scene = scenePhobos;
        camera = cameraPhobos;
        Activeanimate = animateScenePhobos;
        addEventsPhobos();
    }
   
   if (Activeanimate) {
    Animate();
   }
}

function Animate(){
    endActiveanimate= requestAnimationFrame(Animate);
    if (Activeanimate) {
        Activeanimate(); 
    }
}

Animate();


export{changeScene};