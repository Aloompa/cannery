/* @flow */

'use strict';

const ObjectType = require('./types/object');
const Adapter = require('./adapters/sessionAdapter');
const OwnsMany = require('./types/ownsMany');

class Model {

    static fieldId: string;

    id: string;
    options: ?Object;
    _parent: Object;
    _fields: Object;
    _isFetched: boolean;
    _isChanged: boolean;
    _isSaving: boolean;

    constructor (parentModel: Object, id: string, options: ?Object) {

        this._parent = parentModel;
        this.id = id;

        const fields = this.getFields(...arguments);

        this._fields = new ObjectType(this, fields, {
            parent: this
        });

        this._isFetched = false;
        this.options = options;
    }

    _doFetch (options: ?Object): Object {
        const parent = this._parent;
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
        const fn = () => {
            return new Type(this, ...args);
        };

        fn.Type = Type;
        fn.typeArguments = [...args];

        return fn;
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

    getScope (): Object {
        return this._parent;
    }

    findOwnsMany (Model: Function) {
        let parent = this.getScope();

        if (!parent) {
            return;
        }

        while (parent) {
            const fields = parent.getFields();

            for (let key in fields) {
                const field = fields[key];

                if (field.Type === OwnsMany && field.typeArguments[0] === Model) {
                    return parent.constructor.getKey();
                }
            }

            parent = parent.getScope();
        }
    }

    getAdapter (): Object {
        return this.getScope().getAdapter(...arguments);
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

    static getKey () {
        // TODO
    }

}

Model.fieldId = 'id';

module.exports = Model;
