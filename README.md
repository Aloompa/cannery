## Welcome to Cannery

A modern ES6-class-based event-driven model layer for JavaScript.

## Where Is The Code?

We have not published the code yet. We want to get the documentation in place before we publish the code. It should be coming along soon.

##  Getting Started

Getting started with Cannery is easy. You just need to extend the Cannery base Model class and provide a `getFields()` method that returns an object describing the fields on the model. From there, we can instantiate the model and use `get()` and `set()` to set and get data on the model fields.

```
const Cannery = require('cannery');

class Car extends Cannery.Model {

    getFields () {
        return {
            make: {},
            model: {},
            year: {
                type 'number'
            }
        }
    }

}

const myCar = new Car();

myCar.set('make', 'Ford');

console.log(myCar.get('make')); // Ford
```

So far, this is all pretty much what you might expect from any JavaScript model layer, but it gets better when you start handling async data. We'll get into how to define where our data is coming from (ajax, websockets, localStorage, some database, etc...) in the documentation, but for now, let's just say that the secret sauce of Cannery is that every field is return synchronously at first, and then events are triggered once the data is retrieved so that the UI layer can redraw with the updated data.

```
const myCar = new Car(1);

// This is triggered any time data is retrieved from some remote source such as an Ajax call
myCar.on('change', () => {
    myCar.get('make'); // returns the value of the make retrieved from the server
});

myCar.get('make'); // returns an empty string immediately
```

## API

### Cannery.Adapter

The base Cannery Adapter is an extendable class that can be used to create various strategies for retrieving and setting data. We plan to open-source many of our adapters for data sources like Ajax, WebSockets, Mocking, MongoDB, etc, but we wrote the adapter in such a way that it is pluggable and intended to be overridden with custom logic for specific use-cases. Each model has a `getAdapter()` method where the adapter for the specific model can be provided. For example:

```
const Cannery = require('cannery');
const AjaxAdapter = require('cannery-ajax-adapter');

class Car extends Cannery.Model {

    getAdapter () {
        return AjaxAdapter;
    }

    getFields () {
        // ...
    }
}
```

#### Methods

##### create(data)

Send data to a data store to get created. This must accept an object to send to the data store.

```
create (data) {
    return new Promise((resolve, reject) {
        // Save the data and resolve or reject the promise
    });
}
```

Returns: A promise, which resolves with the newly created data

##### destroy(id)

Remove data from a data store.

```
destroy (id) {
    return new Promise((resolve, reject) {
        // Delete the data and resolve or reject the promise
    });
}
```

Returns: A promise

##### findAll(query)

Find all of the data for a model.

```
findAll ({ page, per }) {
    return new Promise((resolve, reject) {
        // Retrieve the data and resolve or reject the promise
    });
}
```

Returns: A promise with an array of data

##### findOne(id)

Find one record.

```
findOne (id) {
    return new Promise((resolve, reject) {
        // Retrieve the data and resolve or reject the promise
    });
}
```

Returns: A promise with an object of data

##### update(id, data)

Updates the data for a model

```
update (id, data) {
    return new Promise((resolve, reject) {
        // Save the data and resolve or reject the promise
    });
}
```

Returns: A promise with the object of updated data

### Cannery.Model

#### Static

##### <static> all(options)

##### <static> create(data, options)
depricated - The model create method is better

##### <static> destroy(model)
depricated - The model destroy method is better

##### <static> getName()

##### <static> getNamePlural()

##### <static> getNestedKey()
depricated - This only gets used in the adapter. There has to be a better way to pass that in.

##### <static> getUrl()

#### Methods

##### add(field, item, index)

##### allOff(eventName)

##### create(options)

##### get(field, options, forceReload)

##### getAdapter()

##### getAsync(field, options, forceReload)

##### getFields()

##### hasArray(fields)

##### hasMany(Model, options)

##### hasObject(fields)

##### hasOne(Model, options)

##### move(field, oldIndex, newIndex)

##### off(eventName, listener)

##### on(eventName, callback)

##### refresh()

##### remove(field, item)

##### removeAll(field)

##### set(field, value)

##### save()

##### toJSON()

##### validate(field)

## Contributing

We encourage you to contribute to Cannery by submitting bug reports and pull requests through [Github](http//github.com).

## License

Cannery is released under The [MIT License](http://www.opensource.org/licenses/MIT) (MIT)

Copyright (c) [2015] [Aloompa LLC]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
