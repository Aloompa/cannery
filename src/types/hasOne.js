const BaseType = require('./base');
const addListenersUtil = require('../util/addListeners');
const model = Symbol();
const map = Symbol();
const updateMapping = Symbol();

class HasOne extends BaseType {

    constructor (Model, options = {}) {
        super(options);

        if (!options.map) {
            throw new Error('No map option was specified. HasOne requires a mapped field');
        }

        this[map] = options.map;
        this[model] = new Model(this[map].get());
    }

    [ updateMapping ] () {
        if (this[map].get() !== this[model].id) {
            this[model].id = this[map].get();
            this[model].emit('change');
        }
    }

    setParent () {
        this[model].getParent = () => {
            return this.parent;
        };

        this[updateMapping]();

        this.parent.on('change', this[updateMapping].bind(this));

        addListenersUtil(this.parent, this[model]);
    }

    get () {
        return this[model];
    }

    set () {
        throw new Error('You cannot set directly on a model');
    }

}

module.exports = HasOne;
