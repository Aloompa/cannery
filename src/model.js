/* @flow */

'use strict';

const EventEmitter = require('cannery-event-emitter');
const snakeCase = require('lodash.snakecase');
const pluralize = require('pluralize');

const addListenersUtil = require('./util/addListeners');
const ObjectType = require('./types/object');
const Adapter = require('./adapters/sessionAdapter');

class Model {

    static fieldId: string;

    id: string;
    options: ?Object;
    _owner: Object;
    _parent: Object;
    _fields: Object;
    _isFetched: boolean;
    _isChanged: boolean;
    _isSaving: boolean;

    constructor (owner: Object, parent: Object, id: string, options: ?Object) {

        this._owner = owner;
        this._parent = parent;
        this.id = id;

        const fields = this.getFields(...arguments);

        this._fields = new ObjectType(owner, this, fields, {
            parent: this
        });

        this._isFetched = false;
        this.options = options;
    }

    _doFetch (options: ?Object): Object {
        const parent = this.getParent();
        const adapter = this.getAdapter();

        options = Object.assign({}, options, this.options);

        if (parent) {
            return adapter.fetchWithin(this, parent, options);

        } else {
            return adapter.fetch(this, options, () => {

            });
        }

    }

    apply (data: Object): Object {
        const responseId = data.id;

        if (!this.id) {
            this.id = responseId;
        }

        this._fields.apply(data);
        this._isFetched = true;
        return this;
    }

    define (Type: Function, ...args: any): Object {
        return () => {
            return new Type(this._owner, this, ...args);
        };
    }

    destroy (options: ?Object): void {
        this.getAdapter()
            .destroy(this, options, () => {

            });
    }

    get (key: string): Object {

        if (!this._isFetched && this.id) {
            this._isFetched = true;
            this.refresh();
        }

        return this._fields.get(key);
    }

    getScope () {
        return this._owner;
    }

    findOwnsMany () {
        // TODO
    }

    getAdapter (): Object {
        return this._owner.getAdapter(...arguments);
    }

    getParent (): any {
        return null;
    }

    getFields (): Object {
        throw new Error('The getFields() method is not defined');
    }

    isChanged (): boolean {
        return this._isChanged;
    }

    isSaving (): boolean {
        return this._isSaving;
    }

    off (): any {
        return this._fields.off(...arguments);
    }

    on (): Function {
        return this._fields.on(...arguments);
    }

    emit (): Object {
        this._fields.emit(...arguments);

        return this;
    }

    refresh (options: ?Object) {

    }

    set (key: string, value: any): Object {
        this._fields.set(key, value);
        this._isChanged = true;
        return this;
    }

    save (options: Object, single: ?boolean) {

    }

    toJSON (options: ?Object): Object {
        return this._fields.toJSON(options);
    }

    validate (key: ?string): Object {
        this._fields.validate(key);
        return this;
    }

    static getKey (singular: ?Boolean): String {
        let singularKey = snakeCase(this.name);

         if (singular) {
             return singularKey;
         } else {
             return pluralize.plural(singularKey);
         }
    }
}

Model.fieldId = 'id';

module.exports = Model;
