'use strict';

const BaseType = require('./base');
const HasMany = require('./hasMany');
const parseFields = require('../util/parseFields');
const addListenersUtil = require('../util/addListeners');
const validate = require('valid-point');
const fields = Symbol();
const addListeners = Symbol();
const applyFieldNames = Symbol();
const applyFieldParent = Symbol();

class ObjectType extends BaseType {

    constructor (fields, options = {}) {
        super(options);
        this.parent = options.parent;
        this.initialize(fields);
    }

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

    [ applyFieldParent ] () {
        Object.keys(this[fields]).forEach((key) => {
            this[fields][key].parent = this.parent;
            if (typeof this[fields][key].setParent === 'function') {
                this[fields][key].setParent();
            }
        });
    }

    apply (data) {
        if (!data) {
            return;
        }

        Object.keys(data).forEach((key) => {
            if (this[fields][key]) {
                this[fields][key].apply(data[key]);
            }
        });

        this.emit('change');

        return this;
    }

    initialize (initalFields) {
        this[fields] = parseFields(initalFields);
        this[applyFieldNames]();
        this[applyFieldParent]();
        this[addListeners]();
    }

    get (key) {
        const ArrayType = require('./array');
        const field = this[fields][key];

        if (!field) {
            throw new Error(`cannot get "${key}." It is undefined in your Cannery model`);
        }

        // Objects
        if (field instanceof this.constructor) {
            return field;
        }

        // Arrays
        if (field instanceof ArrayType) {
            return field;
        }

        // HasMany's
        if (field instanceof HasMany) {
            return field;
        }

        return field.get();
    }

    getFields () {
        return this[fields];
    }

    getLastModified (key) {
        if (key) {
            return this[fields][key].lastModified;
        }

        throw new Error('getLastModified requires a key');
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

    validate (key) {
        if (key) {
            return this[fields][key].validate();
        }

        return Object.keys(this[fields]).map((key) => {
            return this[fields][key].validate();
        });
    }

}

module.exports = ObjectType;
