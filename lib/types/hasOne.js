'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseType = require('./base');
var addListenersUtil = require('../util/addListeners');
var model = Symbol();
var map = Symbol();
var updateMapping = Symbol();

var HasOne = (function (_BaseType) {
    _inherits(HasOne, _BaseType);

    function HasOne(Model) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        _classCallCheck(this, HasOne);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HasOne).call(this, options));

        if (!options.map) {
            throw new Error('No map option was specified. HasOne requires a mapped field');
        }

        _this[map] = options.map;
        _this[model] = new Model(_this[map].get());
        return _this;
    }

    _createClass(HasOne, [{
        key: updateMapping,
        value: function value() {
            if (this[map].get() !== this[model].id) {
                this[model].id = this[map].get();
                this[model].emit('change');
            }
        }
    }, {
        key: 'setParent',
        value: function setParent() {
            var _this2 = this;

            this[model].getParent = function () {
                return _this2.parent;
            };

            this[updateMapping]();

            this.parent.on('change', this[updateMapping].bind(this));

            addListenersUtil(this.parent, this[model]);
        }
    }, {
        key: 'get',
        value: function get() {
            return this[model];
        }
    }, {
        key: 'set',
        value: function set() {
            throw new Error('You cannot set directly on a model');
        }
    }]);

    return HasOne;
})(BaseType);

module.exports = HasOne;