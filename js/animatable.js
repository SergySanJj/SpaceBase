export class Animatable {
    constructor(name) {
        this.name = name;
    }

    animate(timeDelta, realSecondsDelta) {
        console.log("Prototype animation called");
    }
}

