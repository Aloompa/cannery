const BaseObject = require('./baseObject');

class ObjectType extends BaseObject {

    constructor (fields, options = {}) {
        super(options);
        this.initialize(fields);
    }

}

module.exports = ObjectType;
