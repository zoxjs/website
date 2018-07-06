---
title: Single File Example
url: /docs/single-file-example
type: docs
include:
  - docs.sidebar
---

If you're going to show code examples or if you're developing a very simple app
then you probably wont get much use from having to setup your environment.

Instead you can just create a new instance of the web app,
register an endpoint and start listening.

```js
const app = webapp();

app.get('/', () =>
{
    return new StringResponse('Hello world!');
});

app.listen(8080);

console.log('Started');
```

You can register `get`, `post`, `put` or `delete` endpoints by using the functions with the same name.
They all take the route as the first argument and a handler as the second argument.

The handler's only argument is the request and it is expected to return a response.  
You can access the route parameters and the query using the same was as with regular controllers,
using `this.params` and `this.query`.
Of course to access the `this` object you will have to use `function ()` instead of `() =>`.

```ts
app.get('/person/:name', function (request)
{
    return new StringResponse('Hello ' + this.params.name);
});
```

All services must be manually registered.

```js
app.use(ConfigService);
```

Since you can not declare dependencies in this mode
you will have to manually get them before using them.

```js
const config = this.container.get(ConfigService);
```

If you want to use complex controllers you can still do that, but this requires more typing.

```ts
Route({
    route: 'my-page'
})
class MyPageController extends PageController
{
    public page(request): MaybePromise<IRenderable>
    {
        return this.container.create(Renderable, 'my-template-name');
    }
}
app.use(MyPageController);
```
