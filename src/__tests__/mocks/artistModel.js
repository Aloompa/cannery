const MockAdapter = require('./mockAdapter');
const ObjectType = require('../../types/object');
const NumberType = require('../../types/number');
const StringType = require('../../types/string');
const Model = require('../../model');

class Artist extends Model {

    getAdapter () {
        return new MockAdapter();
    }

    getFields () {
        return {
            name: StringType,
            id: NumberType,
            bio: new ObjectType({
                medium: StringType
            })
        };
    }

}

module.exports = Artist;
