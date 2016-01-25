'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ArrayType = require('../array');
var ObjectType = require('../object');
var NumberType = require('../number');
var StringType = require('../string');
var Model = require('../../model');
var assert = require('assert');

var Farmer = function (_Model) {
    _inherits(Farmer, _Model);

    function Farmer() {
        _classCallCheck(this, Farmer);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Farmer).apply(this, arguments));
    }

    _createClass(Farmer, [{
        key: 'getFields',
        value: function getFields() {
            return {
                chickens: new ArrayType(StringType)
            };
        }
    }]);

    return Farmer;
}(Model);

describe('The Array type', function () {
    describe('When we create an array', function () {

        it('Should allow us to add to the array', function () {
            var arr = new ArrayType(NumberType);

            arr.add(1);
            arr.add(2);

            assert.equal(arr.get(0), 1);
            assert.equal(arr.get(1), 2);
        });

        it('Should allow us to add to the array at a certain index', function () {
            var arr = new ArrayType(NumberType);

            arr.add(1);
            arr.add(2, 0);

            assert.equal(arr.get(1), 1);
            assert.equal(arr.get(0), 2);
        });

        it('Should allow us to move an item from one point to another in the array', function () {
            var arr = new ArrayType(NumberType);

            arr.add(1);
            arr.add(2);

            arr.move(0, 1);

            assert.equal(arr.get(0), 2);
            assert.equal(arr.get(1), 1);
        });

        it('Should allow us to remove an item from the array', function () {
            var arr = new ArrayType(NumberType);

            arr.add(1);
            arr.remove(0);

            assert.ok(!arr.get(0));
        });

        it('Should allow us to remove all the items from an array', function () {
            var arr = new ArrayType(NumberType);

            arr.add(1);
            arr.add(2);

            assert.equal(arr.length(), 2);

            arr.removeAll();

            assert.equal(arr.length(), 0);
        });

        it('Should enforce typing on array items', function () {
            var arr = new ArrayType(StringType);

            arr.add(1);

            assert.equal(arr.get(0), '1');
        });

        it('Should use the base type if no type is passed in', function () {
            var arr = new ArrayType();

            arr.add({
                foo: 'bar'
            });

            assert.equal(arr.get(0).foo, 'bar');
        });

        it('Should pass nested fields down to the object type', function () {
            var arr = new ArrayType(ObjectType, {
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

        it('Should trigger a userChange when we remove all from an array', function (done) {
            var arr = new ArrayType();

            arr.on('userChange', done);
            arr.removeAll();
        });

        it('Should trigger a change when we remove all from an array', function (done) {
            var arr = new ArrayType();

            arr.on('change', done);
            arr.removeAll();
        });

        it('Should trigger a userChange when we add an item to an array', function (done) {
            var arr = new ArrayType();

            arr.on('userChange', done);
            arr.add(1);
        });

        it('Should trigger a change when we add an item to an array', function (done) {
            var arr = new ArrayType();

            arr.on('change', done);
            arr.add(1);
        });

        it('Should trigger a userChange when we remove an item to an array', function (done) {
            var arr = new ArrayType();

            arr.add(1);
            arr.on('userChange', done);
            arr.remove(0);
        });

        it('Should trigger a change when we remove an item to an array', function (done) {
            var arr = new ArrayType();

            arr.add(1);
            arr.on('change', done);
            arr.remove(0);
        });

        it('Should trigger a userChange when we move an item to an array', function (done) {
            var arr = new ArrayType();

            arr.add(1);
            arr.add(2);
            arr.on('userChange', done);
            arr.move(0, 1);
        });

        it('Should trigger a change when we move an item to an array', function (done) {
            var arr = new ArrayType();

            arr.add(1);
            arr.add(2);
            arr.on('change', done);
            arr.move(0, 1);
        });

        it('Should trigger a userChange when we modify a value inside an array', function (done) {
            var arr = new ArrayType(ObjectType, {
                name: StringType
            });

            arr.add({
                name: 'Mrs Punctuality'
            });

            arr.on('userChange', done);
            arr.get(0).set('name', 'Mrs On Time');
        });

        it('Should trigger a change when we modify a value inside an array', function (done) {
            var arr = new ArrayType(ObjectType, {
                name: StringType
            });

            arr.add({
                name: 'Mrs Punctuality'
            });

            arr.on('change', done);
            arr.get(0).set('name', 'Mrs On Time');
        });

        it('Should return the array when we get an array type from a model', function () {
            var farmer = new Farmer();

            farmer.get('chickens').add('Wilma');

            assert.equal(farmer.get('chickens').length(), 1);
            assert.equal(farmer.get('chickens').get(0), 'Wilma');
        });

        it('Should provide a forEach shortcut', function () {
            var farmer = new Farmer();

            farmer.get('chickens').add('Cathy').forEach(function (chicken) {
                assert.equal(chicken, 'Cathy');
            });
        });

        it('Should provide a map shortcut', function () {
            var farmer = new Farmer();

            var chickens = farmer.get('chickens').add('Philus').map(function (chicken) {
                return 'Mrs ' + chicken;
            });

            assert.equal(chickens[0], 'Mrs Philus');
        });

        it('Should call the toJSON methods nested down the chain', function () {
            var farmer = new Farmer();

            var chickens = farmer.get('chickens').add('Philus').toJSON();

            assert.equal(chickens[0], 'Philus');
        });
    });
});