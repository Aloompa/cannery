const ArrayType = require('../array');
const ObjectType = require('../object');
const NumberType = require('../number');
const StringType = require('../string');
const assert = require('assert');

describe('The Array type', () => {
    describe('When we create an array', () => {

        it('Should allow us to add to the array', () => {
            const arr = new ArrayType(NumberType);

            arr.add(1);
            arr.add(2);

            assert.equal(arr.get()[0], 1);
            assert.equal(arr.get()[1], 2);
        });

        it('Should allow us to add to the array at a certain index', () => {
            const arr = new ArrayType(NumberType);

            arr.add(1);
            arr.add(2, 0);

            assert.equal(arr.get()[1], 1);
            assert.equal(arr.get()[0], 2);
        });

        it('Should allow us to move an item from one point to another in the array', () => {
            const arr = new ArrayType(NumberType);

            arr.add(1);
            arr.add(2);

            arr.move(0, 1);

            assert.equal(arr.get()[0], 2);
            assert.equal(arr.get()[1], 1);
        });

        it('Should allow us to remove an item from the array', () => {
            const arr = new ArrayType(NumberType);

            arr.add(1);
            arr.remove(0);

            assert.ok(!arr.get()[0]);
        });

        it('Should allow us to remove all the items from an array', () => {
            const arr = new ArrayType(NumberType);

            arr.add(1);
            arr.add(2);

            assert.equal(arr.get().length, 2);

            arr.removeAll();

            assert.equal(arr.get().length, 0);
        });

        it('Should enforce typing on array items', () => {
            const arr = new ArrayType(StringType);

            arr.add(1);

            assert.equal(arr.get()[0], '1');
        });

        it('Should use the base type if no type is passed in', () => {
            const arr = new ArrayType();

            arr.add({ foo: 'bar' });

            assert.equal(arr.get()[0].foo, 'bar');
        });

        it('Should pass nested fields down to the object type', () => {
            const arr = new ArrayType(ObjectType, {
                name: StringType,
                images: new ObjectType({
                    thumbnail: StringType
                })
            });

            arr.add({
                name: 'Mr Happy Go Lucky',
                images: {
                    thumbnail: '1.jpg'
                }
            });

            assert.equal(arr.get(0).get('name'), 'Mr Happy Go Lucky');
            assert.equal(arr.get(0).get('images').get('thumbnail'), '1.jpg');
        });

        it('Should trigger a userChange when we remove all from an array', (done) => {
            const arr = new ArrayType();

            arr.on('userChange', done);
            arr.removeAll();
        });

        it('Should trigger a change when we remove all from an array', (done) => {
            const arr = new ArrayType();

            arr.on('change', done);
            arr.removeAll();
        });

        it('Should trigger a userChange when we add an item to an array', (done) => {
            const arr = new ArrayType();

            arr.on('userChange', done);
            arr.add(1);
        });

        it('Should trigger a change when we add an item to an array', (done) => {
            const arr = new ArrayType();

            arr.on('change', done);
            arr.add(1);
        });

        it('Should trigger a userChange when we remove an item to an array', (done) => {
            const arr = new ArrayType();

            arr.add(1);
            arr.on('userChange', done);
            arr.remove(0);
        });

        it('Should trigger a change when we remove an item to an array', (done) => {
            const arr = new ArrayType();

            arr.add(1);
            arr.on('change', done);
            arr.remove(0);
        });

        it('Should trigger a userChange when we move an item to an array', (done) => {
            const arr = new ArrayType();

            arr.add(1);
            arr.add(2);
            arr.on('userChange', done);
            arr.move(0, 1);
        });

        it('Should trigger a change when we move an item to an array', (done) => {
            const arr = new ArrayType();

            arr.add(1);
            arr.add(2);
            arr.on('change', done);
            arr.move(0, 1);
        });

        it('Should trigger a userChange when we modify a value inside an array', (done) => {
            const arr = new ArrayType(ObjectType, {
                name: StringType
            });

            arr.add({
                name: 'Mrs Punctuality'
            });

            arr.on('userChange', done);
            arr.get(0).set('name', 'Mrs On Time');
        });

        it('Should trigger a change when we modify a value inside an array', (done) => {
            const arr = new ArrayType(ObjectType, {
                name: StringType
            });

            arr.add({
                name: 'Mrs Punctuality'
            });

            arr.on('change', done);
            arr.get(0).set('name', 'Mrs On Time');
        });
    });
});
