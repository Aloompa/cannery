'use strict';

const Cannery = {
    Model: require('./model')
};

Cannery.registerType = require('./util/registerType')(Cannery);

module.exports = Cannery
    .registerType('AnyType', require('./types/base'))
    .registerType('BooleanType', require('./types/boolean'))
    .registerType('DateType', require('./types/date'))
    .registerType('StringType', require('./types/string'))
    .registerType('NumberType', require('./types/number'))
    .registerType('ArrayType', require('./types/array'))
    .registerType('ObjectType', require('./types/object'))
    .registerType('HasMany', require('./types/hasMany'))
    .registerType('HasOne', require('./types/hasOne'));
