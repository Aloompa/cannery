/* @flow */

'use strict';

const MultiModel = require('./multiModel');

class OwnsMany extends MultiModel {

    _getModelById (id: string): Object {
        return this._models[id];
    }

    store (response: Array<Object>) {
        const idKey = this.Model.getFieldId();

        response.forEach((modelData) => {
            const id = modelData[idKey];

            if (!id) {
                return;
            }

            let storedModel = this._getModelById(id);

            if (storedModel) {
                storedModel.apply(modelData);
            } else {
                let newModel = this._instantiateModel(id);
                newModel.apply(response);
                this._models[id] = newModel;
            }
        });
    }

    requestOne (id: string, options: ?Object): any {
        let model = this._getModelById(id);

        if (!model) {
            model = this._instantiateModel(id);
        }

        model.getAdapter().fetch(model, options, (response) => {
            model.apply(response);
        });

        return model;
    }

    requestMany (options: ?Object) {
        const model = this._instantiateModel();

        model
            .getAdapter()
            .findAll(this.Model, this._parent, options, (response) => {
                this.apply(response, options);
            });
    }

    apply (data : Array<Object>) {
        data.forEach((item) => {
            const model = this._instantiateModel();

            this._models[item.id] = model;
            model.apply(item);
        });
    }

    all () {
        return this.map.map((id) => {
            return this._models[id];
        });
    }

    add (model: Object, index: ?number) {

        if (!this.map) {
            throw new Error('An unmapped OwnsMany cannot be added to');
        }

        this.map.add(model.id, index);
        this._models[model.id] = model;

        return this;
    }

    remove (model: Object) {

        if (!this.map) {
            throw new Error('An unmapped OwnsMany cannot be removed');
        }

        const mapIds = this.map.all();
        const removeIndex = mapIds.indexOf(model.id);

        if (removeIndex >= 0) {
            this.map.remove(removeIndex);
        }
    }

    move (model: Object, newIndex: number): Object {

        if (!this.map) {
            throw new Error('An unmapped OwnsMany cannot be moved');
        }

        const mapIds = this.map.all();
        const moveIndex = mapIds.indexOf(model.id);

        if (moveIndex >= 0) {
            this.map.move(moveIndex, newIndex);
        }

        return this;
    }

    toJSON (options : Object = {}): any {
        if (options.recursive) {
            return this.all().map((model) => {
                return model.toJSON(options);
            });
        }

        return [];
    }
}

module.exports = OwnsMany;
