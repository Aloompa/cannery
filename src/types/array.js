const parseFields = require('../util/parseFields');
const Field = require('../field');

module.exports = (options = {}) => {

    let array = [];

    return Object.assign({
        type: 'array'
    }, options, {
        hooks: Object.assign({}, options.hooks, {

            add: (item, index) => {
                if (typeof index !== 'number') {
                    index = array.length;
                }

                array.splice(index, 0, item);
            },

            get: () => {
                return array;
            },

            move: (oldIndex, newIndex) => {
                const item = array[oldIndex];
                array.splice(oldIndex, 1);
                array.splice(newIndex, 0, item);
            },

            remove: (index) => {
                array.splice(index, 1);
            },

            removeAll: () => {
                array = [];
            }

        })
    });
};
