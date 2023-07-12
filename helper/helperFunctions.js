// helper functions
const slugify = require('slugify');
slugify.extend({':': '_'});

function slugifyModified(string) {
    return slugify(string, {
        replacement: '_',
        lower: true,
        remove: /[*+~.()'"!@]/g,
    })
}

module.exports = {slugifyModified};