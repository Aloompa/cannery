const BaseType = require('./base');
const parseFields = require('../util/parseFields');
const fields = Symbol();

class ObjectType extends BaseType {

    constructor (initalFields = {}, options = {}) {
        super(options);

        this[fields] = parseFields(initalFields);
    }

    get (key) {
        return this[fields][key].get();
    }

    set (key, value) {
        this[fields][key].set(value);
        return this;
    }

}

module.exports = ObjectType;
