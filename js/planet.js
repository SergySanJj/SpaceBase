export class Planet {
    constructor(data) {
        this.data = data;
        this.sky = getElement("sky", data);
        this.ground = getElement("ground", data);
        this.sea = getElement("sea", data);
    }

    animate(timeDelta, realSecondsDelta) {
        const fullRotation = 24 * 3600 * 1000;
        const speed = 3600.0;
        const rotPerMilliSecond = speed * 2 * Math.PI / fullRotation;
        this.ground.rotation.y += realSecondsDelta * rotPerMilliSecond;
        this.sea.rotation.y += realSecondsDelta * rotPerMilliSecond * 1.1;

        this.sky.rotation.y += realSecondsDelta * rotPerMilliSecond * 0.3 * Math.random();
    }
}

function getElement(elementName, elements) {
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].name === elementName) {
            return elements[i];
        }
    }
    return null;
}