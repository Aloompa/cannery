

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SingleModel = require('./singleModel');

var HasOne = function (_SingleModel) {
    _inherits(HasOne, _SingleModel);

    function HasOne(parentModel, Model, options) {
        _classCallCheck(this, HasOne);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HasOne).apply(this, arguments));

        if (!options.map) {
            throw new Error('The HasOne type must be mapped to an id field');
        }

        _this._map = options.map;
        return _this;
    }

    _createClass(HasOne, [{
        key: 'getId',
        value: function getId() {
            if (!this._map) {
                return;
            }

            return typeof this._map.get === 'function' ? this._map.get() : this._map;
        }
    }, {
        key: 'get',
        value: function get() {
            if (!this._fetched) {
                this._model.id = this.getId();
                this.request();
            }

            return this._model;
        }
    }, {
        key: 'toJSON',
        value: function toJSON() {
            var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            if (options.recursive) {
                return _get(Object.getPrototypeOf(HasOne.prototype), 'toJSON', this).call(this, options);
            }

            return undefined;
        }
    }, {
        key: 'request',
        value: function request() {
            var _this2 = this;

            var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            this._model.getAdapter().fetch(this._model, options, function (data) {
                _this2._fetched = true;
                _this2._model.apply(data);
            });

            return this;
        }
    }]);

    return HasOne;
}(SingleModel);

module.exports = HasOne;