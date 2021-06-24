const Label = require('./Label')

var Sensors = class {
    // sensors;
    // sensorLabel;
    // validation;

    constructor(resSensor) {
        this.sensor = resSensor.sensor;
        this.sensorLabel = resSensor.sensorLabel;
        this.validation = resSensor.validation;
    }
};

module.exports = Sensors;