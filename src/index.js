'use strict';

const Cannery = {
    Model: require('./model'),
    BaseAdapter: require('./adapter')
    Types: {
        AnyType: require('./types/base'),
        BooleanType: require('./types/boolean'),
        DateType: require('./types/date'),
        StringType: require('./types/string'),
        NumberType: require('./types/number'),
        ArrayType: require('./types/array'),
        ObjectType: require('./types/object'),
        HasMany: require('./types/hasMany'),
        HasOne: require('./types/hasOne')
    }
};

module.exports = Cannery;
