/* @flow */

const { Model, Types } = require('../../src/index');
const { StringType, BooleanType, NumberType } = Types;

class Zookeeper extends Model {

    getFields (): Object {
        return {
            id: StringType,
            name: this.define(StringType, {
                hooks: {
                    set: (name) => {
                        return `Mr ${name}`;
                    },
                    get: (name) => {
                        return name.replace('Mr ', '');
                    },
                    apply: () => {
                        return `Mr ${name}`;
                    },
                    toJSON: (name) => {
                        return name.replace('Mr ', '');
                    }
                },
                validations: {
                    isRequired: {
                        message: 'Name is required',
                        fn: (name) => {
                            return !!name;
                        }
                    }
                }
            }),
            isGood: BooleanType,
            luckyNumber: NumberType
        };
    }

    static getKey (singular) {
        return (singular) ? 'zookeeper' : 'zookeepers';
    }

}

module.exports = Zookeeper;
