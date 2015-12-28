module.exports = (fields) => {
    for (let field in fields) {
        /* istanbul ignore else */
        if (fields.hasOwnProperty(field)) {
            if (typeof fields[field] === 'function') {
                fields[field] = fields[field]();
            }
        }
    }

    return fields;
};
