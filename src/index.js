const Cannery = {
    Model: require('./model'),
    Types: require('./types')
};

Cannery.registerType = require('./util/registerType')(Cannery);

module.exports = Cannery;
