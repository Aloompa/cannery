'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseType = require('./base');
var parseFields = require('../util/parseFields');
var addListenersUtil = require('../util/addListeners');
var validate = require('valid-point');
var fields = Symbol();
var addListeners = Symbol();
var applyFieldNames = Symbol();
var applyFieldParent = Symbol();

var ObjectType = (function (_BaseType) {
    _inherits(ObjectType, _BaseType);

    function ObjectType(fields) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        _classCallCheck(this, ObjectType);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ObjectType).call(this, options));

        _this.parent = options.parent;
        _this.initialize(fields);
        return _this;
    }

    _createClass(ObjectType, [{
        key: addListeners,
        value: function value() {
            var _this2 = this;

            Object.keys(this[fields]).forEach(function (key) {
                var field = _this2[fields][key];
                addListenersUtil(_this2, field);
            });
        }
    }, {
        key: applyFieldNames,
        value: function value() {
            var _this3 = this;

            Object.keys(this[fields]).forEach(function (key) {
                _this3[fields][key].fieldName = key;
            });
        }
    }, {
        key: applyFieldParent,
        value: function value() {
            var _this4 = this;

            Object.keys(this[fields]).forEach(function (key) {
                _this4[fields][key].parent = _this4.parent;
                if (typeof _this4[fields][key].setParent === 'function') {
                    _this4[fields][key].setParent();
                }
            });
        }
    }, {
        key: 'apply',
        value: function apply(data) {
            var _this5 = this;

            Object.keys(data).forEach(function (key) {
                _this5[fields][key].apply(data[key]);
            });

            return this;
        }
    }, {
        key: 'initialize',
        value: function initialize(initalFields) {
            this[fields] = parseFields(initalFields);
            this[applyFieldNames]();
            this[applyFieldParent]();
            this[addListeners]();
        }
    }, {
        key: 'get',
        value: function get(key) {
            var ArrayType = require('./array');
            var field = this[fields][key];

            // Objects
            if (field instanceof this.constructor) {
                return field;
            }

            // Arrays
            if (field instanceof ArrayType) {
                return field;
            }

            return field.get();
        }
    }, {
        key: 'set',
        value: function set(key, value) {
            this[fields][key].set(value);
            return this;
        }
    }, {
        key: 'toJSON',
        value: function toJSON() {
            var _this6 = this;

            var json = {};

            Object.keys(this[fields]).map(function (key) {
                json[key] = _this6[fields][key].toJSON();
            });

            return json;
        }
    }, {
        key: 'validate',
        value: function validate(key) {
            var _this7 = this;

            if (key) {
                return this[fields][key].validate();
            }

            return Object.keys(this[fields]).map(function (key) {
                return _this7[fields][key].validate();
            });
        }
    }]);

    return ObjectType;
})(BaseType);

module.exports = ObjectType;