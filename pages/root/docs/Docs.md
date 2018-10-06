---
title: Get Started
url: /docs
type: docs
include:
  - docs.sidebar
---

Zox.js was designed to be flexible and extensible,
so depending your goals you likely wont need to go through most of the docs.

## [The Basics](/docs/environment-bootstrapping)

If you're looking to start coding right away
you'll first want to learn the main concepts
on which the web server was based,
like plugins and services.

But if you're just looking to create a static site
that wont be necessary for you
unless you're going to use some of the more advanced features.


## [Static Sites](/docs/static-site-setup)

You can quickly start creating your static site
simply by creating a `markdown` or a `yaml` file
and a corresponding template for each page type.

Using HTML forms to enter the data
in a more user friendly way is also possible,
but not available by default.


## [Rendering Pipeline](/docs/render-service)

If you're going to work with templates
you're going to want to know they are handled internally.

The entire pipeline revolves around `Renderable` objects
who's role is to find the target template
and provide it with the data it needs.


## [React SSR](/docs/react-ssr)

React is most often used for single page apps,
but with the web server you can embed React components
anywhere inside your page.

Using the built-in `GraphQL Web Socket` connection utility
you can easily load data into your component
and subscribe to a remote event feed
to keep your component up to date with the server state.


## [GraphQL](/docs/graphql-intro)

While at the beginning developing your API using `REST` endpoints
seems as a more practical approach,
as your app grows so does the time you'll spend on your API.

By creating a GraphQL schema instead
you'll be able to easily extend and maintain your schema.

On top of that the built-in `graphql-plugins`
allows you to define type fields (endpoints) in an almost `REST-like` way.