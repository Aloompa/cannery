/* @flow */

'use strict';

const Cannery = {
    Model: require('./model'),
    Root: require('./root'),
    BaseAdapter: require('./adapter'),
    Types: {
        AnyType: require('./types/base'),
        BooleanType: require('./types/boolean'),
        DateType: require('./types/date'),
        StringType: require('./types/string'),
        NumberType: require('./types/number'),
        ArrayType: require('./types/array'),
        ObjectType: require('./types/object'),
        HasMany: require('./types/hasMany'),
        HasOne: require('./types/hasOne'),
        OwnsMany: require('./types/ownsMany')
    }
};

module.exports = Cannery;
