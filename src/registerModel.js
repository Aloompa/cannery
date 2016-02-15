import fieldAccessor from './fieldAccessor';
import { models, modelTypes, queries, validations } from './stores';

function registerModel (modelName, options = {}) {
    models[modelName] = {};
    modelTypes[modelName] = options.fields;
    queries[modelName] = {};
    validations[modelName] = {};

    return {
        addValidations: function (validations) {
            validations[modelName] = validations;
        }
    };
}

export default registerModel;
