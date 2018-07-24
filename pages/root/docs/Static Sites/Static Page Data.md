---
title: Static Page Data
url: /docs/static-page-data
type: docs
include:
  - docs.sidebar
---

One of the goals of static sites is creating web pages
with as little works as possible.
And zox.js aims to provide you with a seamless experience
when developing static sites.

The default directory structure looks like this:

```yaml
pages:
  root: Each file will represent a unique page
  partials: Data which can be included in pages
```

You can start by creating a new page in the root pages directory.  
Pages can have either **.yaml** ( **.yml** ) or **.md** extension.

If your static pages share data (eg: a sidebar)
you can create that as a partial and `include` it in pages that require it.  
Partials can only have a **.yaml** ( **.yml** ) extension.

> **Note**  
It's also possible to use **json** file format for static pages and partials,
but **yaml** is far more practical for humans to work with,
so you likely wont ever use **.json** files here.

## Built-In Fields

All pages must at least contain a title field,
but will usually contain a few others.  
Here's a basic yaml page example:

```yaml
# built-in fields
title: My Page
url: /my/page/path
date: 2020 Jun 16
type: event
include:
  - sidebar/event-list # path to your partial

# custom fields
myText: ...
sections:
- hero:
    text: ...
    subText: ...
```

You can add any other fields and they will all be available to the template.

Thanks to `Property Decorators` it is also possible
to embed markdown into your yaml pages like so:

````yaml
title: My Page
url: /my/page/path

myText.md: |-
  Markdown is great because it lets you
  easily create paragraphs and _style_ the text.
  
  This is achieved simply by adding `.md`
  at the end of the field name.
  
  You can then print rendered markdown in your templates
  the same way as any other field
  
  {{{ myText }}}
````

You can learn more about this `Property Decorator`
and others [here](/docs/property-decorators).

But it is impractical to very write long text this way
since you don't get the luxury of a syntax highlighting
and if you're writing blog posts you'll probably going to have
only a single text field with all of the markdown text in it.

## Enter markdown pages

Markdown pages can also contain all of the same fields as yaml pages
but are at the same time more practical for content editors to write.

```yaml
---
# built-in fields
title: My Page
url: /my/page/path
date: 2020 Jun 16
type: event
include:
  - sidebar/event-list # path to your partial

# custom fields
myText: ...
---

Your regular `markdown` text goes below.
```

Here are the rules for the built-in fields:

- If `title` is not specified then the file name is used
- If `url` is not specified then it is generated from the `title` field
and the file path relative to the root pages directory
without the base file name
- On .md pages the markdown text will be parsed and assigned to the `body` field
- If the `date` is specified then it will be wrapped with `new Date()`,
you can then assign the date format in the template
- On markdown pages the `body` property is reserved for page content
- If the page `type` is specified then this will be added to the template name;  
eg: if `type` is `event` then the template candidate would be `static-page-event.{ext}`
- If `include` is specified and is an Array
then the requested partial will be copied into this page;  
If `include` is specified and is an Object
then the requested partial will be copied into this page under the named field
- If `meta` is specified then those meta tags are added to the html head
- Alternatively you can specify `__head` to assign raw text to the html head
- All other props are passed to the template as-is

These pages will use the template called
`static-page-{type}.{ext}` if page type is specified or
`static-page.{ext}` if it is not.
