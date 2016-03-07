/* @flow */

const { Model, Types } = require('../../src/index');
const { OwnsMany, StringType, ArrayType } = Types;
const Animal = require('./Animal');

class Exhibit extends Model {

    getFields () {
        return {
            animals: this.define(OwnsMany, Animal, {map: 'animalIds'}),
            animalIds: this.define(ArrayType, StringType),
            id: StringType,
            name: StringType
        };
    }

}

module.exports = Exhibit;
