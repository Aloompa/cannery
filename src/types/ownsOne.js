/* @flow */

'use strict';

const SingleModel = require('./singleModel');

class OwnsOne extends SingleModel {

    get (): ?Object {
        if (!this._fetched) {
            this._fetched = true;
            this._model._parent = this._parent;
            this.request();
        }

        return this._model;
    }

    request (options: ?Object = {}): Object {
        this._parent
            .getAdapter()
            .fetchWithin(
                this._ModelConstructor,
                this._parent,
                options,
                (data) => {
                    this._model.apply(data);
                    this._fetched = true;
                }
            );

        return this;
    }
}

module.exports = OwnsOne;
