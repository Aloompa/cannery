'use strict';

const BaseType = require('./base');
const ObjectType = require('./object');
const addListenersUtil = require('../util/addListeners');
const isEqual = require('lodash.isequal');
const fields = Symbol();
const Type = Symbol();
const getTyped = Symbol();
const typeOptions = Symbol();

class ArrayType extends BaseType {

    constructor (ArrayType, arrayFields, options) {
        super(options);

        this.Type = ArrayType || BaseType;
        this[fields] = arrayFields;
        this[typeOptions] = options;
    }

    [ getTyped ] () {
        const val = super.get();
        return val || [];
    }

    add (item, index) {
        let array = this[getTyped]();
        const typedItem = this.instantiateItem(item);

        typedItem.apply(item);

        addListenersUtil(this, typedItem);

        if (typeof index !== 'number') {
            index = array.length;
        }

        array.splice(index, 0, typedItem);

        this.set(array);

        return this;
    }

    all () {
        const val = this[getTyped]();

        const arr = val.map((item) => {

            // Object
            if (item instanceof ObjectType) {
                return item;
            }

            return item.get();
        });

        return arr;
    }

    apply (data) {
        const array = data.map((item) => {

            const typedItem = this.instantiateItem(item);

            typedItem.apply(item);

            return typedItem;

        });

        super.apply(array);

        return this;
    }

    forEach (callback) {
        return this.all().forEach(callback);
    }

    get (index) {
        return this.all()[index];
    }

    getType () {
        return this.Type;
    }

    instantiateItem () {
        return new this.Type(Object.assign({}, this[fields]), Object.assign({}, this[typeOptions]));
    }

    isValueChanged (val) {
        return !isEqual(this.get(), val);
    }

    length () {
        return this.all().length;
    }

    map (callback) {
        return this.all().map(callback);
    }

    move (oldIndex, newIndex) {
        let array = this[getTyped]();
        const item = array[oldIndex];

        array.splice(oldIndex, 1);
        array.splice(newIndex, 0, item);

        this.set(array);

        return this;
    }

    remove (index) {
        let array = this[getTyped]();
        array.splice(index, 1);
        this.set(array);

        return this;
    }

    removeAll () {
        this.set([]);

        return this;
    }

    toJSON () {
        return this[getTyped]().map((field) => {
            return field.toJSON();
        });
    }

}

module.exports = ArrayType;
