/* @flow */

'use strict';

const MultiModel = require('./multiModel');

class OwnsMany extends MultiModel {

    constructor(owner: Object, Model: Function, options: ?Object) {
        super(...arguments);
        this._models = {};
    }

    store (response: Array<Object>) {
        const Model = this.Model;
        const idKey = this.Model.idField;

        response.forEach((modelData) => {
            const id = modelData[idKey];

            if (!id) {
                return;
            }

            let storedModel = this.fetch(id);

            if (storedModel) {
                storedModel.apply(modelData);
            } else {
                let newModel = new Model(this.owner, id, this.options.modelOptions);
                newModel.apply(response);
                this._models[id] = newModel;
            }
        });
    }

    fetch (id: string): Object {
        return this._models[id];
    }

    requestOne (id: string, options: ?Object): any {
        const ModelConstructor = this.Model;
        let model = this.fetch(id);

        if (!model) {
            model = new ModelConstructor(this.owner, id);
        }

        model.getAdapter().fetch(model, options, (response) => {
            model.apply(response);
        });

        return model;
    }

    requestMany (options: ?Object) {
        this.Model
            .getAdapter()
            .findAll(this.Model, this.owner, options, (response) => {
                this.apply(response, options);
            });
    }
}

module.exports = OwnsMany;
