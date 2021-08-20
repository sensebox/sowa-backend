var Phenomena = class Phenomena {
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



    constructor(resPhenomenon) {
        console.log("resPheno", resPhenomenon)
        this.phenomenon = resPhenomenon.phenomenon;
        this.label = resPhenomenon.phenomenonLabel;
        this.validation = resPhenomenon.validation;
        this.rovs = resPhenomenon.rovs;
    }
}

module.exports = Phenomena;

