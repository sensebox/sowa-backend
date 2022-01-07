const Sensors = require('./Sensors')
const Label = require('./Label')


var Device = class Device {
    // iri;
    // labels;
    // description;
    // website;
    // image;
    // contact;
    // sensors;
    // validation;

    constructor(res) {
        this.labels = [];
        this.sensors = [];

        res.forEach((element) => {
            // let element = res[key];
            // if(!isNaN(key)){
            //     key = Object.keys(res[key])[0]
            // }

            switch (Object.getOwnPropertyNames(element)[0]) {

                case "description": {
                    Object.assign(this, element);
                    break;
                }

                case "iri": {
                    Object.assign(this, element);
                    break;
                }

                case "website": {
                    Object.assign(this, element);
                    break;
                }

                case "image": {
                    Object.assign(this, element);
                    break;
                }

                case "markdown": {
                    Object.assign(this, element);
                    break;
                }

                case "contact": {
                    Object.assign(this, element);
                    break;
                }

                case "label": {
                    this.labels.push(new Label(element));
                    break;
                }

                case "sensor": {
                    this.sensors.push(new Sensors(element));
                    break;
                }
                
                case "validation": {
                    Object.assign(this, element);
                    break;
                }


                default: {
                    console.log("Invalid attribute");
                    break;
                }
            }
        })
    }
}

module.exports = Device;
