// helper functions
const slugify = require('slugify');

function slugifyModified(string) {
    return slugify(string, {
        replacement: '_',
        lower: true,
        remove: /[*+~.()'"!:@]/g,
    });
}

module.exports = {slugifyModified};