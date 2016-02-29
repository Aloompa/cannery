/* @flow */

const { Root, Types } = require('../../src/index');
const { StringType, NumberType, BooleanType, OwnsMany, ArrayType, OwnsOne } = Types;
const Exhibit = require('./Exhibit');
const Zookeeper = require('./Zookeeper');
const SessionAdapter = require('../../src/adapters/sessionAdapter');

class Zoo extends Root {

    getAdapter () {
        return new SessionAdapter(...arguments);
    }

    getFields (): Object {
        const exhibitIds = this.define(ArrayType, NumberType);

        return {
            exhibits: this.define(OwnsMany, Exhibit, {
                map: exhibitIds
            }),
            id: StringType,
            isOpen: BooleanType,
            name: StringType,
            exhibitIds: exhibitIds,
            zookeeper: this.define(OwnsOne, Zookeeper)
        };
    }

}

module.exports = Zoo;
