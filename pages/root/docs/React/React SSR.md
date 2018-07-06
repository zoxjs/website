---
title: React Server-Side Rendering
url: /docs/react-ssr
type: docs
include:
  - docs.sidebar
---

Zox.js could not make React SSR any easier!  
All you have to do is wrap your React component with a `ReactRenderable` element.

```ts
const reactRenderable = this.container.create(
    ReactRenderable,
    <MyComponent text='My Component' />
);
return this.container.create(RenderResponse, reactRenderable);
```

Your component will be rendered on the server and hydrated on the browser
with any props preserved in the process.

The `ReactRenderable` element can then be used
the same way as any other `Renderable` element.

> **Note**  
Only props that are serializable by **JSON.stringify** are allowed.

By default your react component will be wrapped in a div
which will tell us which React component to initialize and with which props.  
If you wish to avoid this you can switch the render mode to `comment`.

```ts
const reactRenderable = this.container.create(
    ReactRenderable,
    <MyComponent text='My Component' />,
    'comment'
);
return this.container.create(RenderResponse, reactRenderable);
```

But note that this method has some limitations.
React requires that your server-rendered component
is the only child in it's parent element,
this includes whitespace.  
If you fail to fulfill this requirement your component will be re-rendered.

Since the first version includes a parent div
it is quarantined not to suffer from this limitation,
so you are recommended to use it,
unless your css has specific requirements.

## Front-End

In your main front-end script you should call the `InitReact(options)` function.

The supported options are:
- `globalProps`: the props that will be added to props of all React components;  
this was added since you can not set props on React components directly
