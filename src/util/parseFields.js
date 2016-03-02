/* @flow */

'use strict';

module.exports = (parentModel: Object, fields: Object): Object => {
    for (let field in fields) {
        if (fields.hasOwnProperty(field)) {
            if (typeof fields[field] === 'function') {
                fields[field] = new fields[field](parentModel);
            }
        }
    }

    return fields;
};
