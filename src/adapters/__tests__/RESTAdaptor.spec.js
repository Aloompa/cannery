const assert = require('assert');
const RESTAdapter = require('../RESTAdapter');

describe('The REST Adapter', () => {
    const testAdapter = new RESTAdapter({
        baseUrl: '/api',
        headers: {
            'X-Testing': 'yes'
        }
    });

    const classroomPath = [
        {key: 'schools', keySingular: 'school', id: '3'},
        {key: 'buildings', keySingular: 'building', id: '7'},
        {key: 'classrooms', keySingular: 'classrooms', id: '2'}
    ];

    describe('When we fetch', () => {
        let req = {
            requestType: 'fetch',
            path: classroomPath,
            payload: null,
            options: {
                headers: {
                    'X-Puppy' : 'Clifford'
                }
            }
        };

        it('should form the url correctly', () => {
            let url = testAdapter.url(req);
            assert.equal(url, '/api/schools/3/buildings/7/classrooms/2');
        });

        it('should use the propper method', () => {
            let method = testAdapter.method(req);
            assert.equal(method, 'GET');
        });

        it('should use the propper headers', () => {
            let headers = testAdapter.headers(req);
            assert.deepEqual(headers, {
                'X-Testing': 'yes',
                'X-Puppy': 'Clifford'
            });
        });
    });

    describe('When we fetchWithin', () => {
        let req = {
            requestType: 'fetchWithin',
            path: classroomPath.concat({key: 'whiteboards', keySingular: 'whiteboard', id: null}),
            payload: null,
            options: {}
        };

        it('should form the url correctly', () => {
            let url = testAdapter.url(req);
            assert.equal(url, '/api/schools/3/buildings/7/classrooms/2/whiteboard');
        });

        it('should use the propper method', () => {
            let method = testAdapter.method(req);
            assert.equal(method, 'GET');
        });
    });

    describe('When we findAll', () => {
        let req = {
            requestType: 'findAll',
            path: classroomPath.concat({key: 'desks', keySingular: 'desk', id: null}),
            payload: null,
            options: {
                query: {
                    page: 1,
                    per: 10
                }
            }
        };

        it('should form the url correctly', () => {
            let url = testAdapter.url(req);
            assert.equal(url, '/api/schools/3/buildings/7/classrooms/2/desks');
        });

        it('should use the propper method', () => {
            let method = testAdapter.method(req);
            assert.equal(method, 'GET');
        });

        it('should pass in the query', () => {
            let query = testAdapter.query(req);
            assert.deepEqual(query, {page: 1, per: 10});
        });
    });

    describe('When we create', () => {
        let req = {
            requestType: 'create',
            path: classroomPath.concat({key: 'desks', keySingular: 'desk', id: null}),
            payload: {
                color: 'Beige',
                comfortable: false
            },
            options: {}
        };

        it('should form the url correctly', () => {
            let url = testAdapter.url(req);
            assert.equal(url, '/api/schools/3/buildings/7/classrooms/2/desks');
        });

        it('should use the propper method', () => {
            let method = testAdapter.method(req);
            assert.equal(method, 'POST');
        });
    });

    describe('When we update', () => {
        let req = {
            requestType: 'update',
            path: classroomPath,
            payload: {
                locked: true
            },
            options: {}
        };

        it('should form the url correctly', () => {
            let url = testAdapter.url(req);
            assert.equal(url, '/api/schools/3/buildings/7/classrooms/2');
        });

        it('should use the propper method', () => {
            let method = testAdapter.method(req);
            assert.equal(method, 'PUT');
        });
    });

    describe('When we destroy', () => {
        let req = {
            requestType: 'destroy',
            path: classroomPath,
            payload: null,
            options: {}
        };

        it('should form the url correctly', () => {
            let url = testAdapter.url(req);
            assert.equal(url, '/api/schools/3/buildings/7/classrooms/2');
        });

        it('should use the propper method', () => {
            let method = testAdapter.method(req);
            assert.equal(method, 'DELETE');
        });
    });
});
