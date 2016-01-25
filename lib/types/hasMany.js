'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ArrayType = require('./array');
var eventTypes = require('../util/eventTypes');
var isFetched = Symbol();
var mapping = Symbol();
var addById = Symbol();
var fetchSuccess = Symbol();
var fetchError = Symbol();
var modelIds = Symbol();

var HasMany = function (_ArrayType) {
    _inherits(HasMany, _ArrayType);

    function HasMany(ModelType) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        _classCallCheck(this, HasMany);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HasMany).call(this, ModelType));

        _this.options = options;
        _this[modelIds] = {};

        if (options.map) {
            _this[mapping] = options.map;

            _this[mapping].toJSON = function () {
                return _this.map(function (model) {
                    return model.get('id');
                });
            };
        }
        return _this;
    }

    _createClass(HasMany, [{
        key: fetchSuccess,
        value: function value(data) {
            this.emit('fetchSuccess');

            return data;
        }
    }, {
        key: fetchError,
        value: function value(err) {
            this.emit('fetchError', err);

            return err;
        }
    }, {
        key: 'all',
        value: function all(options) {
            if (!this[isFetched]) {
                var Model = this.getType();

                this[isFetched] = true;

                new Model().getAdapter().findAllWithin(Model, this.parent, Object.assign({}, this.options, options)).then(this.apply.bind(this)).then(this[fetchSuccess].bind(this)).catch(this[fetchError].bind(this));
            }

            return _get(Object.getPrototypeOf(HasMany.prototype), 'all', this).call(this);
        }
    }, {
        key: 'call',
        value: function call(method, options) {
            return this.getType()[method](this.options, options);
        }
    }, {
        key: 'getById',
        value: function getById(id) {
            var _this2 = this;

            if (this[modelIds][id]) {
                return this[modelIds][id];
            }

            var filteredModels = this.all().filter(function (model) {
                return model.get('id') === id;
            });

            if (filteredModels.length === 1) {
                return filteredModels[0];
            }

            var Model = this.getType();
            var model = new Model(id);

            model.getPath = function () {
                return _this2.parent.getName() + '/' + _this2.parent.id + '/' + model.getName() + '/' + id;
            };

            model.getParent = function () {
                return _this2.parent;
            };

            this[modelIds][id] = model;

            return model;
        }
    }, {
        key: 'instantiateItem',
        value: function instantiateItem(data) {
            var _this3 = this;

            var Model = this.getType();
            var model = new Model(data.id, this.getOptions());

            eventTypes.forEach(function (eventType) {
                model.on(eventType, function () {
                    _this3.emit(eventType);
                });
            });

            model.getParent = function () {
                return _this3.parent;
            };

            this[modelIds][data.id] = model;

            return model;
        }
    }, {
        key: 'refresh',
        value: function refresh(options) {
            this[isFetched] = false;

            return this.all(options);
        }
    }, {
        key: 'toJSON',
        value: function toJSON() {
            return null;
        }
    }]);

    return HasMany;
}(ArrayType);

module.exports = HasMany;