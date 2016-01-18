## Welcome to Cannery

A modern ES6 class-based event-driven ORM for client-side or server-side JavaScript.

##  Getting Started

Getting started with Cannery is easy. You just need to extend the Cannery base Model class and provide a `getFields()` method that returns an object describing the fields on the model. From there, we can instantiate the model and use `get()` and `set()` to set and get data on the model fields.

```
const { Model, Type } = require('cannery');
const { StringType, NumberType } = Type;

class Car extends Model {

    getFields () {
        return {
            make: StringType,
            model: StringType,
            year: NumberType
        };
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

### Adapters

To change what type of data store you set and get data from, just switch out the adapter. For example, you may want to get data from ajax, mongoDB, localStorage, etc. No problem, just replace the `getAdapter()` method with your own:

```
const Cannery = require('cannery');

class User extends Cannery.Model {

    getAdapter () {
        return new MyAdapter();
    }

}

module.exports = User;
```

### Cannery.Type

Fields in cannery can have types. Different types operate in different ways to handle data that is set and gotten from the model.

### Cannery.Model

This is the base model class where all the magic happens.

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
