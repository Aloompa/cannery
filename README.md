## Welcome to Cannery

A modern ES6 class-based event-driven ORM for client-side or server-side JavaScript.

Cannery syncs data with an outside datasource, so you don't have to think about Ajax or database interactions in your application.

## What It Looks Like

Cannery models are composed as nested getters and setters. You define your data structure once and then Cannery is able to stub out your data structure with nested objects, arrays and relational data types before your data is even loaded. This is awesome for writing applications because it means you never have to wrap anything in a conditional.

Here is a simple example of setting up a Cannery model:

```js
import Cannery from 'cannery';
const { StringType, NumberType } = Cannery.Types;

class Monkey extends Cannery.Root {

    getFields () {
        return {
            name: StringType,
            age: NumberType
        };
    }

}

const george = new Monkey();

george
    .set('name', 'George')
    .get('name'); // George
```

This is just touching the surface, of course, for a more in-depth guide, checkout out our [documentation](./docs/index.md).

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
