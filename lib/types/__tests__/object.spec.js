'use strict';

var ObjectType = require('../object');
var StringType = require('../string');
var NumberType = require('../number');
var BaseType = require('../base');
var assert = require('assert');

describe('The Object type', function () {
    describe('When we create an object type', function () {

        it('Should contain the object of types that are passed in', function () {
            var field = new ObjectType({
                id: NumberType
            });

            field.set('id', '2');

            assert.equal(field.get('id'), 2);
        });

        it('Should allow us to set directly on the object by providing a key as the first argument', function () {
            var field = new ObjectType({
                name: StringType
            });

            field.set('name', 1);

            assert.equal(field.get('name'), '1');
        });

        it('Should let us add hooks', function () {
            var field = new ObjectType({
                name: StringType
            }, {
                hooks: {
                    get: function get(val) {
                        return val + 'lip';
                    }
                }
            });

            field.set('name', 'Phil');

            assert.equal(field.get('name'), 'Phillip');
        });

        it('Should emit a change event up from fields underneath', function (done) {
            var name = new StringType();

            var field = new ObjectType({
                name: name
            });

            field.on('change', function () {
                done();
            });

            name.emit('change');
        });

        it('Should emit a userChange event up from fields underneath', function (done) {
            var name = new StringType();

            var field = new ObjectType({
                name: name
            });

            field.on('userChange', function () {
                done();
            });

            name.emit('userChange');
        });

        it('Should emit a fetching event up from fields underneath', function (done) {
            var name = new StringType();

            var field = new ObjectType({
                name: name
            });

            field.on('fetching', function () {
                done();
            });

            name.emit('fetching');
        });

        it('Should emit a fetchSuccess event up from fields underneath', function (done) {
            var name = new StringType();

            var field = new ObjectType({
                name: name
            });

            field.on('fetchSuccess', function () {
                done();
            });

            name.emit('fetchSuccess');
        });

        it('Should emit a fetchError event up from fields underneath', function (done) {
            var name = new StringType();

            var field = new ObjectType({
                name: name
            });

            field.on('fetchError', function () {
                done();
            });

            name.emit('fetchError');
        });

        it('Should allow us to apply an entire object of data', function () {
            var field = new ObjectType({
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

        it('Should apply the field names to all of the nested types', function () {
            var fullName = new StringType();
            var field = new ObjectType({
                fullName: fullName
            });

            assert.equal(fullName.fieldName, 'fullName');
        });
    });

    describe('When we validate an object', function () {

        it('Should validate all of the nested fields', function () {
            var field = new ObjectType({
                fullName: new BaseType({
                    validations: {
                        required: true
                    }
                })
            });

            assert.throws(function () {
                field.validate();
            }, Error);
        });

        it('Should pass if all of the fields are valid', function () {
            var field = new ObjectType({
                fullName: new BaseType({
                    validations: {
                        required: true
                    }
                })
            });

            field.set('fullName', 'Bartholomew the Clown');

            field.validate();
        });
    });
});