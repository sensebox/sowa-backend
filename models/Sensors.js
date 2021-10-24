const Label = require('./Label')

var Sensors = class {
    // sensors;
    // sensorLabel;
    // validation;

    constructor(resSensor) {
        this.sensor = resSensor.sensor;
        this.label = resSensor.sensorLabel;
        this.sensorElement = resSensor.sensorElement;
        this.validation = resSensor.validation;
        this.image = resSensor.image;
    }
};

module.exports = Sensors;