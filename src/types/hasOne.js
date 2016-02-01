'use strict';

const BaseType = require('./base');
const addListenersUtil = require('../util/addListeners');
const ModelConstructor = Symbol();
const model = Symbol();
const map = Symbol();
const updateMapping = Symbol();
const getId = Symbol();

class HasOne extends BaseType {

    constructor (Model, options = {}) {
        super(options);

        this.options = options;
        this[map] = options.map;
        this[ModelConstructor] = Model;
    }

    [ getId ] () {
        if (!this[map]) {
            return;
        }
        
        return (typeof this[map].get === 'function') ? this[map].get() : this[map];
    }

    [ updateMapping ] () {
        if (this[getId]() !== this[model].id) {
            this[model].id = this[getId]();
            this[model].emit('change');
        }
    }

    setParent () {
        if (!this[model]) {
            return;
        }

        this[model].getParent = () => {
            return this.parent;
        };

        this[updateMapping]();

        this.parent.on('change', this[updateMapping].bind(this));

        addListenersUtil(this.parent, this[model]);
    }

    get () {
        if (!this[model]) {
            this[model] = new this[ModelConstructor](this[getId](), this.options);
            this.setParent();
        }

        return this[model];
    }

    set () {
        throw new Error('You cannot set directly on a model');
    }

}

module.exports = HasOne;
