/* @flow */

const { Model, Types } = require('../../src/index');
const { StringType } = Types;

class AnimalType extends Model {

    getFields () {
        const { define } = this;

        return {
            id: StringType,
            name: StringType
        };
    }

    static getKey (singular) {
        return (singular) ? 'animalType' : 'animalTypes';
    }

}

module.exports = AnimalType;
