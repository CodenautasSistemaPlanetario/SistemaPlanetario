import * as THREE from "three";
import {CreateScenePlanets, animateScenePlanets,addEventsPlanets,removeEventsPlanets }from "./src/SistemaPlanetario.js";
import { CreateSceneCuestions, animateSceneCuestions,addEventsCuestions,removeEventsCuestions }from "./src/Cuestionario.js";

//Renderer 
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Variable Value
let sceneCuestions, cameraCuestions,scenePlanets,cameraPlanets;
[sceneCuestions,cameraCuestions]= CreateSceneCuestions(renderer);
[scenePlanets,cameraPlanets]= CreateScenePlanets(renderer);


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