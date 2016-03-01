/* @flow */

'use strict';

const BaseType = require('./base');
const MultiModel = require('./multiModel');
const parseFields = require('../util/parseFields');
const validate = require('valid-point');

class ObjectType extends BaseType {

    constructor (owner: Object,  parent: Object, fields: Object, options: ?Object) {
        super(owner, options || {});
        this.initialize(fields);
    }

    _applyFieldNames () {
        Object.keys(this._fields).forEach((key) => {
            this._fields[key].fieldName = key;
        });
    }

    _applyFieldParent () {
        Object.keys(this._fields).forEach((key) => {
            this._fields[key].parent = this.parent;
            if (typeof this._fields[key].setParent === 'function') {
                this._fields[key].setParent();
            }
        });
    }

    on (): Object {
        const subscriptions = {};

        Object.keys(this._fields).forEach((key) => {
            const field = this._fields[key];
            subscriptions[key] = field.on(...arguments);
        });

        return subscriptions;
    }

    off (actionType: string, subscriptions: Object): Object {
        Object.keys(subscriptions).forEach((key) => {
            const field = this._fields[key];
            const subscription = subscriptions[key];

            return field.off(actionType, subscription);
        });

        return this;
    }

    emit () {
        console.log('emit');
    }

    apply (data: Object): any {
        if (!data) {
            return;
        }

        Object.keys(data).forEach((key) => {
            if (this._fields[key]) {
                this._fields[key].apply(data[key]);
            }
        });

        return this;
    }

    initialize (initalFields: Object) {
        this._fields = parseFields(this.owner, this.parent, initalFields);
        this._applyFieldNames();
        this._applyFieldParent();
    }

    get (key: string): any {
        const ArrayType = require('./array');
        const field = this._fields[key];

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

        // MultiModel's
        if (field instanceof MultiModel) {
            return field;
        }

        return field.get();
    }

    getFields (): Object {
        return this._fields;
    }

    getLastModified (key: string): any {
        if (key) {
            return this._fields[key].lastModified;
        }

        throw new Error('getLastModified requires a key');
    }

    set (key: string, value: any): Object {
        this._fields[key].set(value);
        return this;
    }

    toJSON (options: ?Object): Object {
        let json = {};

        Object.keys(this._fields).map((key) => {
            const value = this._fields[key].toJSON(options);

            if (value !== undefined) {
                json[key] = value;
            }
        });

        return json;
    }

    validate (key: string): any {
        if (key) {
            return this._fields[key].validate();
        }

        return Object.keys(this._fields).map((key) => {
            if (typeof this._fields[key].validate === 'function') {
                return this._fields[key].validate();
            }
        });
    }

}

module.exports = ObjectType;
