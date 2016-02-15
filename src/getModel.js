import { models, modelTypes } from './stores';

function getModel (modelName, id) {
    if (!models[modelName][id]) {
        models[modelName][id] = {
            id: id
        };
    }

    const fields = fieldAccessor(models[modelName][id], modelTypes[modelName])

    return Object.assign({}, fields, {

        destroy: function () {
            // TODO
        },

        save: function () {
            // TODO
        },

        validate: function () {
            // TODO
        }

    });
}

export default getModel;
