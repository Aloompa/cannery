

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseType = require('./base');

var SingleModel = function (_BaseType) {
    _inherits(SingleModel, _BaseType);

    function SingleModel(parentModel, Model) {
        var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

        _classCallCheck(this, SingleModel);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SingleModel).call(this, parentModel, options));

        Object.assign(_this, {
            _ModelConstructor: Model,
            _model: new Model(parentModel),
            _fetched: false
        });
        return _this;
    }

    _createClass(SingleModel, [{
        key: 'off',
        value: function off() {
            var _model;

            (_model = this._model).off.apply(_model, arguments);
            return this;
        }
    }, {
        key: 'on',
        value: function on() {
            var _model2;

            return (_model2 = this._model).on.apply(_model2, arguments);
        }
    }, {
        key: 'emit',
        value: function emit() {
            var _model3;

            (_model3 = this._model).emit.apply(_model3, arguments);
            return this;
        }
    }]);

    return SingleModel;
}(BaseType);

module.exports = SingleModel;