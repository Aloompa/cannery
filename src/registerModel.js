import fieldAccessor from './fieldAccessor';
import Immutable from 'immutable';
import { getStore, setStore } from './store';
import dispatcher from './dispatcher';

function registerModel (modelName, options = {}) {

    const store = getStore();
    const modelNameUpper = modelName.toUpperCase();

    store.models[modelName] = Immutable.Map();
    store.modelTypes[modelName] = options.fields;
    store.queries[modelName] = Immutable.Map();
    store.validations[modelName] = options.validations || {};

    setStore(store);

    dispatcher.register(function (action) {
        switch (action.actionType) {
            case `${modelNameUpper}_FETCH_SUCCESS`:
                store.models[modelName].set(action.data.id, action.data);
                setStore(store);
            break;

            case `${modelNameUpper}_FINDALL_SUCCESS`:
                const ids = action.data.map(function (item) {
                    return item.id;
                });

                store.queries[modelName].set(JSON.stringify(action.query), ids);

                actions.data.forEach(function (item) {
                    store.models[modelName].set(item.id, item);
                });

                setStore(store);
            break;
        }
    });
}

export default registerModel;
