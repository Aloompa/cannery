const BaseObject = require('./baseObject');

class ObjectType extends BaseObject {

    constructor (fields, options = {}) {
        super(options);
        this.parent = options.parent;
        this.initialize(fields);
    }

}

module.exports = ObjectType;
