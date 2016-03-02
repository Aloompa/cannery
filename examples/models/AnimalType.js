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

}

module.exports = AnimalType;
