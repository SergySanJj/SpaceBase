import css from '../css/style.css';

import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';
import {OrbitControls} from 'three-orbit-controls'

let scene, camera, renderer;

window.onload = function () {
    let width = window.innerWidth;
    let height = window.innerHeight;

    let canvas = document.getElementById('canvas');

    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);

    window.onresize = (ev => {
        canvas.setAttribute('width', window.innerWidth);
        canvas.setAttribute('height', window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    renderer = new THREE.WebGLRenderer({canvas: canvas});
    //renderer.setClearColor(0x000000);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 5000);
    camera.position.set(0, 0, 1000);

    let light = new THREE.AmbientLight(0xffffff);
    scene.add(light);

    // model
    let material = new THREE.MeshBasicMaterial({color: 0xffffff});

    let loader = new GLTFLoader();
    loader.load('../models/greenstar.glb',  (gltf)=> {
        const root = gltf.scene;
        scene.add(root);
        console.log(dumpObject(root).join('\n'));
    });

    // renderer = new THREE.WebGLRenderer({antialias: true});
    // renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.gammaOutput = true;

    renderer.render(scene, camera);
};

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

