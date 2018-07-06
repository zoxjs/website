---
title: Static Page Template
url: /docs/static-page-template
type: docs
include:
  - docs.sidebar
---

Page templates simply render page data into HTML.

Here's the most basic handlebars template for a markdown page:

```handlebars
<div class="article">
    <h1>{{ title }}</h1>
    {{#if date}}<p class="date">{{ formatDate date 'd. mmm yyyy.' }}</p>{{/if}}
    <div class="body">{{{ body }}}</div>
</div>
```

It simply prints the title, the date (if specified) and the parsed markdown page body.

In this example we explicitly specified the date format as `d. mmm yyyy.`,
but the recommended practice is to
predefine all date formats that you use in templates.

The `formatDate` helper uses the `DateFormatter` service.  
You can read more about how it works [here](/docs/date-formatter).

> **Note**  
While the data from the included partials is also available to the template
it is recommended to use custom blocks for parts of your page like
the navbar, footer and sidebar if the data is not related to the page.  
You can learn more about [page layout and blocks here](/docs/page-layout-and-blocks).