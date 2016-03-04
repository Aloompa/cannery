/* @flow */

'use strict';

const BaseType = require('./base');

class StringType extends BaseType {

    apply (val: string): any {
        return this.set(val);
    }

    set (val: ?string): Object {
        super.set((val) ? String(val) : null);

        return this;
    }

}

module.exports = StringType;
