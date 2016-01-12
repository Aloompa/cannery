'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HasMany = require('../hasMany');
var StringType = require('../string');
var NumberType = require('../number');
var ArrayType = require('../array');
var assert = require('assert');
var Model = require('../../model');

var FarmAdapter = (function () {
    function FarmAdapter() {
        _classCallCheck(this, FarmAdapter);
    }

    _createClass(FarmAdapter, [{
        key: 'fetch',
        value: function fetch() {
            return Promise.resolve({
                cowIds: [1, 2, 3]
            });
        }
    }]);

    return FarmAdapter;
})();

var CowAdapter = (function () {
    function CowAdapter() {
        _classCallCheck(this, CowAdapter);
    }

    _createClass(CowAdapter, [{
        key: 'findAllWithin',
        value: function findAllWithin(model, Parent) {
            return Promise.resolve([{
                name: 'Sally',
                id: 1
            }, {
                name: 'Bluebell',
                id: 2
            }]);
        }
    }, {
        key: 'fetch',
        value: function fetch() {
            return Promise.resolve({
                name: 'Sally',
                id: 1
            });
        }
    }]);

    return CowAdapter;
})();

var Cow = (function (_Model) {
    _inherits(Cow, _Model);

    function Cow() {
        _classCallCheck(this, Cow);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Cow).apply(this, arguments));
    }

    _createClass(Cow, [{
        key: 'getAdapter',
        value: function getAdapter() {
            return new CowAdapter();
        }
    }, {
        key: 'getFields',
        value: function getFields() {
            return {
                id: NumberType,
                name: StringType
            };
        }
    }]);

    return Cow;
})(Model);

var Farm = (function (_Model2) {
    _inherits(Farm, _Model2);

    function Farm() {
        _classCallCheck(this, Farm);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Farm).apply(this, arguments));
    }

    _createClass(Farm, [{
        key: 'getAdapter',
        value: function getAdapter() {
            return new FarmAdapter();
        }
    }, {
        key: 'getFields',
        value: function getFields() {
            var cowIds = new ArrayType(NumberType);

            return {
                cowIds: cowIds,
                cows: new HasMany(Cow, {
                    map: cowIds
                })
            };
        }
    }]);

    return Farm;
})(Model);

describe('The hasMany type', function () {
    describe('When a model has many of another model', function () {
        it('Should return an array when we get it', function () {
            var farm = new Farm();

            assert.deepEqual(farm.get('cows').all(), []);
        });

        it('Should correctly type a newly added model', function () {
            var farm = new Farm();

            farm.get('cows').add({
                name: 'Betsy'
            });

            assert.equal(farm.get('cows').get(0).get('name'), 'Betsy');
        });

        it('Should update the mapped field to match the hasMany field', function () {
            var farm = new Farm();

            farm.get('cows').add({
                name: 'Betsy',
                id: 22
            });

            farm.get('cows').add({
                name: 'Angus',
                id: 23
            });

            assert.equal(farm.get('cowIds').toJSON()[0], 22);
            assert.equal(farm.get('cowIds').toJSON()[1], 23);
        });

        it('Should not be able to be cast to json', function () {
            var farm = new Farm();

            assert.ok(!farm.get('cows').toJSON());
        });

        it('Should set the parent of nested models to the root model', function () {
            var farm = new Farm(1);

            var parent = farm.get('cows').add({
                name: 'Betsy',
                id: 22
            }).get(0).getParent();

            assert.ok(parent instanceof Farm);
        });

        it('Should perform a findAllWithin call to the adapter to get data', function (done) {
            var farm = new Farm(1);

            farm.get('cows').on('fetchSuccess', function () {
                assert.equal(farm.get('cows').get(1).get('name'), 'Bluebell');
                done();
            });

            farm.get('cows').all();
        });

        it('Should allow us to reload the data', function (done) {
            var farm = new Farm(1);
            var calledCount = 0;

            farm.get('cows').on('fetchSuccess', function () {

                if (!calledCount) {
                    assert.equal(farm.get('cows').get(0).get('name'), 'Sally');

                    CowAdapter.prototype.findAllWithin = function () {
                        return Promise.resolve([{
                            id: 1,
                            name: 'Bluebell'
                        }]);
                    };

                    farm.get('cows').refresh();
                } else {
                    assert.equal(farm.get('cows').get(0).get('name'), 'Bluebell');
                    done();
                }

                calledCount++;
            });

            farm.get('cows').all();
        });

        it('Should emit an error message if there is an adapter error on findAllWithin', function (done) {
            var farm = new Farm(1);

            CowAdapter.prototype.findAllWithin = function () {
                return Promise.reject('Oops');
            };

            farm.get('cows').on('fetchError', function (err) {
                assert.equal(err, 'Oops');
                done();
            });

            farm.get('cows').all();
        });
    });
});