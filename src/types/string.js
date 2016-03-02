/* @flow */

'use strict';

const BaseType = require('./base');

class StringType extends BaseType {

    apply (val: string): any {
        this.set(val);
    }

    set (val: string): any {
        if (val === undefined || val === null) {
            super.set(val);
        }

        super.set(String(val));
    }

}

module.exports = StringType;
