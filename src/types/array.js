/* @flow */

'use strict';

const EventEmitter = require('cannery-event-emitter');
const BaseType = require('./base');
const ObjectType = require('./object');
const validate = require('valid-point');

class ArrayType extends EventEmitter {

    constructor (parentModel: Object, ArrayType: Function = BaseType, arrayFields: Object, options: Object = {}) {
        super();

        this._parent = parentModel;
        this.options = options;
        this.Type = ArrayType;
        this._typedArray = [];
        this._fields = arrayFields;
        this._typeOptions = this.options;
        this.validations = this.options.validations;

        if (parentModel && parentModel.emit) {
            this.on('*', function () {
                parentModel.emit(...arguments);
            });
        }
    }

    _userChange (array: Array<any>): Object {
        this.set(array);

        this.emit('userChange');
        this.emit('change');

        return this;
    }

    add (item: any, index: number): Object {
        let array = this._clone();
        const typedItem = this.instantiateItem(item);

        typedItem.apply(item);

        if (typeof index !== 'number') {
            index = array.length;
        }

        array.splice(index, 0, typedItem);

        return this._userChange(array);
    }

    all (): Array<any> {
        const arr = this._typedArray.map((item) => {

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
        let array = this._clone();
        const item = array[oldIndex];

        array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);

        return this._userChange(array);
    }

    remove (index: number): Object {
        let array = this._clone();

        array.splice(index, 1);

        return this._userChange(array);
    }

    removeAll (): Object {
        return this._userChange([]);
    }

    _clone (): Array<Object> {
        return this._typedArray.slice(0);
    }

    set (arr: Array<any>) {
        this._typedArray = arr;
        this.emit('change');
    }

    toJSON (): Array<any> {
        return this.all();
    }

}

module.exports = ArrayType;
