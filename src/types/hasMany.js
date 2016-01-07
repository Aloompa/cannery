const ArrayType = require('./array');
const mapping = Symbol();
const applyMapping = Symbol();
const addById = Symbol();

class HasMany extends ArrayType {

    constructor (ModelType, options) {
        super(ModelType);

        this[mapping] = options.map;

        this[mapping].toJSON = () => {
            return this.map((model) => {
                return model.get('id');
            });
        };
    }

    [ applyMapping ] () {
        const array = this[mapping].map(this.instantiateItem.bind(this));

        this.set(array);

        return this;
    }

    instantiateItem (id) {
        const Model = this.getType();
        const model = new Model(id, this.getOptions());

        model.getParent = () => {
            return this.parent;
        };

        return model;
    }

    setParent () {
        this.parent.on('change', () => {
            if (!this.length()) {
                this[applyMapping]();
            }
        });

        this[applyMapping]();
    }

    toJSON () {
        return null;
    }

}

module.exports = HasMany;
