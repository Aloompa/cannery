'use strict';

module.exports = function (base, field) {

    var events = ['change', 'userChange', 'fetching', 'fetchSuccess', 'fetchError'];

    events.forEach(function (evt) {
        field.on(evt, function () {
            base.emit(evt);
        });
    });
};