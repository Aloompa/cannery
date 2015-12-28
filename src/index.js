const Cannery = {
    Model: require('./model'),
    Type: require('./types')
};

Cannery.registerType = require('./util/registerType')(Cannery);

module.exports = Cannery;
