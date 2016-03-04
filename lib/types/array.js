

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventEmitter = require('cannery-event-emitter');
var BaseType = require('./base');
var ObjectType = require('./object');
var validate = require('valid-point');

var ArrayType = function (_EventEmitter) {
    _inherits(ArrayType, _EventEmitter);

    function ArrayType(parentModel) {
        var _ArrayType = arguments.length <= 1 || arguments[1] === undefined ? BaseType : arguments[1];

        var arrayFields = arguments[2];
        var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

        _classCallCheck(this, ArrayType);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ArrayType).call(this));

        _this._parent = parentModel;
        _this.options = options;
        _this.Type = _ArrayType;
        _this._typeOptions = [];
        _this._fields = arrayFields;
        _this._typeOptions = _this.options;
        _this.validations = _this.options.validations;
        _this.set([]);
        return _this;
    }

    _createClass(ArrayType, [{
        key: 'add',
        value: function add(item, index) {
            var array = this._typeOptions.slice(0);
            var typedItem = this.instantiateItem(item);

            typedItem.apply(item);

            if (typeof index !== 'number') {
                index = array.length;
            }

            array.splice(index, 0, typedItem);

            this.set(array);

            this.emit('userChange');

            return this;
        }
    }, {
        key: 'all',
        value: function all() {
            var arr = this._typeOptions.slice(0).map(function (item) {

                // Object
                if (item instanceof ObjectType) {
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
        key: 'instantiateItem',
        value: function instantiateItem() {
            return new this.Type(Object.assign({}, this._fields), Object.assign({}, this._typeOptions));
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
            var array = this._typeOptions.slice(0);
            var item = array[oldIndex];

            array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);

            this.set(array);

            this.emit('userChange');

            return this;
        }
    }, {
        key: 'remove',
        value: function remove(index) {
            var array = this._typeOptions.slice(0);

            array.splice(index, 1);

            this.set(array);

            this.emit('userChange');

            return this;
        }
    }, {
        key: 'removeAll',
        value: function removeAll() {
            this.set([]);

            this.emit('userChange');

            return this;
        }
    }, {
        key: 'set',
        value: function set(arr) {
            this._typeOptions = arr;
            this.emit('change');
        }
    }, {
        key: 'toJSON',
        value: function toJSON() {
            return this.all();
        }
    }]);

    return ArrayType;
}(EventEmitter);

module.exports = ArrayType;