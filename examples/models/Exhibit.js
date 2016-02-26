const { Model, Types } = require('../../src/index');
const { OwnsMany, StringType } = Types;
const Animal = require('./Animal');

class Exhibit extends Model {

    getFields () {
        const { define } = this;

        return {
            animals: define(OwnsMany, Animal),
            id: StringType,
            name: StringType
        };
    }

}

module.exports = Exhibit;
