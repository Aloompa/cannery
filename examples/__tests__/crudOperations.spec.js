const assert = require('assert');
const Zoo = require('../models/Zoo');

describe('CRUD Operations', () => {

    it('Should be possible save a ownsOne model', () => {
        const zoo = new Zoo();
        const zookeeper = zoo.get('zookeeper');

        zookeeper.set('name', 'Zookeeper Sam');

        zoo.getAdapter().checkRequest((request) => {
            assert.equal(request.payload.name, 'Zookeeper Sam');
        });

        zookeeper.save();
    });

    it('Should be possible fetch an ownsMany model', (done) => {
        const zoo = new Zoo();
        const exhibit = zoo.get('exhibits').create();
        const animals = exhibit.get('animals');

        animals.create().getAdapter().mockData([{
            id: '1',
            name: 'Cobra'
        }]);

        const onChange = animals.on('change', () => {
            assert.equal(animals.get('1').get('name'), 'Cobra');
            animals.off('change', onChange);
            done();
        });

        animals.all();
    });

    it('Should be possible fetch a single record from an ownsMany model', (done) => {
        const zoo = new Zoo();
        const exhibit = zoo.get('exhibits').create();
        const animals = exhibit.get('animals');

        animals.create().getAdapter().mockData({
            id: '2',
            name: 'Viper'
        });

        const onChange = animals.on('change', () => {
            assert.equal(animals.get('2').get('name'), 'Viper');
            animals.off('change', onChange);
            done();
        });

        animals.get('2');
    });

    it('Should be possible get errors emitted from single fetch to ownsMany', (done) => {
        const zoo = new Zoo();
        const exhibit = zoo.get('exhibits').create();
        const animals = exhibit.get('animals');

        animals.create().getAdapter().mockError('Oops!');

        const onError = zoo.on('error', (message) => {
            assert.equal(message, 'Oops!');
            zoo.off('error', onError);
            done();
        });

        animals.all();
    });

    it('Should be possible get errors emitted from single fetch to ownsMany', (done) => {
        const zoo = new Zoo();
        const exhibit = zoo.get('exhibits').create();
        const animals = exhibit.get('animals');

        animals.create().getAdapter().mockError('Pete did it!');

        const onError = zoo.on('error', (message) => {
            assert.equal(message, 'Pete did it!');
            zoo.off('error', onError);
            done();
        });

        animals.get('2');
    });

});
