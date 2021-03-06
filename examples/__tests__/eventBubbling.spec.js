 'use strict';

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

        zoo.apply({
            animalTypes: [{
                id: '1',
                name: 'Lion'
            }],
            exhibits: [{
                id: '1',
                animals: [{
                    id: '1'
                }, {
                    id: '2'
                }]
            }]
        });

        const exhibit = zoo.get('exhibits').get('1');
        const bear = exhibit.get('animals').get('1');
        const cub = exhibit.get('animals').get('2');

        bear.get('cubs').add(cub);
    });

    it('Should let us add an event listener after creating models and still be able to listen on them', function (done) {
        const zoo = new Zoo();

        zoo.apply({
            exhibits: [{
                id: '1',
                animals: [{
                    id: '1',
                    cubIds: ['2']
                }, {
                    id: '2'
                }]
            }]
        });

        const exhibit = zoo.get('exhibits').get('1');
        const bear = exhibit.get('animals').get('1');
        const cub = bear.get('cubs').get('2');

        const userChange = zoo.on('userChange', () => {
            zoo.off('userChange', userChange);
            done();
        });

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
        const puppy = exhibit.get('animals').create();
        puppy.apply({id: '4'});

        dog.get('cubs').add(puppy);

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

    it('Should not emit a bunch of times when the same event is triggered on the same tick');

    it('Should emit both events of different types if they are performered on the same tick', (done) => {
        const zoo = new Zoo();
        let called = false;

        const cb = () => {
            if (called) {
                done();
                zoo.off('first', onFirst);
                zoo.off('second', onSecond);

            } else {
                called = true;
            }
        };

        const onFirst = zoo.on('first', cb);
        const onSecond = zoo.on('second', cb);

        zoo.emit('first');
        zoo.emit('second');
    });

    it('Should emit both events of the same type if they are spaced out', (done) => {
        const zoo = new Zoo();
        let called = false;

        const onAlert = zoo.on('alert', () => {
            if (called) {
                done();
                zoo.off('alert', onAlert);
            } else {
                called = true;
            }
        });

        zoo.emit('alert');

        setTimeout(() => {
            zoo.emit('alert');
        }, 50);
    });

    it('Should emit HasOne events up to the root', (done) => {
        const zoo = new Zoo();

        zoo.apply({
            animalTypes: [{
                id: '1',
                name: 'Lion'
            }],
            exhibits: [{
                id: '1',
                animalIds: ['1'],
                animals: [{
                    id: '1',
                    animalTypeId: '1'
                }]
            }]
        });

        const animal = zoo.get('exhibits').get('1').get('animals').get('1');
        const animalType = animal.get('animalType');

        zoo.once('userChange', () => {
            done();
        });

        animalType.set('name', 'Bears');
    });

});
