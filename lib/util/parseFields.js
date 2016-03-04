

'use strict';

module.exports = function (parentModel, fields) {
    for (var field in fields) {
        if (fields.hasOwnProperty(field)) {
            if (typeof fields[field] === 'function') {
                fields[field] = new fields[field](parentModel);
            }
        }
    }

    return fields;
};