---
title: Render Service
url: /docs/render-service
type: docs
include:
  - docs.sidebar
---

Render Service was created to abstract away
how templates are found, compiled and used.

Rendering data can be achieved simply be passing data to the render service.

```js
const data = { text: 'Hello World' };
renderService.render(['alt-template-name', 'primary-template-name'], data);
```

The renderService will then lookup listed templates in the reverse order.
It will first search for `primary-template-name.{ext}`
and if it is not found it will fall back to `alt-template-name.{ext}`.

If no matching template is found then an empty string is returned
(unless debug mode is enabled).

The template will then be compiled by a rendering engine based on the file extension.

## Config

Templates will not be reloaded on change
unless the watch mode is enabled in the global config.

If the debug mode is enabled in the global config
then a comment will be inserted above and below the template result
to let you know which template was used to give that result
and which alternative template names you could have used.