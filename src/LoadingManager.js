import * as THREE from "three";

export const manager = new THREE.LoadingManager();

manager.onProgress = function (url, itemsLoaded, itemsTotal) {
    const progress = (itemsLoaded / itemsTotal) * 100;
    const progressBar = document.getElementById("progress-bar");
    const rocket = document.getElementById("rocket");
    
    if (progressBar) {
        progressBar.style.width = progress + "%";
    }
    
    if (rocket) {
        rocket.style.left = progress + "%";
    }
};

manager.onLoad = function () {
    const rocket = document.getElementById("rocket");
    const loadingScreen = document.getElementById("loading-screen");
    
    setTimeout(() => {
        if (rocket) {
            // Iniciar la animación de despegue
            rocket.style.animation = "takeoff 2s ease-out forwards";
            
            // Esperar a que termine la animación para ocultar la pantalla
            setTimeout(() => {
                if (loadingScreen) {
                    loadingScreen.style.opacity = "0";
                    loadingScreen.style.transition = "opacity 1s ease";
                    
                    setTimeout(() => {
                        loadingScreen.style.display = "none";
                    }, 3000);
                }
            }, 2000);
        }
    }, 800); // Pausa de 800ms para que se aprecie bien la carga completa
};