/* @flow */

'use strict';

const EventEmitter = require('cannery-event-emitter');
const addListenersUtil = require('./util/addListeners');
const ObjectType = require('./types/object');
const Adapter = require('./adapters/sessionAdapter');

class Model extends EventEmitter {

    constructor (owner: Object, id: string, options: ?Object) {
        super();

        this._owner = owner;
        this.id = id;

        const fields = this.getFields(...arguments);

        this._fields = new ObjectType(owner, fields, {
            parent: this
        });

        this._isFetched = false;
        this.options = options;

        addListenersUtil(this, this._fields);

        this.on('userChange', () => {
            this._isChanged = true;
        });

        this.on('saving', () => {
            this._isSaving = true;
            this.emit('change');
        });

        this.on('saveSuccess', () => {
            this._isChanged = false;
            this._isSaving = false;
        });

        this.on('saveError', () => {
            this._isSaving = false;
        });
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
        const responseId = data[this.constructor.fieldId];

        if (!this.id) {
            this.id = responseId;
        }

        this._fields.apply(data);
        this._isFetched = true;
        return this;
    }

    define (Type: Function, ...args: any): Object {
        return () => {
            return new Type(this, ...args);
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

    refresh (options: ?Object) {

    }

    set (key: string, value: any): Object {
        this._fields.set(key, value);
        this._isChanged = true;
        return this;
    }

    save (options: Object, single: ?boolean) {

    }

    toJSON (): Object {
        return this._fields.toJSON();
    }

    validate (key: ?string): Object {
        this._fields.validate(key);
        return this;
    }

}

Model.fieldId = 'id';

module.exports = Model;
