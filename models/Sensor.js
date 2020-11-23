const Label = require('./Label');
const SensorElement = require('./SensorElement');
const Devices = require('./Devices');

var Sensor = class {

  constructor(res) {
    this.labels = [];
    this.sensorElements = [];
    this.devices = [];

    res.forEach((element) => {
      // console.log(element);
      switch (Object.getOwnPropertyNames(element)[0]) {

        case "description": {
          Object.assign(this, element);
          break;
        }

        case "iri": {
          Object.assign(this, element);
          break;
        }

        case "manufacturer": {
          Object.assign(this, element);
          break;
        }

        case "price": {
          Object.assign(this, element);
          break;
        }

        case "datasheet": {
          Object.assign(this, element);
          break;
        }

        case "lifeperiod": {
          Object.assign(this, element);
          break;
        }

        case "image": {
          Object.assign(this, element);
          break;
        }


        case "validation": {
          Object.assign(this, element);
          break;
        }

        case "label": {
          this.labels.push(new Label(element));
          break;
        }

        case "device": {
          this.devices.push(new Devices(element));
          break;
        }

        case "sensorElement": {
          this.sensorElements.push(new SensorElement(element));
          break;
        }

        default: {
          console.log("Invalid attribute", element);
          break;
        }
      }
    })
  }

}

module.exports = Sensor;