/* @flow */

'use strict';

const BaseType = require('./base');

class StringType extends BaseType {

    get () {
        const val = super.get();

        if (val === undefined || val === null) {
            return;
        }

        return String(val);
    }

}

module.exports = StringType;
