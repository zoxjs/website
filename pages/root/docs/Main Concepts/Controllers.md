---
title: Controllers
url: /docs/controllers
type: docs
include:
  - docs.sidebar
---

The role of the controller is to generate a response to a request.

The most basic controller simply returns a static response:

```ts
export class MyController implements IController
{
    public handle(request: IncomingMessage): MaybePromise<IResponse>
    {
        return new StringResponse('Hello World');
    }
}
```

You can also access the url query parameter:

```ts
export class MyController implements IController
{
    public handle(request: IncomingMessage): MaybePromise<IResponse>
    {
        if ('q' in this.query)
        {
            return new StringResponse('You searched for: ' + this.query['q']);
        }
        return new StringResponse('Missing query parameter "q"');
    }
}
```

In most cases controllers will be bound to routes.

```ts
@Route({
    // the default method is 'get'
    method: 'get',
    route: '/my/path'
})
export class MyController implements IController
{
    public handle(request: IncomingMessage): MaybePromise<IResponse>
    {
        return new StringResponse('Hello World');
    }
}
```

The same controller can be bound to any number of routes
and you can read the requested URL from `request.url`.

Routes can also be dynamic and in that case the dynamic parts
will be set in the `props` property.

```ts
@Route({
    route: '/my/path/:category/:name'
})
export class MyController implements IController
{
    public handle(request: IncomingMessage): MaybePromise<IResponse>
    {
        // in case of url: /my/path/event/my-party
        this.props.category === 'event'
        this.props.name === 'my-party'
    }
}
```

If the route has no dynamic parts then the `props` property will be `undefined`.

You can learn more about routing [here](/docs/routing).

## Base controller classes

To present a HTML page we would create a `Renderable` element
and returning it in a `RenderResponse`.

```ts
export class MyPageController implements IController
{
    @Dependency
    private container: ISrviceContainer;

    public handle(request: IncomingMessage): MaybePromise<IResponse>
    {
        const renderable = this.container.create(Renderable, 'my-template-name');
        return this.container.create(RenderResponse, renderable);
    }
}
```

`PageController` was introduced to make this easier.

```ts
export class MyPageController extends PageController
{
    public page(request)
    {
        return this.container.create(Renderable, 'my-template-name');
    }
}
```

In case of `post` and `put` requests you will also have access to request body.  
You can select an appropriate base class based on the type of data you're handling.

If you're developing an API endpoint you should use the `JsonController`.

```ts
export class MyApiController extends JsonController
{
    public handleJson(request, json)
    {
        return new JsonResponse({ status: 'OK' });
    }
}
```

If you are handling a HTML form you should use the `FormController`.

```ts
export class MyFormController extends FormController
{
    public handleForm(request, form)
    {
        return new RedirectResponse('/back/to/previous/page');
    }
}
```

The `FormPageController` was specially created for controllers that
handle both displaying a page and handling form data.

```ts
export class MyFormPageController extends FormPageController
{
    public page(request, form?, error?: string)
    {
        return this.container.create(Renderable, 'my-template-name');
    }
}
```

In case of `post` and `put` requests you would either get the `form` or `error` argument
depending on whether form data was successfully parsed or not.
