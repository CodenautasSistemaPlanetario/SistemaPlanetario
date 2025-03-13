import * as THREE from "three";

export const manager = new THREE.LoadingManager();

manager.onProgress = function (url, itemsLoaded, itemsTotal) {
    const progress = (itemsLoaded / itemsTotal) * 100;
    const rocketElement = document.getElementById("rocket");
    if (rocketElement) {
        rocketElement.style.left = progress + "%";
    }
};

manager.onLoad = function () {
    const rocket = document.getElementById("rocket");
    if (rocket) {
        rocket.style.animation = "takeoff 1s ease-out forwards";
        setTimeout(() => {
            const loadingScreen = document.getElementById("loading-screen");
            if (loadingScreen) {
                loadingScreen.style.display = "none";
            }
        }, 1000);
    }
};