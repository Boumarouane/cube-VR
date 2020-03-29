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

    // Camera
    const fov = 75;
    const aspect = 2;
    const near = 0.1;
    const far = 5;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;

    // Scene
    scene = new THREE.Scene();

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
        return cube;
    }

    // Cubes
    cubes = [
        makeInstance(geometry, 0x44aa88, 0),
        makeInstance(geometry, 0x8844aa, -2),
        makeInstance(geometry, 0xaa8844, 2),
    ];

}
let animate = (time) => {
    time *= 0.001;

    cubes.forEach((cube, ndx) => {
        const speed = 1 + ndx * .1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
    });

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}

init();
animate();