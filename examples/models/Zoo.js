/* @flow */

const { Root, Types } = require('../../src/index');
const { StringType, NumberType, BooleanType, OwnsMany } = Types;
const Exhibit = require('./Exhibit');

class Zoo extends Root {

    getFields (): Object {
        return {
            exhibits: this.define(OwnsMany, Exhibit),
            id: StringType,
            isOpen: BooleanType,
            name: StringType
        };
    }

}

module.exports = Zoo;
