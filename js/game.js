import * as THREE from 'three'

const OrbitControls = require('three-orbit-controls')(THREE);
import GLTFLoader from 'three-gltf-loader';

export class Game {
    constructor(canvasId = 'canvas') {
        let canvas = document.getElementById('canvas');
        this.canvas = canvas;
        this.renderer = new THREE.WebGLRenderer({canvas});

        const fov = 45;
        const aspect = window.innerWidth / window.innerHeight;  // the canvas default
        const near = 0.1;
        const far = 100;
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set(0, 10, 20);

        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.target.set(0, 5, 0);
        this.controls.update();

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('black');

        this.setupLights();
        this.loadPlanetModel();
        this.resize();
    }

    setupLights() {
        {
            const skyColor = 0xB1E1FF;  // light blue
            const groundColor = 0xB97A20;  // brownish orange
            const intensity = 1;
            const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
            this.scene.add(light);
        }

        {
            const color = 0xFFFFFF;
            const intensity = 1;
            const light = new THREE.DirectionalLight(color, intensity);
            light.position.set(5, 10, 2);
            this.scene.add(light);
            this.scene.add(light.target);
        }
    }

    loadPlanetModel() {
        this.planetElements = [];
        const gltfLoader = new GLTFLoader();
        gltfLoader.load('../models/planetgroup.gltf', (gltf) => {
            const root = gltf.scene;
            this.scene.add(root);


            console.log(dumpObject(root));
            let planet = root.children;
            console.log(planet);

            root.updateMatrixWorld();
            for (const elem of planet.slice()) {
                this.planetElements.push(elem);
            }

            // compute the box that contains all the stuff
            // from root and below
            const box = new THREE.Box3().setFromObject(root);

            const boxSize = box.getSize(new THREE.Vector3()).length();
            const boxCenter = box.getCenter(new THREE.Vector3());

            // set the camera to frame the box
            frameArea(boxSize * 0.5, boxSize, boxCenter, this.camera);

            // update the Trackball controls to handle the new size
            this.controls.maxDistance = boxSize * 10;
            this.controls.target.copy(boxCenter);
            this.controls.update();
        });
        console.log(this.planetElements);
    }

    run(){
        let lastTime = Date.now();
        const fullRotation = 24 * 3600 * 1000;
        const speed = 3600.0;
        const rotPerMilliSecond = speed * 2 * Math.PI / fullRotation;
        let self = this;
        function render(time) {
            time *= 0.001;  // convert to seconds

            let delta = Date.now() - lastTime;
            lastTime = Date.now();

            for (const el of self.planetElements) {
                el.rotation.y += delta * rotPerMilliSecond;
            }

            self.renderer.render(self.scene, self.camera);
            requestAnimationFrame(render);
        }

        requestAnimationFrame(render);
    }

    resize(){
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.renderer.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }
}


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
}

// module.exports = {Game};