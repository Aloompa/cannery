const assert = require('assert');
const Zoo = require('../models/Zoo');

describe('Event bubbling', function () {
    this.timeout(100);

    it('Should emit a change event when we apply to the root', function (done) {
        const zoo = new Zoo();

        zoo.on('change', () => {
            done();
        });

        zoo.apply({
            name: 'The Arkham Zoo'
        });
    });

    it('Should emit a change event when we set to the root', function (done) {
        const zoo = new Zoo();

        zoo.on('change', () => {
            done();
        });

        zoo.set('name', 'The Arkham Zoo');
    });

    it('Should emit a userChange event when we set to the root', function (done) {
        const zoo = new Zoo();

        zoo.on('userChange', () => {
            done();
        });

        zoo.set('name', 'The Arkham Zoo');
    });

    it('Should emit a userChange event when we set to a ownsMany off of the root', function (done) {
        const zoo = new Zoo();
        const exhibit = zoo.get('exhibits').create();

        zoo.on('userChange', () => {
            done();
        });

        exhibit.set('name', 'Panda Express');
    });

    it('Should emit a userChange event when we set to a ownsOne off of the root', function (done) {
        const zoo = new Zoo();
        const zookeeper = zoo.get('zookeeper');

        zoo.on('userChange', () => {
            done();
        });

        zookeeper.set('name', 'Keeper Fred');
    });

    it('Should emit a userChange event when we set to a deeply nested hasMany', function (done) {
        const zoo = new Zoo();
        const exhibit = zoo.get('exhibits').create();
        const bear = exhibit.get('animals').create();
        const cub = bear.get('cubs').create();

        zoo.on('userChange', () => {
            done();
        });

        cub.set('name', 'Little Bear');
    });

    it('Should emit any custom event when we set to a deeply nested hasMany', function (done) {
        const zoo = new Zoo();
        const exhibit = zoo.get('exhibits').create();
        const dog = exhibit.get('animals').create();
        const puppy = dog.get('cubs').create();

        zoo.on('bark', () => {
            done();
        });

        puppy.emit('bark');
    });

});
