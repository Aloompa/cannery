const BaseType = require('./base');
const parseFields = require('../util/parseFields');
const addListenersUtil = require('../util/addListeners');
const fields = Symbol();
const addListeners = Symbol();

class BaseObject extends BaseType {

    [ addListeners ] () {
        Object.keys(this[fields]).forEach((key) => {
            const field = this[fields][key];
            addListenersUtil(this, field);
        });
    }

    apply (data) {
        Object.keys(data).forEach((key) => {
            this[fields][key].apply(data[key]);
        });

        return this;
    }

    initialize (initalFields) {
        this[fields] = parseFields(initalFields);
        this[addListeners]();
    }

    get (key) {
        return this[fields][key].get();
    }

    set (key, value) {
        this[fields][key].set(value);
        return this;
    }

    toJSON () {
        let json = {};

        Object.keys(this[fields]).map((key) => {
            json[key] = this[fields][key].toJSON();
        });

        return json;
    }

}

module.exports = BaseObject;
