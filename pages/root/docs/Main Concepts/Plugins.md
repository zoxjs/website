---
title: Plugins
url: /docs/plugins
type: docs
include:
  - docs.sidebar
---

Whenever you need extensible and flexible code
you will be faced with several ways of implementing it.
One of them is by using Plugins!  
Here we will see how to use plugins
and how they compare to more common ways of dealing with this problem.

Lets look at a case where we have to either add or multiply 2 numbers.

```js
function calc(args)
{
    if (args.operation === 'add')
    {
        return args.A + args.B;
    }
    if (args.operation === 'multiply')
    {
        return args.A * args.B;
    }
}
```

Seems simple. Whenever we want to add a new operation we just add another `if` statement.

But keeping all of our code in a single function
will quickly lead to the function having 100-s of lines of code,
so we will need to split it up.

```js
function calc(args)
{
    if (args.operation === 'add')
    {
        return add(args);
    }
    if (args.operation === 'multiply')
    {
        return multiply(args);
    }
}
```

Ok now we can split our functionality into multiple files,
which will make version control easier.

But we still need to change the main function code whenever we need a new option.  
This can be easily solved by creating an option list.

```js
const operations = [
    { operation: 'add', func: add },
    { operation: 'multiply', func: multiply },
];

function calc(args)
{
    for (const op of operations)
    {
        if (op.operation === args.operation)
        {
            return op.func(args);
        }
    }
}
```

This is basically how `zox-plugins` themselves work,
except that the `zox-plugins` are heavily object-oriented
meaning that all plugins must be classes.

## Creating Plugins

First we will need to define a new plugin type.

JavaScript:

```js
const pluginKey = Symbol('My Plugin');

export function MyPlugin(options)
{
    return PluginSetup(pluginKey, options);
}
```

TypeScript:

```ts
const pluginKey = Symbol('My Plugin');

export type MyArgs = { A: number, B: number }

export interface IMyPlugin
{
    calc(args: MyArgs): number;
}

export function MyPlugin(options: MyPluginOptions)
{
    return PluginSetup<IMyPlugin, MyPluginOptions>(pluginKey, options);
}
```

We can then define our plugins anywhere in our project.

JavaScript:

```js
export class AddPlugin
{
    calc(args)
    {
        return args.A + args.B;
    }
}
MyPlugin({ operation: 'add' })(AddPlugin);
```

TypeScript:

```ts
@MyPlugin({ operation: 'add' })
export class AddPlugin implements IMyPlugin
{
    calc(args: MyArgs): number
    {
        return args.A + args.B;
    }
}
```

It is also possible to simplify plugin options
from `MyPlugin({ operation: 'add' })` to `MyPlugin('add')`.
This is fine in simpler use cases,
but using an object instead of an argument list
gives us a chance to easily change plugin options
without refactoring old code.

Now we can scan our project to load all of the plugins,
more on this subject later,
and use them in the function from the previous example.

```js
const pluginDiscovery = new PluginDiscovery();
// ...

function calc(args)
{
    const pluginDefinitions = pluginDiscovery.getPlugins(pluginKey);
    for (const pluginDefinition of pluginDefinitions)
    {
        if (pluginDefinition.data.operation === args.operation)
        {
            return new pluginDefinition.pluginClass().calc(args);
        }
    }
}
```

It can be useful to instantiate our plugins in advance,
so that our main function would perform better.

```js
const pluginDiscovery = new PluginDiscovery();
// ...

const myPlugins = {};
const pluginDefinitions = pluginDiscovery.getPlugins(pluginKey);
for (const pluginDefinition of pluginDefinitions)
{
    myPlugins[pluginDefinition.data.operation] =
        new pluginDefinition.pluginClass();
}

function calc(args)
{
    if (args.operation in myPlugins)
    {
        return myPlugins[args.operation].calc(args);
    }
}
```

In this simplistic example we did not need classes,
but the `zox-plugins` are targeted for plugins
which require setup, in form of passing props
either through the constructor
or by assigning the object properties directly,
before they can be used.

Also in many use cases it is not enough
to have a single instance of the plugin,
for example Controller plugins are instantiated per request.

## Plugin Discovery

For our plugins to be available to us we first need to load them.

Of course it is also possible to manually add them.

You can do it like this if you used decorators
to assign the plugins to the class:

```js
const pluginDiscovery = new PluginDiscovery();
pluginDiscovery.scan(MyClass);
```

Or like this if you haven't:

```js
const pluginDiscovery = new PluginDiscovery();
pluginDiscovery.addPlugin(pluginKey, MyClass, options);
```

But the preferred way is to scan your project for plugins.

```js
const pluginDiscovery = new PluginDiscovery();
await pluginDiscovery.scanProject();
```

To scan your project you will have to specify
the target directories and/or files in your package.json file, like this:

```js
{
  "plugins": {
    "dirs": [ // to scan all modules in these folders
      "src/Plugins"
    ],
    "files": [ // alternatively you can explicitly specify modules to scan
      "src/Plugins/MyModule",
      "src/Plugins/Folder/AnotherModule"
    ]
  }
}
```

As for `node_modules` folder you have a few ways of scanning it.  
You can simply scan all of the included packages:

```js
const pluginDiscovery = new PluginDiscovery();
await pluginDiscovery.scanNodeModules();
```

Or manually select the packages you want to scan:

```js
const pluginDiscovery = new PluginDiscovery();
await pluginDiscovery.scanProject('node_modules/zox');
```

On a more granular level you can scan directories:

```js
const pluginDiscovery = new PluginDiscovery();
await pluginDiscovery.scanDirectory('Plugins');
```

Which can be useful if you don't want to specify
the plugins folder in the package.json file.

Or you can scan module files:

```js
const pluginDiscovery = new PluginDiscovery();
pluginDiscovery.scanModule(require('zox'));
```

It's also possible to clear the plugin list:

```js
pluginDiscovery.clear(); // clear all plugins
pluginDiscovery.clear(pluginKey); // clear plugins of this type
```
