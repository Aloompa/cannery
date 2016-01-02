const parseFields = require('../util/parseFields');
const Field = require('../field');

module.exports = (fields = {}) => {
    const parsedFields = parseFields(fields);

    let array = [];

    return {
        type: 'arrayfrom',
        fields: parsedFields,
        hooks: Object.assign({}, fields.hooks, {

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
            }

        })
    };
};
