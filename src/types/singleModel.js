/* @flow */

'use strict';

const BaseType = require('./base');

class SingleModel extends BaseType {

    constructor (parentModel: Object, Model: Function, options: Object = {}) {
        super(parentModel, options);

        Object.assign(this, {
            _ModelConstructor: Model,
            _model: new Model(parentModel),
            _fetched: false
        });
    }

    off (): any {
        this._model.off(...arguments);
        return this;
    }

    on (): Function {
        return this._model.on(...arguments);
    }

    emit (): Function {
        this._model.emit(...arguments);
        return this;
    }

}

module.exports = SingleModel;
