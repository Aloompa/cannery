/* @flow */

'use strict';

const BaseType = require('./base');

class StringType extends BaseType {

    apply (val: string, options: Object = {}): any {
        return super.apply((val) ? String(val) : null, options);
    }

    set (val: ?string): Object {
        super.set((val) ? String(val) : null);

        return this;
    }

}

module.exports = StringType;
