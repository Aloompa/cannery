/* @flow */

const { Model, Types } = require('../../src/index');
const { HasMany, HasOne, StringType, ObjectType, BooleanType } = Types;
const AnimalType = require('./AnimalType');

class Animal extends Model {

    getFields () {
        return {
            id: StringType,
            name: StringType,
            about: this.define(ObjectType, {
                isTame: BooleanType
            }),
            cubs: this.define(HasMany, this.constructor),
            animalType: this.define(HasOne, AnimalType)
        };
    }

}

module.exports = Animal;
