/* @flow */

'use strict';

const BaseType = require('./base');
const MultiModel = require('./multiModel');
const parseFields = require('../util/parseFields');
const validate = require('valid-point');
const debounce = require('lodash.debounce');

class ObjectType extends BaseType {

    constructor (parentModel: Object, fields: Object, options: ?Object) {
        super(parentModel, options || {});

        this.initialize(fields);
    }

    _applyFieldNames () {
        Object.keys(this._fields).forEach((key) => {
            this._fields[key].fieldName = key;
        });
    }

    _applyFieldParent () {
        Object.keys(this._fields).forEach((key) => {
            this._fields[key].parent = this._parent;
        });
    }

    apply (data: Object = {}): Object {
        if (!data) {
            return this;
        }

        Object.keys(data).forEach((key) => {
            if (this._fields[key]) {
                this._fields[key].apply(data[key]);
            }
        });

        return this;
    }

    initialize (initalFields: Object) {
        this._fields = parseFields(this._parent, initalFields);
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

    setStateFor (field: string, key: string, value: any): Object {
        if (this._fields[field]) {
            this._fields[field].setState(key, value);
        }

        return this;
    }

    getStateFor (field: string, key: string) {
        if (this._fields[field]) {
            return this._fields[field].getState(key);
        }
    }

    set (key: string, value: any): Object {
        const field = this._fields[key];

        if (!field) {
            throw new Error(`cannot set "${key}." It is undefined in your Cannery model`);
        }

        field.set(value);

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

    validate (key: ?string): any {
        if (key) {
            return this._fields[key].validate();
        }

        const errors = Object.keys(this._fields).map((key) => {
            if (this._fields[key].validate) {
                return {
                    key,
                    error: this._fields[key].validate()
                };
            }
        }).filter((res = {}) => {
            return res.error;
        });

        if (errors.length) {
            const messages = {};

            errors.forEach((item = {}) => {
                messages[item.key] = item.error;
            });

            return messages;
        }
    }

}

module.exports = ObjectType;
