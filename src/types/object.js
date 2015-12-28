const parseFields = require('../util/parseFields');

module.exports = (fields) => {
    return {
        type: 'object',
        fields: parseFields(fields)
    };
};
