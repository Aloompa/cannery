import { queries, models } from './stores';
import dispatcher from './dispatcher';
import { QUERY_RESPONSE, QUERY_REQUEST, CHANGE } from './constants/canneryConstants';
import getModel from './getModel';

dispatcher.register(function (action) {
    if (action.actionType === QUERY_RESPONSE) {
        queries[action.modelName][action.stringOptions] = action.data;

        dispatcher.dispatch({
            actionType: QUERY_REQUEST
        });
    }
});

function query (modelName, options) {
    const stringOptions = JSON.stringify(options);

    if (!queries[modelName][stringOptions]) {
        queries[modelName][stringOptions] = [];

        dispatcher.dispatch(Object.assign({}, options, {
            actionType: QUERY_REQUEST,
            stringOptions,
            modelName
        }));
    }

    return queries[modelName][stringOptions].map(function (id) {
        return getModel(modelName, id);
    });
}

export default query;
