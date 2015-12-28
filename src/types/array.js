const parseFields = require('../util/parseFields');

module.exports = (fields) => {
    return {
        type: 'array',
        fields: parseFields(fields)
    };
};
