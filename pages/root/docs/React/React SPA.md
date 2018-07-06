---
title: React SPA
url: /docs/react-spa
type: docs
include:
  - docs.sidebar
---

The simplest React page simply returns a `ReactRenderable` element.

```ts
@Route({
    route: '/react/hello-world'
})
export class MyReactPage extends PageController
{
    public page()
    {
        return this.container.create(
            ReactRenderable,
            <App />
        );
    }
}
```

The layout system will then wrap our component in valid html
with all of the js, css and meta tags included.

The layout system also has the ability to wrap your page with a
navbar, footer, sidebar or other blocks.
In case of most React apps you will not need this,
so you should give the layout system a hint that your component is a full page.

```ts
@Route({
    route: '/react/hello-world'
})
export class MyReactPage extends PageController
{
    public page()
    {
        const app = this.container.create(
            ReactRenderable,
            <App />
        );
        app.type = 'page';
        return app;
    }
}
```
