var SensorElement = class {

    constructor(resSensorElement) {
        console.log(resSensorElement)
        this.accVal = resSensorElement.accVal;
        this.phenomenon = resSensorElement.phenomenon;
        this.sensorElement = resSensorElement.sensorElement;
        this.unit = resSensorElement.unit;
        this.phenomenonName = resSensorElement.phenomenonName;
    }
};

module.exports = SensorElement;