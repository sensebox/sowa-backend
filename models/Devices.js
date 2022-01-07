var Devices = class Devices {
    // device: {
    //     type: string,
    //     value: string,
    // };
    // deviceLabel: {
    //     type: string,
    //     value: string,
    //     "xml:lang": string
    // };
    // validation: {
    //     type: string,
    //     value: string,
    // };



    constructor(resDevice) {
        this.device = resDevice.device;
        this.deviceLabel = resDevice.label;
        this.validation = resDevice.validation;
        this.image = resDevice.image;
    }
}

module.exports = Devices;

