const assert = require('assert');
const Zoo = require('../models/Zoo');

describe('Event bubbling', function () {
    this.timeout(100);

    it('Should emit a change event when we apply to the root', function (done) {
        const zoo = new Zoo();

        const change = zoo.on('change', () => {
            zoo.off('change', change);
            done();
        });

        zoo.apply({
            name: 'The Arkham Zoo'
        });
    });

    it('Should emit a change event when we set to the root', function (done) {
        const zoo = new Zoo();

        const change = zoo.on('change', () => {
            zoo.off('change', change);
            done();
        });

        zoo.set('name', 'The Arkham Zoo');
    });

    it('Should emit a userChange event when we set to the root', function (done) {
        const zoo = new Zoo();

        const userChange = zoo.on('userChange', () => {
            zoo.off('userChange', userChange);
            done();
        });

        zoo.set('name', 'The Arkham Zoo');
    });

    it('Should emit a userChange event when we set to a ownsMany off of the root', function (done) {
        const zoo = new Zoo();

        const userChange = zoo.on('userChange', () => {
            zoo.off('userChange', userChange);
            done();
        });

        const exhibit = zoo.get('exhibits').create();

        exhibit.set('name', 'Panda Express');
    });

    it('Should emit a userChange event when we set to a ownsOne off of the root', function (done) {
        const zoo = new Zoo();

        const userChange = zoo.on('userChange', () => {
            zoo.off('userChange', userChange);
            done();
        });

        const zookeeper = zoo.get('zookeeper');

        zookeeper.set('name', 'Keeper Fred');
    });

    it('Should emit a userChange event when we set to a deeply nested hasMany', function (done) {
        const zoo = new Zoo();

        const userChange = zoo.on('userChange', () => {
            zoo.off('userChange', userChange);
            done();
        });

        const exhibit = zoo.get('exhibits').create();
        const bear = exhibit.get('animals').create();
        const cub = bear.get('cubs').create();

        cub.set('name', 'Little Bear');
    });

    it('Should emit any custom event when we set to a deeply nested hasMany', function (done) {
        const zoo = new Zoo();

        const bark = zoo.on('bark', () => {
            zoo.off('bark', bark);
            done();
        });

        const exhibit = zoo.get('exhibits').create();
        const dog = exhibit.get('animals').create();
        const puppy = dog.get('cubs').create();

        puppy.emit('bark');
    });

    it('Should be possible to emit on the root', (done) => {
        const zoo = new Zoo();

        const onOpenZoo = zoo.on('open', () => {
            zoo.off('open', onOpenZoo);
            done();
        });

        zoo.emit('open');
    });

});
