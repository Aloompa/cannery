'use strict';

const ObjectType = require('../object');
const StringType = require('../string');
const NumberType = require('../number');
const BaseType = require('../base');
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

        it('Should emit a change event up from fields underneath', (done) => {
            const name = new StringType();

            const field = new ObjectType({
                name: name
            });

            field.on('change', () => {
                done();
            });

            name.emit('change');
        });

        it('Should emit a userChange event up from fields underneath', (done) => {
            const name = new StringType();

            const field = new ObjectType({
                name: name
            });

            field.on('userChange', () => {
                done();
            });

            name.emit('userChange');
        });

        it('Should emit a fetching event up from fields underneath', (done) => {
            const name = new StringType();

            const field = new ObjectType({
                name: name
            });

            field.on('fetching', () => {
                done();
            });

            name.emit('fetching');
        });

        it('Should emit a fetchSuccess event up from fields underneath', (done) => {
            const name = new StringType();

            const field = new ObjectType({
                name: name
            });

            field.on('fetchSuccess', () => {
                done();
            });

            name.emit('fetchSuccess');
        });

        it('Should emit a fetchError event up from fields underneath', (done) => {
            const name = new StringType();

            const field = new ObjectType({
                name: name
            });

            field.on('fetchError', () => {
                done();
            });

            name.emit('fetchError');
        });

        it('Should allow us to apply an entire object of data', () => {
            const field = new ObjectType({
                name: StringType,
                id: NumberType
            });

            field.apply({
                id: 12,
                name: 'Tyson'
            });

            assert.equal(field.get('name'), 'Tyson');
            assert.equal(field.get('id'), 12);
        });

        it('Should apply the field names to all of the nested types', () => {
            const fullName = new StringType();
            const field = new ObjectType({
                fullName: fullName
            });

            assert.equal(fullName.fieldName, 'fullName');
        });

    });

    describe('When we validate an object', () => {

        it('Should validate all of the nested fields', () => {
            const field = new ObjectType({
                fullName: new BaseType({
                    validations: {
                        required: true
                    }
                })
            });

            assert.throws(() => {
                field.validate();
            }, Error);
        });

        it('Should pass if all of the fields are valid', () => {
            const field = new ObjectType({
                fullName: new BaseType({
                    validations: {
                        required: true
                    }
                })
            });

            field.set('fullName', 'Bartholomew the Clown');

            field.validate();
        });

        it('Should allow us to pass in a key to validate only that item', () => {
            const field = new ObjectType({
                firstName: new BaseType({
                    validations: {
                        required: true
                    }
                }),
                lastName: new BaseType({
                    validations: {
                        required: true
                    }
                })
            });

            assert.throws(() => {
                field.validate('firstName');
            }, Error);

            field.set('firstName', 'Tyson');

            field.validate('firstName');
        });

    });

    it('Should throw an error if we get a key that does not exist', () => {
        const field = new ObjectType({});

        assert.throws(() => {
            field.get('foobar');
        }, Error);
    });

    it('Should not apply data that does have a field', () => {
        const field = new ObjectType({});

        field.apply({
            name: 'Foo'
        });
    });

    it('Should trigger a change event when we apply to the object', (done) => {
        const field = new ObjectType({
            name: BaseType
        });

        field.on('change', () => {
            done();
        });

        field.apply({
            name: 'Foo'
        });
    });

    it('Should have a getFields() method', () => {
        const field = new ObjectType({
            name: BaseType
        });

        assert.equal(field.getFields().name.constructor.name, 'BaseType');
    });
});
