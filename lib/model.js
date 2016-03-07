

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmitter = require('cannery-event-emitter');
var snakeCase = require('lodash.snakecase');
var pluralize = require('pluralize');
var ObjectType = require('./types/object');
var Adapter = require('./adapters/sessionAdapter');
var OwnsMany = require('./types/ownsMany');

var Model = function () {
    function Model(parentModel, id, options) {
        _classCallCheck(this, Model);

        this._parent = parentModel;
        this.id = id;

        var fields = this.getFields.apply(this, arguments);

        this._fields = new ObjectType(this, fields, {
            parent: this
        });

        this.options = options;
        this.state = {};
    }

    _createClass(Model, [{
        key: 'setState',
        value: function setState(key, value) {
            this.state[key] = value;
            this.emit('change');

            return this;
        }
    }, {
        key: 'getState',
        value: function getState(key) {
            return this.state[key];
        }
    }, {
        key: 'apply',
        value: function apply(data) {
            var responseId = data[this.constructor.getFieldId()];

            if (!this.id) {
                this.id = responseId;
            }

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

            var fn = function fn() {
                return new (Function.prototype.bind.apply(Type, [null].concat([_this], _toConsumableArray(args))))();
            };

            fn.Type = Type;
            fn.typeArguments = [].concat(_toConsumableArray(args));

            return fn;
        }

        // TODO: Move this into the destroy() method once the test adapter lets us mock responses

    }, {
        key: '_afterDestroy',
        value: function _afterDestroy(response) {
            var ownsManyOwner = this.findOwnsMany(this.constructor);

            if (ownsManyOwner) {
                ownsManyOwner._remove(this);
            }

            this.setState('isDestroyed', true);
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            var _this2 = this;

            var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            this.getAdapter().destroy(this, options, function (response) {
                _this2._afterDestroy(response);
            });

            return this;
        }
    }, {
        key: 'get',
        value: function get(key) {
            return this._fields.get(key);
        }
    }, {
        key: 'getScope',
        value: function getScope() {
            return this._parent;
        }
    }, {
        key: 'findOwnsMany',
        value: function findOwnsMany(Model) {
            var parent = this.getScope();

            while (parent) {
                var fields = parent.getFields();

                for (var key in fields) {
                    var field = fields[key];

                    if (field.Type === OwnsMany && field.typeArguments[0] === Model) {
                        return parent.get(key);
                    }
                }

                parent = parent.getScope();
            }
        }
    }, {
        key: 'getAdapter',
        value: function getAdapter() {
            var _getScope;

            return (_getScope = this.getScope()).getAdapter.apply(_getScope, arguments);
        }
    }, {
        key: 'getFields',
        value: function getFields() {
            throw new Error('The getFields() method is not defined');
        }
    }, {
        key: 'off',
        value: function off() {
            var _fields;

            return (_fields = this._fields).off.apply(_fields, arguments);
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
        key: 'set',
        value: function set(key, value) {
            this._fields.set(key, value);
            this.setState('isChanged', true);
            return this;
        }
    }, {
        key: 'toJSON',
        value: function toJSON(options) {
            return this._fields.toJSON(options);
        }
    }, {
        key: 'validate',
        value: function validate(key) {
            this._fields.validate(key);
            return this;
        }
    }, {
        key: 'save',
        value: function save() {
            var _this3 = this;

            var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
            var single = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

            var saveType = this.id ? 'update' : 'create';

            if (!this.getState('isChanged')) {
                return this;
            }

            try {
                this.validate();
            } catch (e) {
                this.emit('saveError', e);
                return this;
            }

            this.setState('saving', true);

            this.getAdapter()[saveType](this, this.getScope(), options, function (response) {
                _this3.setState('saving', false);
                _this3.setState('isChanged', false);
                _this3.apply(response);
            });

            return this;
        }
    }, {
        key: 'create',
        value: function create() {
            var Field = this.define.apply(this, arguments);
            return new Field();
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
    }, {
        key: 'getFieldId',
        value: function getFieldId() {
            return 'id';
        }
    }]);

    return Model;
}();

module.exports = Model;