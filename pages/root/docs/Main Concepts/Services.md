---
title: Services
url: /docs/services
type: docs
include:
  - docs.sidebar
---

The goal of services is to move away from global variables.
This is achieved by requesting a reference to them
instead of accessing them directly.

You can access a service by getting it from the service container
in a few different ways.

```js
container.get(serviceKey); // using the service key
container.get(MyService); // using the service class
container.get(IMyService); // using the interface
```

You can use the serviceKey ( _symbol_ ) directly
or use a class that has a `get serviceKey()` method.

The `interface` in this case is just an abstract class
with a `get serviceKey()` method.
It should have abstract declarations of
the public methods and props of the actual class.
This gives us code-completion and compile time validation.

To make requesting services smoother dependencies were introduced.

## Declaring Dependencies

In zox.js you can request that values be assigned
to your class properties by marking them as Dependencies.

TypeScript:

```ts
export class MyClass
{
    @Dependency
    private config: IConfigService;
    
    constructor(props) { /* .. */ }
    
    public work() { /* .. */ }
}
```

JavaScript:

```js
export class MyClass
{
    constructor(props) { /* .. */ }
    
    work() { /* .. */ }
}
Dependency(IConfigService)(MyClass, 'config');
```

In this example we requested that the `IConfigService`
gets injected into instances of `MyClass` as the `config` property.

> **Note**  
While we could have referenced the _ConfigService_ directly
we instead referenced it's interface _IConfigService_.
This is because in general we should aim to program to an interface
and not care about it's implementation.

## Resolving Dependencies

When we create an instance of this class we will have to resolve it
before we can use it's methods.

```js
const myObj = new MyClass(props);
container.resolve(myObj, true);
```

Or to shorten that:

```js
const myObj = container.create(MyClass, props);
```

Since the dependencies are assigned after our constructor is called
that means we have to move any setup we might have into the `onResolved` method.

TypeScript:

```ts
export class MyClass implements IOnResolved
{
    // ...
    
    public onResolved()
    {
        this.options = this.config.getConfig('my.config.file');
    }
}
```

JavaScript:

```js
export class MyClass
{
    // ...
    
    onResolved()
    {
        this.options = this.config.getConfig('my.config.file');
    }
}
```

In this example we loaded our config file and saved it in the options property.  
You can learn more about the config service [here](/docs/config).

## Creating Services

While any class can be used as a service
there is a pattern that you should stick to.

```ts
const serviceKey = Symbol('My Service');

export abstract class IMyService implements IService
{
    get serviceKey(): symbol
    {
        return serviceKey;
    }

    public abstract work();
}

@Service
export class MyService extends IMyService implements IOnResolved
{
    @Dependency // implicit service key from TypeScript metadata
    private config: IConfigService;
    
    @Dependency(IConfigService) // explicit service key from interface
    private config1: IConfigService;
    
    @Dependency(configServiceKey) // explicit service key
    private config2: IConfigService;
    
    public onResolved()
    {
        this.options = this.config.getConfig('my.config.file');
    }
    
    public work() { /* .. */ }
}
```

Since JavaScript has no concept of interfaces we defined our interface
as a class and gave it a unique `serviceKey`.

We then extended this interface and implemented it's methods.

> **Note**  
You don't have to implement _IOnResolved_ or have any dependencies,
but since you probably will I've included it into this template.

If you don't like extending interfaces you could also implement
the `get serviceKey()` method in the actual class.

The `@Service` decorator in this example marks the class
as a service that should be registered on app start.
You can remove if you only intend to manually register this service.

## Registering Services

Services can be registered as resolved or as unresolved,
depending on if you have resolved them before registering them.

```js
container.register(container.create(MyService));
container.registerUnresolved(new MyService());
```

The unresolved services will be resolved the first time the are requested.

Resolving services is not necessary if you know they have no dependencies.

```js
container.register(new MyServiceWithoutDependencies());
```

In case you want to use a class without the `get serviceKey()` method
as a service you will also have to assign a serviceKey to it.

```js
container.registerAs(serviceKey, new AnyClass());
container.registerUnresolvedAs(serviceKey, new AnyClass());
```

You can also create a custom abstract class
to be used as an interface for it.

```js
container.registerAs(IAnyClass, new AnyClass());
```

The `ServicePluginManager` can be used to automatically register
all services marked with the `@Service` decorator.

Simple objects and functions can also be registered as services.

```js
container.registerAs(serviceKey, { /* ... */ });
container.registerAs(serviceKey, function myFunc() { /* ... */ });
```

But due to the nature of services it is unlikely
you will need something other than classes in most cases.
