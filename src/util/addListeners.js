/* @flow */

'use strict';

const eventTypes = require('./eventTypes');
const debounce = require('lodash.debounce');

module.exports = (base: Object, field: Object) => {

    eventTypes.forEach((evt) => {

        const emitToBase = debounce(() => {
            base.emit(evt);
        });

        field.on(evt, emitToBase);
    });

};
