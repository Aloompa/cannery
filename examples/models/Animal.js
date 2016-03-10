/* @flow */

const { Model, Types } = require('../../src/index');
const { HasMany, HasOne, StringType, ObjectType, BooleanType, ArrayType } = Types;
const AnimalType = require('./AnimalType');

class Animal extends Model {

    getFields () {
        const animalTypeId = new StringType(this);
        const cubIds = new ArrayType(this, StringType);

        return {
            animalTypeId,
            id: StringType,
            name: StringType,
            about: this.define(ObjectType, {
                isTame: BooleanType
            }),
            cubIds: cubIds,
            cubs: this.define(HasMany, this.constructor, {
                map: cubIds
            }),
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
