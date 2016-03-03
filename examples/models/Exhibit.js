/* @flow */

const { Model, Types } = require('../../src/index');
const { OwnsMany, StringType } = Types;
const Animal = require('./Animal');

class Exhibit extends Model {

    getFields () {
        return {
            animals: this.define(OwnsMany, Animal),
            id: StringType,
            name: StringType
        };
    }

    static getKey (singular) {
        return (singular) ? 'exhibit' : 'exhibits';
    }

}

module.exports = Exhibit;
