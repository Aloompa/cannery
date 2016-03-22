/* @flow */

const { Root, Types, TestAdapter } = require('../../src/index');
const { StringType, NumberType, BooleanType, OwnsMany, ArrayType, OwnsOne } = Types;
const Exhibit = require('./Exhibit');
const Zookeeper = require('./Zookeeper');
const AnimalType = require('./AnimalType');

class Zoo extends Root {

    constructor () {
        super(...arguments);

        this.adapter = new TestAdapter();
    }

    getAdapter () {
        return this.adapter;
    }

    getFields (): Object {
        const exhibitIds = new ArrayType(this, NumberType);
        const animalTypeIds = new ArrayType(this, StringType);

        return {
            exhibits: this.define(OwnsMany, Exhibit, {
                map: exhibitIds
            }),
            id: StringType,
            isOpen: BooleanType,
            name: StringType,
            exhibitIds: exhibitIds,
            zookeeper: this.define(OwnsOne, Zookeeper),
            animalTypeIds: animalTypeIds,
            animalTypes: this.define(OwnsMany, AnimalType, {
                map: animalTypeIds
            })
        };
    }

}

module.exports = Zoo;
