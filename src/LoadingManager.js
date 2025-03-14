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
    
    // Esperar a que todo esté listo para iniciar animación
    setTimeout(() => {
        if (rocket) {
            // Guardar la posición original para referencia
            const originalPosition = rocket.getBoundingClientRect();
            
            // Forzar un reflow para asegurar que el navegador aplica los cambios
            void rocket.offsetWidth;
            
            // Aplicar la animación con JavaScript para mayor compatibilidad
            rocket.style.animation = "takeoff 2s ease-out forwards";
            
            // Monitorear el final de la animación
            rocket.addEventListener('animationend', () => {
                console.log("Animación de cohete completada");
                
                // Desvanecer la pantalla de carga
                if (loadingScreen) {
                    loadingScreen.style.opacity = "0";
                    loadingScreen.style.transition = "opacity 1s ease";
                    
                    setTimeout(() => {
                        loadingScreen.style.display = "none";
                    }, 1000);
                }
            });
        }
    }, 800);
};