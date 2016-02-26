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
            })
            //cubs: define(HasMany, this.constructor),
            //type: define(HasOne, AnimalType)
        };
    }

}

module.exports = Animal;
