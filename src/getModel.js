import { getStore } from './store';
import fieldAccessor from './fieldAccessor';
import dispatcher from './dispatcher';

function getModel (modelName, id) {

    const modelNameUpper = modelName.toUpperCase();
    const store = getStore();
    const fieldDefinitions = store.modelTypes[modelName];

    let data = store.models[modelName].get(id);

    console.log('DAATA ADATA', data, store.models[modelName]);

    if (!fieldDefinitions) {
        throw new Error(`The Cannery model, ${modelName} does not appear to exist.`);
    }

    const fields = fieldAccessor(data, data, fieldDefinitions);

    return Object.assign({}, fields, {

        get: function (key) {
            if (!data) {
                dispatcher.dispatch({
                    actionType: `${modelNameUpper}_FETCH`,
                    id
                });
            }

            return fields.get(key);
        },

        destroy: function () {
            // TODO
        },

        save: function () {
            dispatcher.dispatch({
                actionType: `${modelNameUpper}_UPDATE`,
                data
            });
        },

        validate: function () {
            // TODO
        }

    });
}

export default getModel;
