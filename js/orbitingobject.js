import {Animatable} from "./animatable";
import {Vector3} from "three";

export class OrbitingObject extends Animatable {
    constructor(name, mesh, rotationAngularSpeed, pivot = new Vector3(0, 0, 0)) {
        super(name);
        this.mesh = mesh;
        this.speed = rotationAngularSpeed;
        this.piviot = pivot;
        this.position = mesh.position;

        this.r = Math.sqrt(this.position.x ** 2 + this.position.y ** 2 + this.position.z ** 2);
        this.phi = Math.atan(this.position.y / this.position.x);
        this.theta = Math.acos(this.position.z / this.r);

        console.log("moon created", this);
    }

    animate(time, delta) {
        let angle = this.speed * delta;
        this.theta += angle;
        this.updateRealPosition();
    }

    updateRealPosition() {
        this.mesh.position.x = this.r * Math.sin(this.theta) * Math.cos(this.phi);
        this.mesh.position.y = this.r * Math.sin(this.theta) * Math.sin(this.phi);
        this.mesh.position.z = this.r * Math.cos(this.theta);
    }
}