const objectType = require('../object');
const stringType = require('../string');
const numberType = require('../number');
const assert = require('assert');

describe('The Object type', () => {
    describe('When we create an object type', () => {

        it('Should be of a type object', () => {
            const field = objectType();

            assert.equal(field.type, 'object');
        });

        it('Should contain the object of types that are passed in', () => {
            const field = objectType({
                name: stringType,
                id: numberType
            });

            assert.equal(field.fields.name.type, 'string');
            assert.equal(field.fields.id.type, 'number');
        });

    });
});
