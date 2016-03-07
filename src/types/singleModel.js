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

}

module.exports = SingleModel;
