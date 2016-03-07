const assert = require('assert');
const Zoo = require('../models/Zoo');

describe('Fetch and save', () => {

    it('Should be possible save a ownsOne model', () => {
        const zoo = new Zoo();
        const zookeeper = zoo.get('zookeeper');

        zookeeper.set('name', 'Zookeeper Sam');

        zoo.getAdapter().checkRequest((request) => {
            assert.equal(request.data.name, 'Zookeeper Sam');
        });

        zookeeper.save();
    });

    it('Should be possible fetch an ownsOne model'/*, (done) => {
        const zoo = new Zoo();
        const zookeeper = zoo.get('zookeeper');

        zoo.getAdapter().mockData({
            name: 'Zookeeper Pete',
            id: '2'
        });

        zoo.on('change', () => {
            const id = zoo.get('zookeeper').get('id');
            assert.equal(id, '2');
            done();
        });

        zoo.get('zookeeper').get('id');
    }*/);

    it('Should be possible to get errors from fetching an ownsOne model', /*(done) => {
        const zoo = new Zoo();
        const zookeeper = zoo.get('zookeeper');

        zoo.getAdapter().mockError('Oh no!');

        zoo.on('error', () => {
            done();
        });

        zoo.get('zookeeper').get('id');
    }*/);

});
