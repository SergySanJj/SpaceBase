import css from '../css/style.css';

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

    let renderer = new THREE.WebGLRenderer({canvas: canvas});
    renderer.setClearColor(0x000000);

    let scene = new THREE.Scene();

    let camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 5000);
    camera.position.set(0, 0, 1000);

    let light = new THREE.AmbientLight(0xffffff);
    scene.add(light);

    let geometry = new THREE.SphereGeometry(300, 12, 12);
    let material = new THREE.MeshBasicMaterial({color: 0xffffff, vertexColors: THREE.FaceColors});

    for (let i = 0; i < geometry.faces.length; i++) {
        geometry.faces[i].color.setRGB(Math.random(), Math.random(), Math.random())
    }

    let mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let loop = () => {
        mesh.rotation.y += Math.PI / 500;

        renderer.render(scene, camera);
        requestAnimationFrame(() => {
            loop();
        });
    };

    loop();
};