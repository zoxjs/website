---
title: Static Site Setup
url: /docs/static-site-setup
type: docs
include:
  - docs.sidebar
---

The easiest way to setup a new project is using the [CLI tool](https://www.npmjs.com/package/zox-cli).

### Install

```bash
npm i -g zox-cli
```

### Required global tools

**git** for cloning the project

**npm** for installing dependencies

**tsc** for compiling typescript

### Usage

```bash
zox init <template-name> <project-name>
```

### Example

```bash
zox init static-site-handlebars my-site
```

### Custom templates

```bash
zox init <username>/<repo> <my-project>
```
