'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HasOne = require('../hasOne');
var StringType = require('../string');
var NumberType = require('../number');
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
                farmerId: 2
            });
        }
    }]);

    return FarmAdapter;
})();

var FarmerAdapter = (function () {
    function FarmerAdapter() {
        _classCallCheck(this, FarmerAdapter);
    }

    _createClass(FarmerAdapter, [{
        key: 'fetch',
        value: function fetch() {
            return Promise.resolve({
                name: 'Farmer Jones',
                id: 1
            });
        }
    }]);

    return FarmerAdapter;
})();

var Farmer = (function (_Model) {
    _inherits(Farmer, _Model);

    function Farmer() {
        _classCallCheck(this, Farmer);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Farmer).apply(this, arguments));
    }

    _createClass(Farmer, [{
        key: 'getAdapter',
        value: function getAdapter() {
            return new FarmerAdapter();
        }
    }, {
        key: 'getFields',
        value: function getFields() {
            return {
                name: StringType
            };
        }
    }]);

    return Farmer;
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
            var farmerId = new NumberType();

            var farmer = new HasOne(Farmer, {
                map: farmerId
            });

            return {
                farmerId: farmerId,
                farmer: farmer
            };
        }
    }]);

    return Farm;
})(Model);

describe('The hasOne type', function () {

    describe('When we create a hasOne association', function () {

        it('Should throw an error if no mapping is specified', function () {
            assert.throws(function () {
                new HasOne(Farmer);
            }, Error);
        });

        it('Should should let us get from the model', function () {
            var farm = new Farm();

            farm.get('farmer').set('name', 'Farmer Jones');

            assert.equal(farm.get('farmer').get('name'), 'Farmer Jones');
        });

        it('Should not let us set directly on the model', function () {
            var farm = new Farm();

            assert.throws(function () {
                farm.set('farmer', 'foo');
            });
        });

        it('Should set the parent so we can traverse back up', function () {
            var farm = new Farm();

            assert.equal(farm.get('farmer').getParent(), farm);
        });

        it('Should emit changes to the parent', function (done) {
            var farm = new Farm(1);
            var calledCount = 0;

            farm.on('change', function () {
                if (!calledCount) {
                    done();
                }

                calledCount++;
            });

            farm.get('farmer').set('name', 'Farmer Bill');
        });

        it('Should update the child model when the mapping changes', function (done) {
            var farm = new Farm(1);

            farm.get('farmer').on('change', function () {
                done();
            });
        });
    });
});