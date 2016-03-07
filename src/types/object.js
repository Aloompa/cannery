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

    on (action: string, callback: Function): Object {
        const subscriptions = {};

        const debouncedCallback = debounce(() => {
            callback(...arguments);
        });

        Object.keys(this._fields).forEach((key) => {
            const field = this._fields[key];

            subscriptions[key] = field.on(action, () => {
                debouncedCallback(...arguments);
            });
        });

        subscriptions.self = super.on(action, () => {
            debouncedCallback(...arguments);
        });

        return subscriptions;
    }

    off (actionType: string, subscriptions: Object): Object {
        super.off(actionType, subscriptions.self);

        delete subscriptions.self;

        Object.keys(subscriptions).forEach((key) => {
            const field = this._fields[key];
            const subscription = subscriptions[key];

            return field.off(actionType, subscription);
        });

        return this;
    }

    apply (data: Object = {}): Object {

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
            return this._fields[key].validate();
        });
    }

}

module.exports = ObjectType;
