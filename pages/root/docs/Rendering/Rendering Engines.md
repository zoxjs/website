---
title: Rendering Engines
url: /docs/rendering-engines
type: docs
include:
  - docs.sidebar
---

The purpose of render engine plugins is simple, compile a template string into an executable function.

`@RenderEngine` plugins have to specify a list of file extensions which should be associated with them.
This is how the render service knows which render engine to use for which template.

Render engines only need to have a `compile()` method
that will take the template string and the file name
and return a function that takes a context object and returns a string.

```ts
@RenderEngine('hbs', 'handlebars')
export class HandlebarsEngine implements IRenderEngine
{
    public compile(template: string, filename: string): (context) => string
    {
        return Handlebars.compile(template);
    }
}
```

While the basic version of the Handlebars plugin would only call the `Handlebars.compile` method,
in practice we will most likely want to have support for partials, helpers and decorators.

Templates are only compiled once, just before they are first used.  
If you can enable watch mode in the global config
the render service will clear the cached version of the templates that change.

## Built-in render engine plugins

The most basic engine is the `JSTemplateLiteralEngine`.
As the name suggests this engine simply treats the template as a javascript template literal.  
It is associated with the `.js.html` file extension.
The context is passed as the `_` argument
and it's only feature is that it does not print variables if they are null or undefined.  
The template can be wrapped in a try-catch block by setting `try_catch` to `true`
in the `js.html` config file.

```xml
<p>${_.text}</p>
```

The most feature rich engine is `HandlebarsEngine`.  
Is is associated with the `.hbs` and `.handlebars` extensions.  
It supports custom helper and decorator functions
using `@HandlebarsHelper('name')` and  `@HandlebarsDecorator('name')` respectively.  
And it can use partial templates which are by default located in the `partials` directory.  
Path to partials and the compile options can be set in the `handlebars` config file
and the default values are:

```yaml
partials: partials
# compile: {}
```

Other render engine plugins have mostly just a basic support
and simply forward the settings from their config files to the underlying npm module.

Notes on feature support:

- `Mustache`: no support for partials

- `EmbeddedJS`: (ejs): can include templates relative to the current template,
but the included template file is reloaded every time;  
no context object is provided to the template

- `Twig`: can include templates relative to the current template,
but even if you enable the watch mode the included template will not be reloaded
unless the template that includes it is modified;  
no block support

- `Nunjucks`: basic support

- `Pug`: basic support
