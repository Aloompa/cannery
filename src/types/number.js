/* @flow */

'use strict';

const BaseType = require('./base');

class NumberType extends BaseType {

    get () {
        const val = super.get();

        if (val === undefined || val === null) {
            return;
        }

        const parsedValue = parseFloat(val);

        if (!parsedValue) {
            return 0;
        }

        return parsedValue;
    }

}

module.exports = NumberType;
