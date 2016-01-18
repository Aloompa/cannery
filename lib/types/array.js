'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseType = require('./base');
var ObjectType = require('./object');
var addListenersUtil = require('../util/addListeners');
var fields = Symbol();
var Type = Symbol();
var getTyped = Symbol();
var typeOptions = Symbol();

var ArrayType = (function (_BaseType) {
    _inherits(ArrayType, _BaseType);

    function ArrayType(_ArrayType, arrayFields, options) {
        _classCallCheck(this, ArrayType);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ArrayType).call(this, options));

        _this[Type] = _ArrayType || BaseType;
        _this[fields] = arrayFields;
        _this[typeOptions] = options;
        return _this;
    }

    _createClass(ArrayType, [{
        key: getTyped,
        value: function value() {
            var val = _get(Object.getPrototypeOf(ArrayType.prototype), 'get', this).call(this);
            return val || [];
        }
    }, {
        key: 'add',
        value: function add(item, index) {
            var typedItem = this.instantiateItem(item);
            var array = this[getTyped]();

            typedItem.apply(item);

            addListenersUtil(this, typedItem);

            if (typeof index !== 'number') {
                index = array.length;
            }

            array.splice(index, 0, typedItem);

            this.set(array);

            return this;
        }
    }, {
        key: 'all',
        value: function all() {
            var Model = require('../model');
            var val = this[getTyped]();

            var arr = val.map(function (item) {

                // Object
                if (item instanceof ObjectType) {
                    return item;
                }

                // Model
                if (item instanceof Model) {
                    return item;
                }

                return item.get();
            });

            return arr;
        }
    }, {
        key: 'apply',
        value: function apply(data) {
            var _this2 = this;

            var array = data.map(function (item) {
                var typedItem = _this2.instantiateItem(item);

                typedItem.apply(item);

                return typedItem;
            });

            this.set(array);

            return this;
        }
    }, {
        key: 'forEach',
        value: function forEach(callback) {
            return this.all().forEach(callback);
        }
    }, {
        key: 'get',
        value: function get(index) {
            return this.all()[index];
        }
    }, {
        key: 'getOptions',
        value: function getOptions() {
            return this[typeOptions];
        }
    }, {
        key: 'getType',
        value: function getType() {
            return this[Type];
        }
    }, {
        key: 'instantiateItem',
        value: function instantiateItem() {
            return new this[Type](this[fields], this[typeOptions]);
        }
    }, {
        key: 'length',
        value: function length() {
            return this.all().length;
        }
    }, {
        key: 'map',
        value: function map(callback) {
            return this.all().map(callback);
        }
    }, {
        key: 'move',
        value: function move(oldIndex, newIndex) {
            var array = this[getTyped]();
            var item = array[oldIndex];

            array.splice(oldIndex, 1);
            array.splice(newIndex, 0, item);

            this.set(array);

            return this;
        }
    }, {
        key: 'remove',
        value: function remove(index) {
            var array = this[getTyped]();
            array.splice(index, 1);
            this.set(array);

            return this;
        }
    }, {
        key: 'removeAll',
        value: function removeAll() {
            this.set([]);

            return this;
        }
    }, {
        key: 'toJSON',
        value: function toJSON() {
            return this[getTyped]().map(function (field) {
                return field.toJSON();
            });
        }
    }]);

    return ArrayType;
})(BaseType);

module.exports = ArrayType;