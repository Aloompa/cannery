'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmitter = require('cannery-event-emitter');
var snakeCase = require('lodash.snakecase');
var pluralize = require('pluralize');
var ObjectType = require('./types/object');

var Root = function () {
    function Root() {
        _classCallCheck(this, Root);

        var fields = this.getFields.apply(this, arguments);

        this._fields = new ObjectType(this, fields, {
            parent: this
        });
    }

    _createClass(Root, [{
        key: 'apply',
        value: function apply(data) {
            this._fields.apply(data);
            return this;
        }
    }, {
        key: 'define',
        value: function define(Type) {
            var _this = this;

            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            return function () {
                return new (Function.prototype.bind.apply(Type, [null].concat([_this], _toConsumableArray(args))))();
            };
        }
    }, {
        key: 'getFields',
        value: function getFields() {
            throw new Error('The getFields() method is not defined on the Root');
        }
    }, {
        key: 'getScope',
        value: function getScope() {
            return null;
        }
    }, {
        key: 'findOwnsMany',
        value: function findOwnsMany() {
            return null;
        }
    }, {
        key: 'get',
        value: function get(key) {
            return this._fields.get(key);
        }
    }, {
        key: 'set',
        value: function set(key, value) {
            this._fields.set(key, value);
            return this;
        }
    }, {
        key: 'off',
        value: function off() {
            var _fields;

            (_fields = this._fields).off.apply(_fields, arguments);
            return this;
        }
    }, {
        key: 'on',
        value: function on() {
            var _fields2;

            return (_fields2 = this._fields).on.apply(_fields2, arguments);
        }
    }, {
        key: 'emit',
        value: function emit() {
            var _fields3;

            (_fields3 = this._fields).emit.apply(_fields3, arguments);
            return this;
        }
    }, {
        key: 'toJSON',
        value: function toJSON(options) {
            return this._fields.toJSON(options);
        }
    }], [{
        key: 'getKey',
        value: function getKey(singular) {
            var singularKey = snakeCase(this.name);

            if (singular) {
                return singularKey;
            } else {
                return pluralize.plural(singularKey);
            }
        }
    }]);

    return Root;
}();

module.exports = Root;