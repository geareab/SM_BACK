const Fuse = require('fuse.js');

const options = {
    includeScore: false,
    includeRefIndex: false,
    keys: ['name']
};

const applySortFilter = (array, query) => {
    // copy without reference
    const arrayWithoutSpace = JSON.parse(JSON.stringify(array));

    //remove unwanted symbols
    query = query.split(' ').join('').split('/').join('').split('-').join('').split(',').join('');

    arrayWithoutSpace.forEach((element) => {
        element.name = element.name
            .split(' ')
            .join('')
            .split('/')
            .join('')
            .split('-')
            .join('')
            .split(',')
            .join('');
    });

    const fuse = new Fuse(arrayWithoutSpace, options);
    const result = fuse.search(query, { limit: 5 });

    result.forEach((element) => {
        if (array.findIndex((x) => x._id === element.item._id)) {
            const itemIndex = array.findIndex((x) => x._id === element.item._id);
            element.item.name = array[itemIndex].name;
        }
        delete element.refIndex;
        delete element.item.__v;
    });
    return result;
};


module.exports = { applySortFilter };