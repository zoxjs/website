---
title: Rendering Intro
url: /docs/rendering-intro
---

Learning new stuff can be a little confusing at first,
especially when learning about new frameworks.  

Before we start we'll need a rendering engine,
so let's get one from npm!  

In this example we will use handlebars,
but if this is not your jam
you can look through the `list of supported engines`.

Run:

```bash
npm i web-handlebars
```

Now create a template called `my-template-name.hbs`
anywhere in your templates directory
and write in it:

```html
<h1>Hello World!</h1>
```

For now lets start with as simple controller as possible.  
We will create a simple `Renderable` element without any properties
which will simply look for a template with the given name.
Since we want to return a valid HTML file
we will use `RenderResponse` to wrap out template and send the HTML response.

```ts
const renderable = new Renderable('my-template-name');
return new RenderResponse(renderable);
```

But our cde will not run yet
since neither `Renderable` nor `RenderResponse` know how to find nor how to use templates,
so they need classes that do.  
And the `container` has references to initialized instances of these classes.  
So all we need to do is pass these references to our new instances.

```ts
const renderable = new Renderable('my-template-name');
this.container.resolve(renderable);

const response = new RenderResponse(renderable);
this.container.resolve(response);

return response;
```

This can be shortened to:

```ts
const renderable = this.container.create(Renderable, 'my-template-name');
return this.container.create(RenderResponse, renderable);
```

And to get the current container we simply list it as a required reference
or a `Dependency`!  
Here's how your controller should now look:

```typescript
import {Route} from "web-server/Route";
import {Controller} from "web-server/Controller";
import {IResponse} from "web-server/Responses/IResponse";
import {Route} from "web-server/Route";
import {RenderResponse} from "web-server/Responses/RenderResponse";
import {Renderable} from "web-server/Renderable";
import {Dependency, IServiceContainer} from "web-server/ServiceContainer";

@Route({
    route: '/'
})
export class MyHome extends Controller
{
    @Dependency
    private container: IServiceContainer;
    
    public handle(): IResponse
    {
        const renderable = this.container.create(Renderable, 'my-template-name');
        return this.container.create(RenderResponse, renderable);
    }
}
```

Or if you're using JavaScript:

```js
import {Route} from "web-server/Route";
import {Controller} from "web-server/Controller";
import {Route} from "web-server/Route";
import {RenderResponse} from "web-server/Responses/RenderResponse";
import {Renderable} from "web-server/Renderable";
import {Dependency, IServiceContainer} from "web-server/ServiceContainer";

export class MyHome extends Controller
{
    handle()
    {
        const renderable = this.container.create(Renderable, 'my-template-name');
        return this.container.create(RenderResponse, renderable);
    }
}
Route({
    route: '/'
})(MyHome);
Dependency(IServiceContainer)(MyHome, 'container');
```

_Further examples will only contain TypeScript versions,
so you should either make the switch now, 
 if you haven't already or memorize this pattern._

In the next example we will look at how we can pass properties to our templates.
