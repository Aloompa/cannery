'use strict';

const BaseType = require('./base');

class DateType extends BaseType {

    apply (val) {
        super.apply(new Date(val));
    }

    toJSON () {
        const date = this.get();

        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    }

}

module.exports = DateType;
