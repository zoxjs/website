---
title: Rendering Variables
url: /docs/rendering-variables
---

To forward variables to your template you can simply 
attach them to your Renderable object:

```ts
const renderable = this.container.create(Renderable, 'my-template');
renderable.title = 'My Title';
renderable.body = 'Hellp World';
```

And we will be able to directly access them in our template. 
Here's an example for your `my-template.hbs` template:

```handlebars
<div>
    <h1>{{title}}</h1>
    <p>{{body}}</p>
</div>
```

This is possible because the Renderable object is 
directly passed as the context of the template.

## Nesting

It's also possible to nest templates simply by creating child `Renderable` objects:

```ts
const renderable = this.container.create(Renderable, 'my-template');
const renderableTitle = this.container.create(Renderable, 'my-template-title');
const renderableBody = this.container.create(Renderable, 'my-template-body');
renderable.title = renderableTitle;
renderable.body =  renderableText;
renderableTitle.text = 'My Title';
renderableText.text = 'Hellp World';
```

Or more simply:

```ts
const renderable = this.container.create(Renderable, 'my-template');
renderable.title = this.container.create(Renderable, 'my-template-title');
renderable.body =  this.container.create(Renderable, 'my-template-body');
renderable.title.text = 'My Title';
renderable.body.text = 'Hellp World';
```

We can still write a single template like we did before:

`my-template.hbs`

```handlebars
<div>
    <h1>{{title.text}}</h1>
    <p>{{body.text}}</p>
</div>
```

But we will also be able to split into 3 separate templates

`my-template.hbs`

```handlebars
<div>
    {{title}}
    {{body}}
</div>
```

`my-template-title.hbs`

```handlebars
<h1>{{text}}</h1>
```

`my-template-body.hbs`

```handlebars
<p>{{text}}</p>
```

And we will get exactly the same result!

## Flexibility of Renderable objects

Normally you when you try to convert an object to a string
in JavaScript you would get `[object Object]`.
But the `Renderable` class forwards calls to `toString()`
to the rendering pipeline which finds and executes a templates.  
This gives us the ability to split our templates as much as we need to.

Many rendering engines recognize this need
and have built in systems to handle it.
For example Handlebars has partial templates
which can be included in any other template.

But that system has one big disadvantage:
_you must specify which partial template to use._

On the other hand the main use case for Renderable objects 
is to wrap other Renderable objects.

For example the `RenderableHtml` class will wrap it's content
into <html> and <body> tags,
while the `RenderablePage` class will split it's content into
header, footer and sidebar areas.
Then you have `RenderableView` class that handles pagination
for a list of items.

Neither one of these can know which template to use for it's partials.

## Custom Renderable objects

Earlier we used the base class for `Renderable` objects,
but this is not the recommended practice.

Instead we should create a custom renderable component that extends `Renderable`
and pass the properties through the constructor:

```typescript
import {Renderable} from "web-server/Renderable";

export type Props = {
    displayMode: 'full' | 'teaser' | 'sidebar'
    id: string
    title: string
    body: string
}

export class RenderablePost extends Renderable
{
    public readonly displayMode: string;
    public readonly id: string;
    public readonly title: string;
    public readonly body: string;

    constructor(props: Props)
    {
        super('post');
        this.displayMode = props.displayMode;
        this.id = props.id;
        this.title = props.title;
        this.body = props.body;
    }
}
```

For now this does not do much other than calm down TypeScript's
language service, which would have been screaming at us in the previous examples
for assigning unknown props.

But the real power here is the ability to use computed props
and allow multiple possible template names.

Lets create a simple excerpt for our post!

```typescript
export class RenderablePost extends Renderable
{
    public get excerpt(): string
    {
        // Return the first 100 characters.
        // In real world you will probably want
        // to return the first paragraph instead,
        // but that in beyond the scope of this tutorial.
        return this.body.substr(0, 100);
    }
}
```

And lets add another dynamic name to out template name list.

```typescript
export class RenderablePost extends Renderable
{
    public templateCandidates()
    {
        const candidates = super.templateCandidates();
        candidates.push('post-' + this.displayMode);
        return candidates;
    }
}
```

Depending on the display mode
the object will be rendered either by one of there templates
`post-full.hbs`, `post-teaser.hbs` or `post-sidebar.hbs`,
or if the primary template does not exist for the selected display mode
we would fall back to the generic `post.hbs` template.

The primary use case for this is using a different template 
depending on where you are showing your data.

The `post-full.hbs` would be used to display the entire post content

```handlebars
<div id="post-full-{{id}}" class="post-full post-full-{{displayMode}}">
    <h1>{{title}}</h1>
    <div>{{{body}}}</div>
</div>
```

The `post-teaser.hbs` could be used for a list of latest posts:

```handlebars
<div id="post-teaser-{{id}}" class="post-teaser post-teaser-{{displayMode}}">
    <h1>{{title}}</h1>
    <div>{{{excerpt}}}</div>
</div>
```

The `post-sidebar.hbs` could be used for suggested post in the sidebar:

```handlebars
<div id="post-sidebar-{{id}}" class="post-sidebar post-sidebar-{{displayMode}}">
    <h1>{{title}}</h1>
</div>
```
