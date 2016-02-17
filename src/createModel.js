import { getStore } from './store';
import fieldAccessor from './fieldAccessor';
import dispatcher from './dispatcher';

function createModel (modelName) {

    const modelNameUpper = modelName.toUpperCase();
    const store = getStore();
    const fieldDefinitions = store.modelTypes[modelName];

    let data = {};

    if (!fieldDefinitions) {
        throw new Error(`The Cannery model, ${modelName} does not appear to exist.`);
    }

    const fields = fieldAccessor(data, data, fieldDefinitions);

    return Object.assign({}, fields, {

        save: function () {
            dispatcher.dispatch({
                actionType: `${modelNameUpper}_CREATE`,
                payload: {
                    data
                }
            });
        },

        validate: function () {
            // TODO
        }

    });
}

export default createModel;
