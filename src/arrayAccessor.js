import fieldAccessor from './fieldAccessor';
import getType from './getType';

function arrayAccessor (arr, fieldTypes) {

    const type = getType(fieldTypes[0]);

    return {

        all: function () {
            if (type === 'object') {
                return arr.map(fieldAccessor);
            }

            return arr;
        },

        push: function (value) {

            if (typeof value !== type) {
                throw new Error(`Invalid array type for ${key}. Expecting ${type} but got ${typeof value}.`);
            }

            arr.push(value);

            return this;

        },

        remove: function (index) {
            arr.splice(index, 1);

            return this;
        }

    };
}

export default arrayAccessor;
