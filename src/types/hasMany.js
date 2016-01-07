const ArrayType = require('./array');
const isFetched = Symbol();
const mapping = Symbol();
const addById = Symbol();
const fetchSuccess = Symbol();
const fetchError = Symbol();

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

    [ fetchSuccess ] (data) {
        this.emit('fetchSuccess');

        return data;
    }

    [ fetchError ] (err) {
        this.emit('fetchError', err);

        return err;
    }

    all (options) {
        if (!this[isFetched]) {
            const Model = this.getType();

            this[isFetched] = true;

            new Model()
                .getAdapter()
                .findAllWithin(Model, this.parent, options)
                .then(this.apply.bind(this))
                .then(this[fetchSuccess].bind(this))
                .catch(this[fetchError].bind(this));
        }

        return super.all();
    }

    instantiateItem (id) {
        const Model = this.getType();
        const model = new Model(id, this.getOptions());

        model.getParent = () => {
            return this.parent;
        };

        return model;
    }

    refresh (options) {
        this[isFetched] = false;

        return this.all(options);
    }

    toJSON () {
        return null;
    }

}

module.exports = HasMany;
