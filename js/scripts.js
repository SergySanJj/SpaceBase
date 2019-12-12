import css from '../css/style.css';

import * as THREE from 'three'

const OrbitControls = require('three-orbit-controls')(THREE);
import GLTFLoader from 'three-gltf-loader';


let planetElements = []

let canvas, renderer, camera, scene, controls;


window.onload = () => {
    canvas = document.getElementById('canvas');
    renderer = new THREE.WebGLRenderer({canvas});
    renderer.setSize(window.innerWidth, window.innerHeight);

    const fov = 45;
    const aspect = window.innerWidth / window.innerHeight;  // the canvas default
    const near = 0.1;
    const far = 100;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, 20);

    controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 5, 0);
    controls.update();

    scene = new THREE.Scene();
    scene.background = new THREE.Color('black');


    {
        const gltfLoader = new GLTFLoader();
        gltfLoader.load('../models/planetgroup.gltf', (gltf) => {
            const root = gltf.scene;
            scene.add(root);


            console.log(dumpObject(root));
            let planet = root.children;
            console.log(planet);

            root.updateMatrixWorld();
            for (const elem of planet.slice()) {
                planetElements.push(elem);
            }

            // compute the box that contains all the stuff
            // from root and below
            const box = new THREE.Box3().setFromObject(root);

            const boxSize = box.getSize(new THREE.Vector3()).length();
            const boxCenter = box.getCenter(new THREE.Vector3());

            // set the camera to frame the box
            frameArea(boxSize * 0.5, boxSize, boxCenter, camera);

            // update the Trackball controls to handle the new size
            controls.maxDistance = boxSize * 10;
            controls.target.copy(boxCenter);
            controls.update();
        });
        console.log(planetElements);
    }

    {
        const skyColor = 0xB1E1FF;  // light blue
        const groundColor = 0xB97A20;  // brownish orange
        const intensity = 1;
        const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        scene.add(light);
    }

    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(5, 10, 2);
        scene.add(light);
        scene.add(light.target);
    }

    let lastTime = Date.now();
    const fullRotation = 24 * 3600 * 1000;
    const speed = 3600.0;
    const rotPerMilliSecond = speed * 2 * Math.PI / fullRotation;

    function render(time) {
        time *= 0.001;  // convert to seconds

        let delta = Date.now() - lastTime;
        lastTime = Date.now();

        for (const el of planetElements) {
            el.rotation.y += delta * rotPerMilliSecond;
        }

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
};

window.onresize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    renderer.aspect = window.innerWidth / window.innerHeight;
};


function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
    const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
    const halfFovY = THREE.Math.degToRad(camera.fov * .5);
    const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);
    // compute a unit vector that points in the direction the camera is now
    // in the xz plane from the center of the box
    const direction = (new THREE.Vector3())
        .subVectors(camera.position, boxCenter)
        .multiply(new THREE.Vector3(1, 0, 1))
        .normalize();

    // move the camera to a position distance units way from the center
    // in whatever direction the camera was from the center already
    camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));

    // pick some near and far values for the frustum that
    // will contain the box.
    camera.near = boxSize / 100;
    camera.far = boxSize * 100;

    camera.updateProjectionMatrix();

    // point the camera to look at the center of the box
    camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
}

function dumpObject(obj, lines = [], isLast = true, prefix = '') {
    const localPrefix = isLast ? '└─' : '├─';
    lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
    const newPrefix = prefix + (isLast ? '  ' : '│ ');
    const lastNdx = obj.children.length - 1;
    obj.children.forEach((child, ndx) => {
        const isLast = ndx === lastNdx;
        dumpObject(child, lines, isLast, newPrefix);
    });
    return lines;
};
