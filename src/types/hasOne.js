const BaseObject = require('./baseObject');
const isFetched = Symbol();

class HasOne extends BaseObject {

    constructor (Model, options = {}) {
        super(options);
        this[isFetched] = false;
        this.map = options.map || `${Model.getName().toLowerCase()}_ids`;
    }

    get (key) {
        const val = super.get(key);

        if (!this[isFetched]) {
            this.fetch();
        }

        return key;
    }

    fetch () {
        
    }

}

module.exports = HasOne;
