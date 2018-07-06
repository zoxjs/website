---
title: Page Layout and Blocks
url: /docs/page-layout-and-blocks
type: docs
include:
  - docs.sidebar
---

Web pages usually contain a navbar, a footer and other elements in addition to the main page content.

## Configuration

The page layout system splits the page into regions.
Each region can contain a list of blocks.
This list is specified in the `blocks` config file.  
Here's an example of what the `blocks` config file could contain:

```yaml
header:
  - navbar
  - notifications
content:
  - leftSideSidebar
  - content
  - rightSideSidebar
footer:
  - footer
```

Blocks can optionally have settings.
The directory containing block settings can be specified in the `blocks.data` config file
and the default is `directory: blocks`.

Block settings can be in any sub-directory of the specified directory
and they will be matched using the base file name.  
Supported file extensions are **.yaml** ( **.yml** ) and **.json**.

## Block plugins

All blocks must have a Renderable class associated with them.
A Renderable class can be associated with a block
by marking it as a `@Block('block-name')` plugin.

If a block does not have an associated Renderable class then the default `RenderableBlock` is used.
This class simply passes the settings to the template
and specifies the target template as `block-{block-name}` and uses the `block` template as fallback.

Constructor arguments for renderable blocks are
the block name, the main page content and block settings if the file exists.  
`constructor(block: string, content: IRenderable, settings?)`

The layout system has 2 built-in blocks: `content` and `pure-content`.  
The `pure-content` block simply returns the main page content,
while the `content` block allows us to wrap our content using a template called
either `block-content-{content-type}`, `block-content` or `block`.
