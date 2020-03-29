import * as THREE from "./three.module.js";
import {
    VRButton
} from "./VRButton.js";

let cubes,
    renderer,
    scene,
    camera


let init = () => {

    const canvas = document.querySelector('#c');

    // Moteur de rendu
    renderer = new THREE.WebGLRenderer({
        canvas
    });
    // ! Activer le support WebXR de three.js et ajouter son bouton VR
    renderer.xr.enabled = true;
    document.body.appendChild(VRButton.createButton(renderer));

    // Camera
    const fov = 75;
    const aspect = 2;
    const near = 0.1;
    const far = 5;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    // ! optimisation de la camera pour une personne debout
    camera.position.set(0, 1.6, 0);

    // Scene
    scene = new THREE.Scene();
    // Cube en background
    {
        const loader = new THREE.CubeTextureLoader();
        const texture = loader.load([
            'neb.gif',
            'neb.gif',
            'neb.gif',
            'neb.gif',
            'neb.gif',
            'neb.gif',
        ]);
        scene.background = texture;
    }

    // Lumière
    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
    }
    // Geometrie de notre objet 3D
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    // Fonction qui permet de créer plusieurs cubes
    let makeInstance = (geometry, color, x) => {
        const material = new THREE.MeshPhongMaterial({
            color
        });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        cube.position.x = x;
        // ! Déplacez les cubes vers le haut pour être devant la caméra
        cube.position.y = 1.6;
        cube.position.z = -2;
        return cube;
    }

    // Cubes
    cubes = [
        makeInstance(geometry, 0x44aa88, 0),
        makeInstance(geometry, 0x8844aa, -2),
        makeInstance(geometry, 0xaa8844, 2),
    ];
}

// Fonction de responsivitée
let resizeRendererToDisplaySize = (renderer) => {
    let canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = canvas.clientWidth * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}

// Fonction d'animation
let animate = (time) => {

    // Rotation des cubes
    time *= 0.001;

    cubes.forEach((cube, ndx) => {
        const speed = 1 + ndx * .1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
    });

    // Vérifie si le canvas doit etre redimensionné
    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }
    renderer.render(scene, camera);

}

init();
// ! Boucle pour prendre en charge la VR
renderer.setAnimationLoop(animate);