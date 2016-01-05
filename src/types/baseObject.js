const BaseType = require('./base');
const parseFields = require('../util/parseFields');
const addListenersUtil = require('../util/addListeners');
const validate = require('valid-point');
const fields = Symbol();
const addListeners = Symbol();
const applyFieldNames = Symbol();

class BaseObject extends BaseType {

    [ addListeners ] () {
        Object.keys(this[fields]).forEach((key) => {
            const field = this[fields][key];
            addListenersUtil(this, field);
        });
    }

    [ applyFieldNames ] () {
        Object.keys(this[fields]).forEach((key) => {
            this[fields][key].fieldName = key;
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
        this[applyFieldNames]();
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

    validate () {
        return Object.keys(this[fields]).map((key) => {
            return this[fields][key].validate();
        });
    }

}

module.exports = BaseObject;
