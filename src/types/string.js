/* @flow */

'use strict';

const BaseType = require('./base');

class StringType extends BaseType {

    _parseString (val: ?string): string {
        return (val) ? String(val) : null;
    }

    apply (val: string): any {
        return super.apply(this._parseString(val));
    }

    set (val: ?string): Object {
        return super.set(this._parseString(val));
    }

}

module.exports = StringType;
