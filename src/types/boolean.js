const BaseType = require('./base');

class BooleanType extends BaseType {

    get () {
        const val = super.get();

        let parseVal = Boolean(val);

        if (val === 'false') {
            parseVal = false;
        }

        return parseVal;
    }

}

module.exports = BooleanType;
