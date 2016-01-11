'use strict';

module.exports = (fields) => {
    for (let field in fields) {
        /* istanbul ignore else */
        if (fields.hasOwnProperty(field)) {
            if (typeof fields[field] === 'function') {
                fields[field] = new fields[field]();
            }
        }
    }

    return fields;
};
