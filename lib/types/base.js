

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventEmitter = require('cannery-event-emitter');
var _validate = require('valid-point');

var BaseType = function (_EventEmitter) {
    _inherits(BaseType, _EventEmitter);

    function BaseType(parentModel) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        _classCallCheck(this, BaseType);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BaseType).call(this));

        _this._parent = parentModel;

        _this.validations = options.validations;
        _this._applyHooks(options.hooks);
        return _this;
    }

    _createClass(BaseType, [{
        key: 'apply',
        value: function apply(val) {
            this._value = val;
            this.emit('change');

            return this;
        }
    }, {
        key: 'get',
        value: function get(key) {
            return this._value;
        }
    }, {
        key: 'set',
        value: function set(val) {
            this._value = val;
            this.emit('change');
            this.emit('userChange');
            return this;
        }
    }, {
        key: 'toJSON',
        value: function toJSON() {
            return this._value;
        }
    }, {
        key: 'validate',
        value: function validate(key) {
            if (this.validations) {
                return _validate({
                    data: _defineProperty({}, this.fieldName, this._value),
                    validations: _defineProperty({}, this.fieldName, this.validations)
                });
            }
        }
    }, {
        key: '_applyHooks',
        value: function _applyHooks() {
            var _this2 = this;

            var hooks = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            Object.keys(hooks).forEach(function (key) {
                var originalMethod = _this2[key];

                if (key === 'apply' || key === 'set') {
                    _this2[key] = function (val) {
                        return originalMethod.call(this, hooks[key](val));
                    };

                    return;
                }

                _this2[key] = function () {
                    var val = originalMethod.apply(this, arguments);
                    return hooks[key](val);
                };
            });
        }
    }]);

    return BaseType;
}(EventEmitter);

module.exports = BaseType;