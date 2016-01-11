'use strict';

module.exports = function (Cannery) {
    return function (typeName, method) {
        Cannery.Types[typeName] = method;
        return Cannery;
    };
};