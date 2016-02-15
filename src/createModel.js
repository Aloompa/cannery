import { modelTypes } from './stores';
import fieldAccessor from './fieldAccessor';

function createModel (modelName) {

    const fields = fieldAccessor({}, modelTypes[modelName]);

    return Object.assign({}, fields, {

        save: function () {
            // TODO
        },

        validate: function () {
            // TODO
        }

    });
}

export default createModel;
