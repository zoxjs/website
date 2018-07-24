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

[node](https://nodejs.org/) to run the project

[git](https://git-scm.com/downloads) for cloning the project

[tsc](https://www.npmjs.com/package/typescript) for compiling typescript

### Optional global tools

[browserify](https://www.npmjs.com/package/browserify) for building frontend scripts

[watchify](https://www.npmjs.com/package/watchify) for watching frontend scripts for changes

[sass](https://www.npmjs.com/package/sass) for building css

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

### Publishing

First make sure to set the remote origin for the source repository and the www repository.

Then build static files.

Finally commit and push all changes on both repositories.

Depending on which template project you used it might have a command that does all this for you, eg:

```bash
npm run build-publish
```
