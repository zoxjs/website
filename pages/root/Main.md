---
title: Initial documentation
url: /main
---

## Develop and publish with ease

```bash
npm install web-server
```

Zox.js gives developers the power to build scalable web apps


### Page templates and React

Use your favorite templating engine
combined with a powerful rendering pipeline.  
Or use React to build single page apps
or to simply add interactivity to parts of your pages.

Built-in Server-side rendering for React will make your
pages Search engine friendly and let them load faster.

### GraphQL

Create decoupled GraphQL resolvers
in a similar way you would create REST controllers
and let the built in schema builder create 
the actual GraphQL schema for you.

Subscribe to any GraphQL subscription endpoint
via WebSocket or EventStream.

Use prepared queries and avoid the overhead of 
sending and validating the same query for each request.

### Dependency injection

Zox.js makes it painless to create services
that can be used from anywhere in your app,
in a Unit testing & Mocking friendly way.

The biggest benefit of the DI is that it allows you to
program to an interface, not an implementation.


##

> **Note**  
Requires good prior knowledge of JavaScript 
and Object-oriented programming

> **Note**  
While it is recommended to use TypeScript or Babel to make coding easier 
you can avoid transpilers and write raw js with only minimal code changes

##

#### A fast start

You will need the core module

```bash
npm i zox
```

##### Simple controller

All controllers must be classes with a `handle()` method.

Controllers are expected to return a `Response` object
which will be in charge of sending the http response.

Lets just create a controller that returns a string
and set it as our home page.

```typescript
@Route({
    route: '/typescript/example'
})
export class MyTypeScriptPage extends Controller
{
    public handle(): IResponse
    {
        return new StringResponse('Hello Type World');
    }
}
```

```js
export class MyJavaScriptPage extends Controller
{
    handle()
    {
        return new StringResponse('Hello Any World');
    }
}
Route({ route: '/javascript/example' })(MyJavaScriptPage);
```

##### Simple API

Creating API endpoints is as simple as 
creating a controller that returns `JsonResponse`.

The logic for loading the data from a database or another source
would be the same as without this framework.

Here we will use dummy data.

```typescript
@Route({
    route: '/api/hello'
})
export class MyApi extends Controller
{
    public handle(): IResponse
    {
        const data = { text: 'Hello World' };
        return new JsonResponse(data);
    }
}
```

```js
export class MyApi extends Controller
{
    handle()
    {
        const data = { text: 'Hello World' };
        return new JsonResponse(data);
    }
}
Route({ route: '/api/hello' })(MyApi);
```

##### Rendered HTML

Using the `rendering pipeline` requires us to use the `service container`.  
You can learn more about the `service container` at the docs.

In this example we create a `Renderable` element
with a property `text`.

The rendering pipeline will search for a template called `my-template-name`
and pass the `text` property to it.  
This template could be:  
`my-template-name.hbs`  
`my-template-name.ejs`  
`my-template-name.pug`  
...or any other supported format  

By returning it using the `RenderResponse` class
we let the rendering system wrap it in valid html markup
and add required js/css.

```typescript
@Route({
    route: '/page/hello'
})
export class MyPage extends Controller
{
    @Dependency
    protected container: IServiceContainer;
    
    public handle(): IResponse
    {
        const renderable = this.container.create(
            Renderable,
            'my-template-name'
        );
        renderable.text = 'Hello World';
        return this.container.create(RenderResponse, renderable);
    }
}
```

```js
export class MyPage extends Controller
{
    handle()
    {
        const renderable = this.container.create(Renderable, 'my-template-name');
        renderable.text = 'Hello World';
        return this.container.create(RenderResponse, renderable);
    }
}
Route({ route: '/page/hello' })(MyPage);
Dependency(IServiceContainer)(MyPage, 'container');
```

##### GraphQL



```typescript
export const BlogPostDef = `
type BlogPost {
  id: ID!
  title: String!
  text: String!
  date: String!
}
`;

@Resolver('BlogPost', 'date', BlogPostDef)
export class BlogPosDatetResolver extends ResolverBase
{
    public resolve(source, args, context, info: GraphQLResolveInfo): BlogPost
    {
        return source._doc.date.valueOf().toString();
    }
}

@Query('posts(skip: Int = 0, limit: Int = 25): [BlogPost]', BlogPostDef)
export class BlogPostsQuery extends ResolverBase
{
    @Dependency
    protected blogPost: IBlogPostModel;
    
    public resolve(source, {skip, limit}, context): Promise<any>
    {
        return this.blogPost.model.find().skip(skip).limit(limit).exec();
    }
}
```

Example usage:  
`http://localhost:8080/graphql?query={posts(offset:0,limit:5){id,title,text,date}}`

Or if you create a file `posts.graphql` with contents:
```graphql
{
  posts(offset: 0, limit: 5){
    id
    title
    text
    date
  }
}
```

You could execute it by simply calling:
`http://localhost:8080/gql/posts`

The general usage is: `/gql/:file_name` 

#### Dependency injection

Any class that requires a `service` must be instantiated 
using the `service container` instead of using the `new` keyword.

We can tell the system to assign the `service container`
(which is also a service)
to our field `container` by using the `Dependency()` method.

#### Rendering pipeline

`Renderable` class require the `rendering service`,
which will find the corresponding template
and pass it to the rendering engine associated
with template's file extension.

`RenderResponse` class requires the `layout service`
which will add the header, footer and sidebar to our page
if any were specified in the configuration.
