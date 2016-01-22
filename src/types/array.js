'use strict';

const BaseType = require('./base');
const ObjectType = require('./object');
const addListenersUtil = require('../util/addListeners');
const fields = Symbol();
const Type = Symbol();
const getTyped = Symbol();
const typeOptions = Symbol();

class ArrayType extends BaseType {

    constructor (ArrayType, arrayFields, options) {
        super(options);

        this[Type] = ArrayType || BaseType;
        this[fields] = arrayFields;
        this[typeOptions] = options;
    }

    [ getTyped ] () {
        const val = super.get();
        return val || [];
    }

    add (item, index) {
        const typedItem = this.instantiateItem(item);
        let array = this[getTyped]();

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
        const Model = require('../model');
        const val = this[getTyped]();

        const arr = val.map((item) => {

            // Object
            if (item instanceof ObjectType) {
                return item;
            }

            // Model
            if (item instanceof Model) {
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

        this.set(array);

        return this;
    }

    forEach (callback) {
        return this.all().forEach(callback);
    }

    get (index) {
        return this.all()[index];
    }

    getOptions () {
        return this[typeOptions];
    }

    getType () {
        return this[Type];
    }

    instantiateItem () {
        return new this[Type](this[fields], this[typeOptions]);
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
