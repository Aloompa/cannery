/* @flow */

'use strict';

module.exports = (fields: Object): Object => {
    for (let field in fields) {
        if (fields.hasOwnProperty(field)) {
            if (typeof fields[field] === 'function') {
                fields[field] = new fields[field]();
            }
        }
    }

    return fields;
};
