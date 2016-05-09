# What Is Cannery?

Cannery is a client-side and / or server-side ORM for JavaScript that is designed to abstract away the complexities of complex relationships, data fetching, caching, cache invalidation and managing data-sources.

Cannery builds up a tree of related models that can be accessed through their relationships to other models. Cannery is completely synchronous by design, which means you can query all of your data without worrying whether or not it has been fetched yet. Internally, Cannery will check if the model has been fetched yet on demand and trigger an change event that bubbles up to the root of your models once the data is available.

## Table Of Contents
* What Is Cannery?
    * [Data Source Agnostic](#data-source-agnostic)
    * [Asynchronous](#asynchronous)
    * [Predictable](#predictable)
* What Isn't Cannery?
    * [A Framework](#a-framework)
    * [An App State Container](#an-app-state-container)
    * [Purely Functional](#purely-functional)

## What Is Cannery?

#### Data Source Agnostic

95% of your Cannery code will not be aware where the data is coming from or where it is going. You can provide an adapter on a per-application or even per-model basis that handles all of the interactions with whatever datasource you are interacting with.

Your models, and your components will never know or care what the datasource is, so you can easily switch it out if you need to.

**[⬆ back to top](#table-of-contents)**

#### Asynchronous

There are no callbacks or promises, you just render your tree of data. When new data comes in, a change event will be triggered so you can re-render the tree. This makes Cannery much easier to reason about.

**[⬆ back to top](#table-of-contents)**

#### Predictable

You can get all of your models by their complex relationships. As long as your models are defined, every object, array and simple data type will be stubbed out so you can proactively render data before it arrives without needing to check whether objects or arrays are there.

**[⬆ back to top](#table-of-contents)**

## What Isn't Cannery?

#### A Framework

Cannery is not a full framework. It is only an answer to managing data relationships and synchronizing data with a backend (whether that be a REST API, a database or something else.)

**[⬆ back to top](#table-of-contents)**

#### An App State Container

Cannery is not a place to store your app state. While it can be used for that if you create an adapter that writes to memory or even sessionStorage, setting up models and relationships is a little tedious because you have to declare a type for everything you will be storing. If you need to keep app state, we recommend supplementing Cannery with something like [Redux](http://redux.js.org). It won't hurt our feelings if you don't use Cannery for everything you do.

**[⬆ back to top](#table-of-contents)**

#### Purely Functional

Cannery takes an object oriented approach to most of what it is doing behind the scenes. It turns out that it was much easier to create models with rich relationships and easy inheritance using classical inheritance. One place this will show through is when you create your models, you will use the ES2015 `class` syntax.

Once you are working in your components, however, you will barely notice you are working with classes. Most apps will just require you to use the `new` keyword once at the root of your app. From that point on, you'll feel like you're writing functional code.

**[⬆ back to top](#table-of-contents)**
