import * as THREE from 'three'

const OrbitControls = require('three-orbit-controls')(THREE);
import GLTFLoader from 'three-gltf-loader';
import {Planet} from './planet'

import {randomSpaceMap} from './resources';
import {Vector3} from "three";

export class Game {
    constructor(canvasId = 'canvas') {
        let canvas = document.getElementById('canvas');
        this.canvas = canvas;
        this.renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true, alpha: true});
        this.renderer.autoClearColor = false;
        this.scene = new THREE.Scene();

        this.animatables = [];

        this.setupCamera();
        this.initControls();
        this.setupLights();
        this.loadPlanetModel('../models/planetgroup.gltf');
        // this.createOceanSphere();
        this.resize();
        this.setSpaceBackground();
    }

    setupCamera() {
        const fov = 45;
        const aspect = window.innerWidth / window.innerHeight;  // the canvas default
        const near = 0.1;
        const far = 100;
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set(0, 10, 10);
    }

    initControls() {
        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.target.set(0, 0, 0);
        this.controls.update();

    }

    setupLights() {
        {
            const skyColor = 0xB1E1FF;  // light blue
            const groundColor = 0xB1E1FF;
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

    loadPlanetModel(modelURL) {
        let planetElements = [];
        let root;
        const gltfLoader = new GLTFLoader();
        gltfLoader.load(modelURL, (gltf) => {
            root = gltf.scene;
            this.scene.add(root);

            root.updateMatrixWorld();

            for (const elem of root.children.slice()) {
                planetElements.push(elem);
            }

            let planet = new Planet(planetElements);
            this.animatables.push(planet);
        });
    }

    setSpaceBackground() {
        this.bgScene = new THREE.Scene();

        {
            const loader = new THREE.TextureLoader();
            const texture = loader.load(
                randomSpaceMap()
            );
            texture.magFilter = THREE.LinearFilter;
            texture.minFilter = THREE.LinearFilter;

            const shader = THREE.ShaderLib.equirect;
            const material = new THREE.ShaderMaterial({
                fragmentShader: shader.fragmentShader,
                vertexShader: shader.vertexShader,
                uniforms: shader.uniforms,
                depthWrite: false,
                side: THREE.BackSide,
            });
            material.uniforms.tEquirect.value = texture;
            const plane = new THREE.BoxBufferGeometry(2, 2, 2);
            this.bgMesh = new THREE.Mesh(plane, material);
            this.bgScene.add(this.bgMesh);
        }
    }

    createOceanSphere() {
        const geometry = new THREE.SphereBufferGeometry(4, 64, 64);

        let vertexShader = `
varying vec2 vUv;

void main() {
    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
        `;

        let fragmentShader = `
#define EPSILON 0.1

varying vec2 vUv;

void main() {
    if ((fract(vUv.x * 10.0) < EPSILON)
        || (fract(vUv.y * 10.0) < EPSILON)) {
        gl_FragColor = vec4(vec3(0.0), 1.0);
    } else {
        gl_FragColor = vec4(1.0);
    }
}
        `;

        const shaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: {value: 1.0},
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        });

        const sphere = new THREE.Mesh(geometry, shaderMaterial);

        this.scene.add(sphere);
    }


    run() {
        let lastTime = Date.now();
        let self = this;

        function render(time) {
            time *= 0.001;  // convert to seconds
            let delta = Date.now() - lastTime;
            lastTime = Date.now();

            for (let animatable of self.animatables){
                animatable.animate(time,delta);
            }

            self.bgMesh.position.copy(self.camera.position);
            self.renderer.render(self.bgScene, self.camera);


            self.renderer.render(self.scene, self.camera);
            requestAnimationFrame(render);
        }

        requestAnimationFrame(render);
    }


    resize() {
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

