const ArrayType = require('./array');
const mapping = Symbol();
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

    instantiateItem (id) {
        const Model = this.getType();
        const model = new Model(id, this.getOptions());

        model.getParent = () => {
            return this.parent;
        };

        return model;
    }

    toJSON () {
        return null;
    }

}

module.exports = HasMany;
