/* @flow */

'use strict';

const BaseType = require('./base');

class NumberType extends BaseType {

    get () {
        const val = super.get();

        if (val === undefined || val === null) {
            return;
        }

        return parseFloat(val);
    }

}

module.exports = NumberType;
