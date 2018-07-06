---
title: Routing
url: /docs/routing
type: docs
include:
  - docs.sidebar
---

When we receive a new request we first have to figure out which controller to invoke.

This is done using controller resolvers.
They are found using `@ControllerResolver` plugins
which as the argument take priority,
where the resolver with the smallest number is used first.

The main resolver is the `RoutePluginManager`
which uses `@Route` plugins to find a controller.

```ts
@Route({
    // the default method is 'get'
    method: 'get',
    route: '/my/path'
})
```

There is also a resolver for static pages,
where the page url is matched against the request url.  
This resolver will use the same controller for all static pages.

In case a controller is not found we will turn to alias resolvers,
which will check if the request url is an alias of another url
and if it is we will search for a controller for this other url.

Alias resolver are found using the `@AliasResolver` plugins.

In case a controller could not be found the default controller will be invoked.

If a default controller is not set then the server will return a 404 response.
