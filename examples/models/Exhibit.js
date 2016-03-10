/* @flow */

const { Model, Types } = require('../../src/index');
const { OwnsMany, StringType, ArrayType } = Types;
const Animal = require('./Animal');

class Exhibit extends Model {

    getFields () {
        const animalIds = new ArrayType(this, StringType);

        return {
            animals: this.define(OwnsMany, Animal, {
                map: animalIds
            }),
            animalIds: animalIds,
            id: StringType,
            name: StringType
        };
    }

    static getKey (singular) {
        return (singular) ? 'exhibit' : 'exhibits';
    }

}

module.exports = Exhibit;
