const Label = require('./Label');
const Phenomenon = require('./Phenomenon');

var Domain = class {

    constructor(res) {
        this.labels = [];
        this.phenomenon = [];

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

                case "phenomenon": {
                    this.phenomenon.push(element);
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

module.exports = Domain;