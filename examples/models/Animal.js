/* @flow */

const { Model, Types } = require('../../src/index');
const { HasMany, HasOne, StringType, ObjectType, BooleanType } = Types;
const AnimalType = require('./AnimalType');

class Animal extends Model {

    getFields () {
        const animalTypeId = new StringType(this);

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

    static getKey (singular) {
        return (singular) ? 'animal' : 'animals';
    }

}

module.exports = Animal;
