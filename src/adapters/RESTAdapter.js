// @flow
'use strict';

const BaseAdapter = require('../adapter');
const request = require('then-request');
const pathHelpers = require('./util/pathHelpers');

class RESTAdapter extends BaseAdapter {
    constructor (options: Object) {
        super(options);
        this.options = Object.assign(this.constructor.defaultOptions(), this.options);
    }

    makeRequest (req: Object, callback: Function) {
        request({
            url: this.url(req),
            method: this.method(req),
            json: true,
            body: req.payload,
            qs: this.query(req),
            headers: this.headers(req),
            gzip: this.options.gzip
        }).then((res) => {
            callback(res.getBody(), null);
        }).then((res) => {
            callback(null, res);
        });
    }

    url (req: Object) : String {
        const pathHandlers = {
            fetch: pathHelpers.oneWithID,
            fetchWithin: pathHelpers.oneWithoutID,
            findAll: pathHelpers.many,
            create: pathHelpers.many,
            update: pathHelpers.oneWithID,
            destroy: pathHelpers.oneWithID
        };

        const path = pathHandlers[req.requestType](req.path, this.options);
        return this.formatUrl(path);
    }

    formatUrl (arr: Array<String>) : String {
        let str = this.options.baseUrl;
        str += '/';
        str += arr.join('/');
        if (this.options.trailingSlash) {
            str += '/';
        }

        return str;
    }

    method (req: Object): String {
        const methods = {
            fetch: 'GET',
            fetchWithin: 'GET',
            findAll: 'GET',
            create: 'POST',
            update: this.options.updateMethod,
            destroy: 'DELETE'
        };

        return methods[req.requestType];
    }

    query (req: Object): Object {
        if (req.options) {
            return req.options.query || {};
        }

        return {};
    }

    headers (req: Object): Object {
        return Object.assign(
            {},
            this.options.headers,
            req.options.headers
        );
    }

    static defaultOptions () {
        return {
            baseUrl: '',
            headers: {},
            trailingSlash: false,
            enableSingular: true,
            updateMethod: 'PUT',
            gzip: true
        };
    }
}

module.exports = RESTAdapter;
