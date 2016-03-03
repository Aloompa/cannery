/* @flow */

const { Model, Types } = require('../../src/index');
const { StringType, BooleanType, NumberType } = Types;

class Zookeeper extends Model {

    getFields (): Object {
        return {
            id: StringType,
            name: this.define(StringType, {
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
