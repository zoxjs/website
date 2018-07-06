---
title: Static Site Setup
url: /docs/static-site-setup
type: docs
include:
  - docs.sidebar
---

This page will guide you through creating a new static site project
and 

All you need to get started with static pages is to install these 2 npm modules:

```bash
npm i zox zox-static-pages
```

Then [bootstrap your environment](/docs/environment-bootstraping)
the same way as when normally running zox server.  
This will allow you to preview your pages.

To export your site you will need another script
where you will use the same environment
and the `StaticExportService` to get your rendered pages
and required js/css files.