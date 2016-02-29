/* @flow */

'use strict';

const EventEmitter = require('cannery-event-emitter');
const BaseType = require('./base');
const ObjectType = require('./object');
const addListenersUtil = require('../util/addListeners');
const validate = require('valid-point');

class ArrayType extends EventEmitter {

    constructor (owner: Object, ArrayType: Function, arrayFields: Object, options: ?Object) {
        super();

        this.owner = owner;
        this.options = options || {};
        this.Type = ArrayType || BaseType;
        this._typeOptions = [];
        this._fields = arrayFields;
        this._typeOptions = this.options;
        this.validations = this.options.validations;
        this.set([]);
    }

    add (item: any, index: number): Object {
        let array = this._typeOptions.slice(0);
        const typedItem = this.instantiateItem(item);

        typedItem.apply(item);

        addListenersUtil(this, typedItem);

        if (typeof index !== 'number') {
            index = array.length;
        }

        array.splice(index, 0, typedItem);

        this.set(array);

        this.emit('userChange');

        return this;
    }

    all (): Array<any> {
        const arr = this._typeOptions.slice(0).map((item) => {

            // Object
            if (item instanceof ObjectType) {
                return item;
            }

            return item.get();
        });

        return arr;
    }

    apply (data: Array<any>): Object {
        const array = data.map((item) => {

            const typedItem = this.instantiateItem(item);

            typedItem.apply(item);

            return typedItem;

        });

        this.set(array);

        return this;
    }

    forEach (callback: Function): void {
        return this.all().forEach(callback);
    }

    get (index: number): any {
        return this.all()[index];
    }

    getType (): Function {
        return this.Type;
    }

    instantiateItem (): Object {
        return new this.Type(Object.assign({}, this._fields), Object.assign({}, this._typeOptions));
    }

    length (): number {
        return this.all().length;
    }

    map (callback: Function): Array<any> {
        return this.all().map(callback);
    }

    move (oldIndex: number, newIndex: number): Object {
        let array = this._typeOptions.slice(0);
        const item = array[oldIndex];

        array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);

        this.set(array);

        this.emit('userChange');

        return this;
    }

    remove (index: number): Object {
        let array = this._typeOptions.slice(0);

        array.splice(index, 1);

        this.set(array);

        this.emit('userChange');

        return this;
    }

    removeAll (): Object {
        this.set([]);

        this.emit('userChange');

        return this;
    }

    set (arr: Array<any>) {
        this._typeOptions = arr;
        this.emit('change');
    }

    toJSON (): Array<any> {
        return this.all();
    }

    validate (noRecursion: boolean) {
        if (!noRecursion && this._typeOptions) {
            this._typeOptions.forEach((arrayItem) => {
                arrayItem.validate();
            });
        }

        if (this.validations) {
            const fieldName = this.validations.field || 'all';

            return validate({
                data: {
                    [ fieldName ]: this.all()
                },
                validations: {
                    [ fieldName ]: this.validations
                }
            });
        }
    }

}

module.exports = ArrayType;
