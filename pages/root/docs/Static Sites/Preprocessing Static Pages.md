---
title: Preprocessing Static Pages
url: /docs/static-page-preprocessing
type: docs
include:
  - docs.sidebar
---

Sometimes you want to change the template depending on page contents
or load additional data into your page.  
In zox.js this is done using custom `Renderable` elements.

If you haven't already learned what [Renderable elements](/docs/rendering-engines) are
then make sure to read up on that before continuing.

## Template Candidates

The default template candidates for static pages are:  
`static-page`  
`static-page-{type}`  
`static-page-{fileName}`  
`static-page-{type}-{fileName}`  

And this is usually enough for all pages.  
But if you want more control over template names that can be easily achieved.

Here's how you could assign a dynamic template name based on page fields:

```ts
@StaticPageType('event')
export class CustomRenderableEvent extends RenderableStaticPage
{
    public templateCandidates()
    {
        return ['event', 'event-' + this.eventType];
    }
}
```

Usually you would have to name your template something like `static-page-event.hbs`,
but now you can call it `event.hbs` or `event-hangout.hbs` instead.

## Dynamic fields

If you want to show data which is not a part of your pages
that is as simple as creating a `get` method for a field.

```ts
@StaticPageType('my-type')
export class CustomRenderableType extends RenderableStaticPage
{
    @Dependency
    protected config: IConfigService;

    public get siteName(): string
    {
        return this.config.getConfig('site').siteName;
    }
}
```

> **Note**  
Fields defined in the page data will override the dynamic ones.