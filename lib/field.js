'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var debug = require('debug')('cannery-field');
var _validate = require('valid-point');
var EventEmitter = require('cannery-event-emitter');

var noop = function noop() {};

var Field = (function (_EventEmitter) {
    _inherits(Field, _EventEmitter);

    function Field(_ref) {
        var fields = _ref.fields;
        var data = _ref.data;
        var change = _ref.change;
        var userChange = _ref.userChange;
        var rootUrl = _ref.rootUrl;

        _classCallCheck(this, Field);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Field).call(this, {
            throttle: 50
        }));

        _this.on('change', change || noop);
        _this.on('userChange', userChange || noop);
        _this.rootUrl = rootUrl;
        _this._fields = fields;
        _this._objectFields = {};

        _this.initialize(data);
        return _this;
    }

    _createClass(Field, [{
        key: 'initialize',
        value: function initialize(data) {
            this._data = this.applyData(data);

            for (var field in this._objectFields) {
                if (!this._fields[field].model) {
                    this._objectFields[field].initialize(this._data[field]);
                }
            }
        }

        /**
         * @private
         * @method applyData
         * @param {object} data
         */

    }, {
        key: 'applyData',
        value: function applyData(data) {
            var obj = {};
            for (var key in data) {

                /* istanbul ignore else */
                if (data.hasOwnProperty(key)) {
                    if (this._fields[key] && this._fields[key].hooks && this._fields[key].hooks.pullFilter) {
                        obj[key] = this._fields[key].hooks.pullFilter(data[key]);
                    } else {
                        obj[key] = data[key];
                    }
                }
            }

            return obj;
        }

        /**
         * @private
         * @method applyHook
         * @description Apply a hook given a specific field
         * @param  {String} hook  Hook to apply
         * @param  {String} field Field name
         * @return {mixed}  Returns hook's return value
         */

    }, {
        key: 'applyHook',
        value: function applyHook(hook, field, value) {
            var hooks = this._fields[field].hooks;

            if (hooks && hooks[hook]) {
                return hooks[hook](value, field);
            } else {
                return value;
            }
        }

        /**
         * @private
         * @method trickleSave
         */

    }, {
        key: 'trickleSave',
        value: function trickleSave() {
            var _this2 = this;

            var promises = [];
            Object.keys(this._fields).forEach(function (name) {
                var field = _this2._fields[name];
                if (field.model && field.userChanged && !field.saveAs) {
                    (function () {
                        var model = _this2._objectFields[name];
                        var save = undefined;

                        // One to one relationships
                        if (field.type === 'object') {
                            save = model.save().then(function (response) {
                                field.userChanged = false;
                                return response;
                            });

                            promises.push(save);

                            // One to many relationships
                        } else {
                                _this2._data[name].forEach(function (model) {
                                    field.userChanged = false;
                                    save = model.save();
                                    promises.push(save);
                                });
                            }
                    })();
                } else if (field.model && field.type === 'array') {
                    var models = _this2.get(name);

                    models.forEach(function (model) {
                        if (!model.id) {
                            promises.push(model.create().then(function (response) {
                                var id = response.id;

                                _this2._data[field.map].push(id);

                                return response;
                            }));
                        }
                    });
                }
            });

            return Promise.all(promises);
        }

        /**
         * @method getType
         * @param {string} field
         */

    }, {
        key: 'getType',
        value: function getType(field) {
            return this._fields[field].type;
        }

        /**
         * @private
         * @method findModel
         * @param {string} field
         */

    }, {
        key: 'findModel',
        value: function findModel(field) {
            return this._fields[field].model;
        }

        /**
         * @method isType
         * @param {string} field
         * @param {string} type
         */

    }, {
        key: 'isType',
        value: function isType(field, type) {
            return this.getType(field) === type;
        }

        /**
         * @method getFields
         * @param {string} field
         */

    }, {
        key: 'getFields',
        value: function getFields(field) {
            return this._fields[field].fields;
        }

        /**
         * @method mute
         */

    }, {
        key: 'mute',
        value: function mute() {
            this._silent = true;
            return this;
        }

        /**
         * @method unmute
         */

    }, {
        key: 'unmute',
        value: function unmute() {
            this._silent = false;
            return this;
        }

        /**
         * @method validate
         * @param {string} field
         */

    }, {
        key: 'validate',
        value: function validate(field) {
            var _this3 = this;

            if (!field) {
                var _ret2 = (function () {
                    var validations = {};

                    Object.keys(_this3._fields).map(function (fieldName) {
                        var validation = _this3._fields[fieldName].validation;
                        if (validation) {
                            validations[fieldName] = validation;
                        }
                    });

                    return {
                        v: _validate({
                            data: _this3.toJSON(),
                            validations: validations
                        })
                    };
                })();

                if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
            } else if (this._fields[field]) {
                this._data[field] = this.get(field);

                return _validate({
                    data: _defineProperty({}, field, this._data[field]),
                    validations: _defineProperty({}, field, this._fields[field].validation)
                });
            } else {
                throw new Error('Trying to validate a nonexistent field ' + field);
            }
        }
    }, {
        key: 'getModelsSingleRequest',
        value: function getModelsSingleRequest(field) {
            var _this4 = this;

            var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            if (!this._objectFields[field]) {
                var _ret3 = (function () {
                    var mapping = _this4._fields[field].map || _this4._fields[field].mapping;
                    var id = _this4._data[mapping];
                    var modelId = _this4.id || _this4.get('id');
                    var all = _this4._fields[field].all;

                    if (!modelId) {
                        return {
                            v: []
                        };
                    }

                    if (typeof _this4._fields[field].getUrl !== 'function') {
                        _this4._fields[field].getUrl = function () {
                            return _this4.rootUrl + '/' + modelId + '/' + field;
                        };
                    }

                    if (!all) {
                        var model = _this4.findModel(field);
                        all = model.all.bind(model);
                    }

                    options.url = _this4._fields[field].getUrl();

                    if (!mapping || _this4.get(mapping) && _this4.get(mapping).length) {
                        all(options).then(function (data) {
                            _this4._data[field] = data;
                            _this4._data[field]._fetched = true;
                            _this4._objectFields[field] = true;
                            _this4.emit('change');

                            _this4._data[field].forEach(function (model) {
                                model.on('change', function () {
                                    _this4.emit('change');
                                });

                                model.on('userChange', function () {
                                    _this4._fields[field].userChanged = true;
                                    _this4.emit('userChange');
                                });
                            });
                        }).catch(function (e) {
                            debug(e);
                        });
                    } else {
                        _this4._data[field] = _this4._data[field] || [];
                        _this4._data[field]._fetched = true;
                    }
                })();

                if ((typeof _ret3 === 'undefined' ? 'undefined' : _typeof(_ret3)) === "object") return _ret3.v;
            }

            return this._data[field] || [];
        }
    }, {
        key: 'getModelsMultipleRequests',
        value: function getModelsMultipleRequests(field, options) {
            var _this5 = this;

            var ids = this.get(this._fields[field].map);

            this._objectFields[field] = this._objectFields[field] || {};

            this._data[field] = this._data[field] || [];

            // Just in case a new change slips by
            this._data[field].forEach(function (model) {
                _this5._objectFields[field][model.id] = true;
            });

            ids.forEach(function (id) {
                if (!_this5._objectFields[field][id]) {
                    var Model = _this5._fields[field].model;
                    var model = new Model(id);
                    _this5._objectFields[field][id] = true;
                    _this5._data[field].push(model);

                    model.on('change', function () {
                        _this5.emit('change');
                    });

                    model.on('userChange', function () {
                        _this5.emit('userChange');
                    });
                }
            });

            return this._data[field];
        }

        /**
         * @private
         * @method getModels
         * @param {string} field
         */

    }, {
        key: 'getModels',
        value: function getModels(field) {
            var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            if (this._fields[field].requestType === 'single') {
                return this.getModelsMultipleRequests(field, options);
            }

            return this.getModelsSingleRequest(field, options);
        }

        /**
         * @private
         * @method getModel
         * @param {string} field
         */

    }, {
        key: 'getModel',
        value: function getModel(field) {
            var _this6 = this;

            var mapping = this._fields[field].map || this._fields[field].mapping || field + '_id';
            var id = this._data[mapping];

            if (!this._objectFields[field]) {

                var Model = this.findModel(field);
                var model = new Model(id);

                model.on('change', function () {
                    _this6.emit('change');
                });

                model.on('userChange', function () {
                    _this6._fields[field].userChanged = true;
                    _this6.emit('userChange');
                });

                this._objectFields[field] = model;
            }

            this._objectFields[field].id = id;

            return this._objectFields[field];
        }

        /**
         * @private
         * @method getArray
         * @param {string} field
         */

    }, {
        key: 'getArray',
        value: function getArray(field) {
            var _this7 = this;

            var arr = [];

            this._data[field] = this._data[field] || [];

            // Flat arrays
            if (!this.getFields(field)) {
                return this._data[field];
            }

            // Nested arrays
            Object.keys(this._data[field]).forEach(function (key) {
                var data = _this7._data[field][key];

                arr.push(new Field({
                    data: data,
                    fields: _this7.getFields(field)
                }));
            });

            return arr;
        }

        /**
         * @private
         * @method getObject
         * @param {string} field
         */

    }, {
        key: 'getObject',
        value: function getObject(field) {
            var _this8 = this;

            if (!this._objectFields[field]) {
                this._objectFields[field] = new Field({
                    data: this._data[field] || {},
                    fields: this.getFields(field)
                });

                this._objectFields[field].on('change', function () {
                    _this8.emit('change');
                });
                this._objectFields[field].on('userChange', function () {
                    _this8.emit('userChange');
                });
            }

            return this._objectFields[field];
        }

        /**
         * @method getValue
         * @param {string} field
         */

    }, {
        key: 'getValue',
        value: function getValue(field, options) {

            if (this._fields[field]) {

                // Nested Arrays
                if (this.isType(field, 'array')) {
                    if (this.findModel(field)) {
                        return this.getModels(field, options);
                    }

                    return this.getArray(field);
                }

                // Nested Objects
                if (this.isType(field, 'object')) {
                    if (this.findModel(field)) {
                        return this.getModel(field);
                    }

                    return this.getObject(field);
                }

                // Booleans
                if (this.isType(field, 'boolean')) {
                    if (this._data[field] === 'false') {
                        return false;
                    }

                    return Boolean(this._data[field]);
                }

                // Singletons
                return this._data[field];
            }
        }
    }, {
        key: 'get',
        value: function get(field, options) {
            if (this._fields[field]) {
                if (this._fields[field].hooks && this._fields[field].hooks.get) {
                    return this._fields[field].hooks.get(this.getValue(field, options));
                }

                return this.getValue(field, options);
            }
        }

        /**
         * @method set
         * @param {string} field
         * @param {mixed} value
         */

    }, {
        key: 'set',
        value: function set(field, value) {
            if (this.isType(field, 'array') && this._fields[field].fields) {
                throw new Error('You cannot directly set to an array. Use add() and remove() to modify the array.');
            }

            if (this.isType(field, 'object')) {
                throw new Error('You cannot directly set to an object. Get the sub-items and set them instead.');
            }

            this._data[field] = this.applyHook('set', field, value);
            this._fields[field].touched = true;

            if (!this._silent) {
                this.emit('userChange');
                this.emit('change');
            }

            return this;
        }

        /**
         * @method add
         * @param {string} field
         * @param {object} item
         * @param {number} index
         */

    }, {
        key: 'add',
        value: function add(field, item, index) {
            var _this9 = this;

            if (!this.isType(field, 'array')) {
                throw new Error('Cannot add() to a non-array field');
            }

            this._data[field] = this._data[field] || [];

            // Keep the user from needing to new up the model
            if (this._fields[field].model && !item.get) {
                item = new this._fields[field].model(item);
            }

            // If no index is provided, append to the end of the array
            if (typeof index !== 'number') {
                index = this._data[field].length;
            }

            this._data[field].splice(index, 0, item);
            this._fields[field].touched = true;

            this.emit('userChange');

            if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' && item.on) {
                item.on('userChange', function () {
                    _this9.emit('userChange');
                });
            }

            return this;
        }

        /**
         * @method move
         * @param {string} field
         * @param {number} oldIndex
         * @param {number} newIndex
         */

    }, {
        key: 'move',
        value: function move(field, oldIndex, newIndex) {
            if (!this.isType(field, 'array')) {
                throw new Error('Cannot move() a non-array field');
            }

            var item = this._data[field][oldIndex];
            this._data[field].splice(oldIndex, 1);
            this._data[field].splice(newIndex, 0, item);
            this._fields[field].touched = true;

            this.emit('userChange');

            return this;
        }

        /**
         * @method removeAll
         * @param {string} field
         */

    }, {
        key: 'removeAll',
        value: function removeAll(field) {
            this._data[field] = [];
            this.emit('change');
            return this;
        }

        /**
         * @method removeById
         * @param {string} field
         * @param {number} id
         */

    }, {
        key: 'removeById',
        value: function removeById(field, id) {
            var _this10 = this;

            this.get(field).forEach(function (item, i) {
                if (item.get('id') === id) {
                    _this10.remove(field, i);
                }
            });
        }

        /**
         * @method findById
         * @param {string} field
         * @param {number} id
         */

    }, {
        key: 'findById',
        value: function findById(field, id) {
            var result = null;

            this.get(field).forEach(function (item, i) {
                if (item.get('id') === id) {
                    result = item;
                }
            });

            return result;
        }

        /**
         * @method remove
         * @param {string} field
         * @param {object} item
         */

    }, {
        key: 'remove',
        value: function remove(field, item) {

            var index = undefined;

            if (!this.isType(field, 'array')) {
                throw new Error('Cannot remove() from a non-array field');
            }

            // Remove based on an index
            if (typeof item === 'number' && typeof this._data[field][0] !== 'number') {
                index = item;

                // Remove based on an the item position
            } else {
                    index = this._data[field].indexOf(item);
                }

            // Remove from the array
            this._data[field].splice(index, 1);
            this._fields[field].touched = true;

            // Emit changes
            this.emit('userChange');

            return this;
        }

        /**
         * @method toJSON
         */

    }, {
        key: 'toJSON',
        value: function toJSON() {
            var data = {};

            for (var field in this._fields) {

                /* istanbul ignore else */
                if (this._fields.hasOwnProperty(field)) {

                    if (this._fields[field].touched && this._fields[field].map && this._data[field]) {
                        this._data[this._fields[field].map] = this._data[field].map(function (model) {
                            return model.id;
                        });
                    }

                    // Save nested models in the same call
                    if (this._fields[field].saveAs) {
                        data[this._fields[field].saveAs] = this.get(field).toJSON();

                        continue;
                    }

                    if (this._fields[field].model) {
                        continue;
                    }

                    if (this._fields[field].toJSON === false) {
                        continue;
                    }

                    // If the field has a push filter, we'll use that
                    if (this._fields[field].hooks && this._fields[field].hooks.pushFilter) {
                        data[field] = this._fields[field].hooks.pushFilter(this._data[field]);

                        // Nested objects
                    } else if (this._fields[field] && this._fields[field].type === 'object') {
                            data[field] = this.get(field).toJSON();

                            // If there is no push filter, just return the data unfiltered
                        } else {
                                data[field] = this._data[field];
                            }
                }
            }

            return data;
        }
    }]);

    return Field;
})(EventEmitter);

module.exports = Field;