/* @flow */

const { Model, Types } = require('../../src/index');
const { HasMany, HasOne, StringType, ObjectType, BooleanType } = Types;
const AnimalType = require('./AnimalType');

class Animal extends Model {

    getFields () {
        const animalTypeId = new StringType();

        return {
            animalTypeId,
            id: StringType,
            name: StringType,
            about: this.define(ObjectType, {
                isTame: BooleanType
            }),
            cubs: this.define(HasMany, this.constructor),
            animalType: this.define(HasOne, AnimalType, {
                map: animalTypeId
            })
        };
    }

}

module.exports = Animal;
