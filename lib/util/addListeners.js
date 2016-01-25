'use strict';

var eventTypes = require('./eventTypes');
var debounce = require('lodash.debounce');

module.exports = function (base, field) {

    eventTypes.forEach(function (evt) {

        var emitToBase = debounce(function () {
            base.emit(evt);
        });

        field.on(evt, emitToBase);
    });
};