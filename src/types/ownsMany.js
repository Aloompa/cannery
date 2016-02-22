'use strict';

const MultiModel = require('./multiModel');

const models = Symbol();

class OwnsMany extends MultiModel {
    constructor(owner, Model, options) {
        super(owner, Model, options);
        this[models] = {};
    }

    store (response) {
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
                let newModel = new Model(id, this.options.modelOptions);
                newModel.apply(response);
                this[models][id] = newModel;
            }
        });
    }

    fetch (id) {
        return this[models][id];
    }

    requestOne (id, options) {
        const ModelConstructor = this.Model;
        let model = this.fetch(id);

        if (!model) {
            model = new ModelConstructor(id);
        }

        Model.getAdapter().fetch(model, options);

        return model;
    }

    requestMany (options) {

    }
}
