const ObjectType = require('../object');
const StringType = require('../string');
const NumberType = require('../number');
const assert = require('assert');

describe('The Object type', () => {
    describe('When we create an object type', () => {

        it('Should contain the object of types that are passed in', () => {
            const field = new ObjectType({
                id: NumberType
            });

            field.set('id', '2');

            assert.equal(field.get('id'), 2);
        });

        it('Should allow us to set directly on the object by providing a key as the first argument', () => {
            const field = new ObjectType({
                name: StringType
            });

            field.set('name', 1);

            assert.equal(field.get('name'), '1');
        });

        it('Should let us add hooks', () => {
            const field = new ObjectType({
                name: StringType
            }, {
                hooks: {
                    get: (val) => {
                        return `${val}lip`;
                    }
                }
            });

            field.set('name', 'Phil');

            assert.equal(field.get('name'), 'Phillip');
        });

    });
});
