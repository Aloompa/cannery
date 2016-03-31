#Adapter

### makeRequest (request: {}, callback: function)

request is a JSON object of the form:

```
{
    requestType: 'getOne' or 'getMany' or 'create' or 'update' or 'destroy',
    path: ['rootKey', 'grandparentKey', 'parentKey', 'resourceKey'],
    id: model.id or null,
    payload: an object of data to include in request or null,
    options: an object of options set by user
}
```
