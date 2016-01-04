const BaseType = require('./base');

class NumberType extends BaseType {

    get () {
        const val = super.get();
        return parseFloat(val);
    }

}

module.exports = NumberType;
