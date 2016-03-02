/* @flow */

const { Root, Types } = require('../../src/index');
const { StringType, NumberType, BooleanType, OwnsMany, ArrayType, OwnsOne } = Types;
const Exhibit = require('./Exhibit');
const Zookeeper = require('./Zookeeper');
const SessionAdapter = require('../../src/adapters/sessionAdapter');

class Zoo extends Root {

    constructor () {
        super(...arguments);

        this.adapter = new SessionAdapter();
    }

    getAdapter () {
        return this.adapter;
    }

    getFields (): Object {

        return {
            exhibits: this.define(OwnsMany, Exhibit, {
                map: 'exhibitIds'
            }),
            id: StringType,
            isOpen: BooleanType,
            name: StringType,
            exhibitIds: this.define(ArrayType, StringType),
            zookeeper: this.define(OwnsOne, Zookeeper)
        };
    }

}

module.exports = Zoo;
