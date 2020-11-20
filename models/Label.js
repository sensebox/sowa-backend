var Label = class {
    // type;
    // value;
    // "xml:lang";

    constructor(reslabel) {
        if(reslabel[0]) {
            this.type = reslabel[0].type;
            this.value = reslabel[0].value;
            this["xml:lang"] = reslabel[0]["xml:lang"];
        }
    }
};

module.exports = Label;