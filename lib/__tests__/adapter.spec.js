'use strict';

var Adapter = require('../adapter');
var assert = require('assert');

describe('The base adapter', function () {
    describe('When we call the create method', function () {
        it('should return a promise', function (done) {
            var adapter = new Adapter();

            adapter.create({}).then(function () {
                done();
            });
        });
    });

    describe('When we call the destroy method', function () {
        it('should return a promise', function (done) {
            var adapter = new Adapter();

            adapter.destroy(1).then(function () {
                done();
            });
        });
    });

    describe('When we call the findAll method', function () {
        it('should return a promise', function (done) {
            var adapter = new Adapter();

            adapter.findAll().then(function () {
                done();
            });
        });
    });

    describe('When we call the findOne method', function () {
        it('should return a promise', function (done) {
            var adapter = new Adapter();

            adapter.findOne({}).then(function () {
                done();
            });
        });
    });

    describe('When we get the model', function () {
        it('should return the model', function () {
            var adapter = new Adapter('myModel');

            assert.equal(adapter.getModel(), 'myModel');
        });
    });

    describe('When we call the update method', function () {
        it('should return a promise', function (done) {
            var adapter = new Adapter();

            adapter.update(1, {}).then(function () {
                done();
            });
        });
    });
});