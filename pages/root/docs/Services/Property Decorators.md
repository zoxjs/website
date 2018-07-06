---
title: Property Decorators
url: /docs/property-decorators
type: docs
include:
  - docs.sidebar
---

To make writing static pages easier we need a way to preprocess our data.
In zox.js this is done using Property Decorators.

## Default decorators

The most commonly used decorators are included by default:
- `md` compiles `markdown` text
- `nl2br` converts new lines to `<br>` tags
- `upper` converts text to upper case
- `lower` converts text to lower case
- `date` parses a string or number to a Date object
- `sort` sorts an array by the selected property
- `reverse` reverses the order of items in an array

## Usage

The main way of writing content for static pages in zox.js is in markdown.
But markdown text needs to be compiled to html before it is used in templates.  
This is where the `.md` decorator comes in.

Lets look at an example where we have a list of cards with feature names and their descriptions:

```yaml
title: Title
url: /my/path
cards:
  - title: First Feature
    text.md: |-
      Lorem ipsum **dolor** sit amet.
      
      Consectetur `adipiscing elit` sed do.
  - title: Second Feature
    text.md: |-
      Eiusmod tempor incididunt.
      
      Ut labore et dolore magna aliqua.
```

After preprocessing property decorators our data would be equivalent to this:

```yaml
title: Title
url: /my/path
cards:
  - title: First Feature
    text: |-
      <p>Lorem ipsum <strong>dolor</strong> sit amet.</p>
      <p>Consectetur <code>adipiscing elit</code> sed do.</p>
  - title: Second Feature
    text: |-
      <p>Eiusmod tempor incididunt.</p>
      <p>Ut labore et dolore magna aliqua.</p>
```

We just saved ourselves some time on typing and kept our source text readable.

As a simpler alternative to markdown there is a `.nl2br` decorator
that converts new line characters to `<br>` tags,
which can be useful if you don't have to have `<p>` tags in your result.

```yaml
text.nl2br: |-
  Lorem ipsum
  dolor sit amet
```

Would become:

```yaml
text: Lorem ipsum<br>dolor sit amet
```

The `.sort` decorator is more complex, since it requires parameters.
- order: ASC or DSC
- orderBy: property in items
- items: array of object

Here's an example:

```yaml
item.sort:
  order: asc
  orderBy: title
  items:
    - title: Lorem ipsum
      text: ...
    - title: Dolor sit amet
      text: ...
    - title: Eiusmod tempor
      text: ...
```

Would be converted to:

```yaml
item:
  - title: Dolor sit amet
    text: ...
  - title: Eiusmod tempor
    text: ...
  - title: Lorem ipsum
    text: ...
```

## Decorator Chaining

Multiple decorators can be used on the same property.

For example:

```yaml
text.upper.md: My **bold** text
```

Would be converted to:

```yaml
text: MY <strong>BOLD</strong> TEXT
```

The decorators are executed from left to right.

## Custom property decorators

Property decorators take a single parameter, the property value
and they return a new value for that field.

```ts
@PropertyDecorator('upper')
export class UpperPropertyDecorator implements IPropertyDecorator
{
    public decorate(property: string): string
    {
        return property.toUpperCase();
    }
}
```
