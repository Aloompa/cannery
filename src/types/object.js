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

    apply (data: Object = {}, options: Object = {}): Object {

        Object.keys(data).forEach((key) => {
            if (this._fields[key]) {
                this._fields[key].apply(data[key], options);
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

    validate (key: string): any {
        if (key) {
            return this._fields[key].validate();
        }

        return Object.keys(this._fields).map((key) => {
            if (this._fields[key].validate) {
                return this._fields[key].validate();
            }
        });
    }

}

module.exports = ObjectType;
