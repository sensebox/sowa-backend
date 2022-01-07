
const Sensors = require('./Sensors');
const Label = require('./Label');

const Phenomenon = class {

  constructor(res) {
    // console.log(phenomenonResponse);
    // this.labels = phenomenonResponse.labels;
    // this.description = phenomenonResponse.description;
    // this.iri = phenomenonResponse.iri;
    // this.units = phenomenonResponse.units;    
    // this.domains = phenomenonResponse.domains;

    this.labels = [];
    this.rovs = [];
    this.domains = [];
    this.sensors = [];
    // this.rovs = [];

    res.forEach((element) => {
      switch (Object.getOwnPropertyNames(element)[0]) {

        case "description": {
          Object.assign(this, element);
          break;
        }

        case "iri": {
          Object.assign(this, element);
          break;
        }

        case "label": {
          this.labels.push(new Label(element));
          break;
        }

        case "rov": {
          this.rovs.push(element);
          break;
        }

        case "markdown": {
          Object.assign(this, element);
          break;
        }

        case "domain": {
          this.domains.push(element);
          break;
        }

        case "validation": {
          Object.assign(this, element);
          break;
        }


        case "sensors": {
          this.sensors.push(new Sensors(element));
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

module.exports = Phenomenon;