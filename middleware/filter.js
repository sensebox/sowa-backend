module.exports.filterData = function filter(data, lang) {

    function deleteLanguage(json, lang) {
        if (json instanceof Object) {
            Object.keys(json).forEach(key => {
                if (json[key]['xml:lang'] && json[key]['xml:lang'] !== lang) {
                    console.log('------------------');
                    console.log(json[key]);
                    delete json[key];
                }
                else {
                    deleteLanguage(json[key], lang)
                }
            })
        }
        else if (json instanceof Array) {
            json.forEach(item => {
                if (item['xml:lang'] && item['xml:lang'] !== lang) {
                    console.log('------------------');
                    console.log(item);
                    delete item;
                }
                else {
                    deleteLanguage(item, lang)
                }
            })
        }
    }

    deleteLanguage(data, lang);


    // data.map(function(el) {
    //     Object.keys(el).forEach(key => {
    //         iterate(el[key])
    //     })
    //     console.log(el);
    // })
    console.log(data);
    return data;
};