const BaseType = require('./base');

class StringType extends BaseType {

    get () {
        const val = super.get();
        return String(val);
    }

}

module.exports = StringType;
