---
title: Renderable Elements
url: /docs/renderable-elements
type: docs
include:
  - docs.sidebar
---

Renderable Elements were introduced to make templates easy to preprocess and compose.

In general you should not need to call the
[render service](/docs/render-service) directly,
but instead create a `Renderable` element and let it do it for you.

The `Renderable` class can be used directly, like this:

```js
const renderable = this.container.create(Renderable, 'my-template');
renderable.title = 'My Title';
renderable.body = 'Hellp World';
```

Here we created a new Renderable object and we set 'my-template' as it's type,
which is also going to be used as the template name.
Then we assigned arbitrary properties to it.

Assuming we use Handlebars our template would be called
`my-template.hbs` and we will be able to directly access
the properties of our Renderable object like this:

```handlebars
<div>
    <h1>{{title}}</h1>
    <p>{{body}}</p>
</div>
```

## Nesting

It's also possible to nest templates simply by creating child `Renderable` elements:

```js
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

But we will also be able to split it into 3 separate templates

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

And we will get exactly the same result.

## Custom Renderable Elements

`Renderable` elements are useful on their own,
but to take full advantage of them you should create a custom class
that extends `Renderable` and takes props through the constructor.

```ts
import {Renderable} from "zox/lib/Renderable/Renderable";

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

This will let us validate and preprocess the props
before they are used in the template.

But the real power here is the ability to use computed props
and allow multiple possible template names.

Lets create a simple excerpt for our post.
This could be used in the teaser mode for the post
when displaying the list of latest posts.

```ts
export class RenderablePost extends Renderable
{
    public get excerpt(): string
    {
        // Return the first 100 characters.
        // In practice you will probably want
        // to return the first paragraph instead,
        // but that in beyond the scope of this tutorial.
        return this.body.substr(0, 100);
    }
}
```

And lets add a dynamic name to our template name list.

```ts
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

Now depending on the display mode
the element will be rendered by one of these templates
`post-full.hbs`, `post-teaser.hbs` or `post-sidebar.hbs`,
or if the template does not exist for the selected display mode
we would fall back to the generic `post.hbs` template.

The primary use case for this is using a different template 
depending on where you are showing your data.

The `post-full.hbs` would be used to display the entire post content

```handlebars
<div id="post-{{id}}" class="post post-full">
    <h1>{{title}}</h1>
    <div>{{{body}}}</div>
</div>
```

The `post-teaser.hbs` could be used for a list of latest posts:

```handlebars
<div id="post-teaser-{{id}}" class="post post-teaser">
    <h1>{{title}}</h1>
    <div>{{{excerpt}}}</div>
</div>
```

The `post-sidebar.hbs` could be used for suggested post in the sidebar:

```handlebars
<div id="post-sidebar-{{id}}" class="post post-sidebar">
    <h1>{{title}}</h1>
</div>
```
