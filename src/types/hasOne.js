const BaseType = require('./base');
const model = Symbol();
const map = Symbol();

class HasOne extends BaseType {

    constructor (Model, options = {}) {
        super(options);

        if (!options.map) {
            throw new Error('No map option was specified. HasOne requires a mapped field');
        }

        this[map] = options.map;
        this[model] = new Model(this[map].get());
    }

    setParent () {
        this[model].getParent = () => {
            return this.parent;
        };
    }

    get () {
        return this[model];
    }

    set () {
        throw new Error('You cannot set directly on a model');
    }

}

module.exports = HasOne;
