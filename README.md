## Welcome to Cannery

A modern ES6 event-driven ORM for client-side or server-side JavaScript.

## Installing Cannery

Cannery is available on npm.

```
npm install cannery --save
```

##  Getting Started

Every Cannery API needs to have a root to contain your models. Create a class that extends `Cannery.Root` and define your fields within the `getFields()` method:

```
import Cannery from 'cannery';
import Monkey from 'path/to/Monkey';

const { OwnsMany } = Cannery;

class Api extends Cannery.Root {

    getFields () {
        return {
            monkey: this.define(OwnsMany, Monkey)
        };
    }

}

export default Api;
```

Models have a very similar API to the Cannery Root. They return an object of fields through the `getFields()` method.

```
import Cannery from 'cannery';

const { StringType, NumberType } = Cannery;

class Monkey extends Cannery.Model {

    getFields () {
        return {
            id: NumberType,
            name: StringType
        };
    }

}

export default Monkey;
```

Cannery has no dependency on React or any other front-end component library. But here is an example of using our API with React:

```
import React from 'react';
import Api from 'path/to/Api';
import MonkeysListing from 'path/to/MonkeysListing.jsx';

class AppLayout extends React.Component {

    constructor () {
        super();

        this.state = {
            api: new Api()
        };
    }

    componentWillMount () {
        this.onApiChange = this.state.api.on('change', () => {
            this.forceUpdate();
        });
    }

    componentWillUnmount () {
        this.state.api.off('change', this.onApiChange);
    }

    render () {
        return (
            <div>
                <MonkeysListing api={this.state.api} />
            </div>
        );
    }

}

export default AppLayout;
```

Our API needs to flow down from the top-level component to lower-level components:

```
import React from 'react';

class MonkeysListing extends React.Component {

    renderMonkey (monkey, key) {
        return (
            <div key={key}>
                <label>Name</label>
                <input value={monkey.get('name')} onChange={(e) => {
                    monkey.set('name', e.target.value);
                }} />
                <button onClick={() => {
                    monkey.save();
                }}>Save</button>
            </div>
        );
    }

    render () {
        return (
            <div>
                {this.props.api.get('monkeys').all().map(this.renderMonkey.bind(this))}
            </div>
        );
    }

}

export default MonkeysListing;
```

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
