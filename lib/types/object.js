

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseType = require('./base');
var MultiModel = require('./multiModel');
var parseFields = require('../util/parseFields');
var validate = require('valid-point');
var debounce = require('lodash.debounce');

var ObjectType = function (_BaseType) {
    _inherits(ObjectType, _BaseType);

    function ObjectType(parentModel, fields, options) {
        _classCallCheck(this, ObjectType);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ObjectType).call(this, parentModel, options || {}));

        _this.initialize(fields);
        return _this;
    }

    _createClass(ObjectType, [{
        key: '_applyFieldNames',
        value: function _applyFieldNames() {
            var _this2 = this;

            Object.keys(this._fields).forEach(function (key) {
                _this2._fields[key].fieldName = key;
            });
        }
    }, {
        key: '_applyFieldParent',
        value: function _applyFieldParent() {
            var _this3 = this;

            Object.keys(this._fields).forEach(function (key) {
                _this3._fields[key].parent = _this3._parent;
            });
        }
    }, {
        key: 'on',
        value: function on(action, callback) {
            var _arguments = arguments,
                _this4 = this;

            var subscriptions = {};

            var debouncedCallback = debounce(function () {
                callback.apply(undefined, _arguments);
            });

            Object.keys(this._fields).forEach(function (key) {
                var field = _this4._fields[key];

                subscriptions[key] = field.on(action, function () {
                    debouncedCallback.apply(undefined, arguments);
                });
            });

            subscriptions.self = _get(Object.getPrototypeOf(ObjectType.prototype), 'on', this).call(this, action, function () {
                debouncedCallback.apply(undefined, arguments);
            });

            return subscriptions;
        }
    }, {
        key: 'off',
        value: function off(actionType, subscriptions) {
            var _this5 = this;

            _get(Object.getPrototypeOf(ObjectType.prototype), 'off', this).call(this, actionType, subscriptions.self);

            delete subscriptions.self;

            Object.keys(subscriptions).forEach(function (key) {
                var field = _this5._fields[key];
                var subscription = subscriptions[key];

                return field.off(actionType, subscription);
            });

            return this;
        }
    }, {
        key: 'apply',
        value: function apply() {
            var _this6 = this;

            var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];


            Object.keys(data).forEach(function (key) {
                if (_this6._fields[key]) {
                    _this6._fields[key].apply(data[key]);
                }
            });

            return this;
        }
    }, {
        key: 'initialize',
        value: function initialize(initalFields) {
            this._fields = parseFields(this._parent, initalFields);
            this._applyFieldNames();
            this._applyFieldParent();
        }
    }, {
        key: 'get',
        value: function get(key) {
            var ArrayType = require('./array');
            var field = this._fields[key];

            if (!field) {
                throw new Error('cannot get "' + key + '." It is undefined in your Cannery model');
            }

            // Objects
            if (field instanceof this.constructor) {
                return field;
            }

            // Arrays
            if (field instanceof ArrayType) {
                return field;
            }

            // MultiModel's
            if (field instanceof MultiModel) {
                return field;
            }

            return field.get();
        }
    }, {
        key: 'set',
        value: function set(key, value) {
            var field = this._fields[key];

            if (!field) {
                throw new Error('cannot set "' + key + '." It is undefined in your Cannery model');
            }

            field.set(value);

            return this;
        }
    }, {
        key: 'toJSON',
        value: function toJSON(options) {
            var _this7 = this;

            var json = {};

            Object.keys(this._fields).map(function (key) {
                var value = _this7._fields[key].toJSON(options);

                if (value !== undefined) {
                    json[key] = value;
                }
            });

            return json;
        }
    }, {
        key: 'validate',
        value: function validate(key) {
            var _this8 = this;

            if (key) {
                return this._fields[key].validate();
            }

            return Object.keys(this._fields).map(function (key) {
                return _this8._fields[key].validate();
            });
        }
    }]);

    return ObjectType;
}(BaseType);

module.exports = ObjectType;