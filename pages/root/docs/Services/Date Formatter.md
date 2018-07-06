---
title: Date Formatter
url: /docs/date-formatter
type: docs
include:
  - docs.sidebar
---

Aside from formatting a `Date` object to a string,
the `Date Formatter` allows us to keep our date formats `consistent` across our site.

To avoid specifying the format when formatting the date
you can use one of the formats provided by default
or provide your own in the `date.format` config file.

Additionally it is possible to provide internationalization ( i18n )
for month and day names using config files with pattern: `date/{language}`.

If the i18n is not specified, or the config file for selected language
does not exist or is invalid the default month and day names will be used
and they are:

```yaml
dayNamesShort: [
    'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
],
dayNamesLong: [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
],
monthNamesShort: [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
],
monthNamesLong: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
],
```

The algorithm used by the Date Formatter is specified [here](http://blog.stevenlevithan.com/archives/date-time-format).

## Usage

The Date Formatter can be used like so:

```js
dateFormatter.formatDate(date, mask, i18n, utc);
```

The `date` can be either a Date object, a string representing a date
or the number of milliseconds since 1 January, 1970 UTC.
If `date` is null or undefined then the current time is used.

The `mask` can either be a date format or one of the predefined date formats.

The `i18n` can either be the i18n specification or the language, based on which to load config.

The `utc` specifies whether to format the date as UTC or not.

Examples:

```js
dateFormatter.formatDate();
dateFormatter.formatDate(null, 'longDate');
dateFormatter.formatDate(date, 'longDate');
dateFormatter.formatDate(date, 'mmmm d, yyyy');
dateFormatter.formatDate('2020 Jun 26');
dateFormatter.formatDate('2020 Jun 26', 'longDate');
dateFormatter.formatDate(1530454257058, 'longDate');
dateFormatter.formatDate(date, 'longDate', 'fr');
dateFormatter.formatDate(date, 'longDate', 'french');
```

## Handlebars helper

You can specify the `formatDate` handlebars helper like so:

```ts
@HandlebarsHelper('formatDate')
export class DateHelper implements IHandlebarsHelper
{
    @Dependency
    protected dateFormatter: IDateFormatter;

    public handle(context, date, format): string
    {
        return this.dateFormatter.formatDate(date, format);
    }
}
```

And use it like so:

```handlebars
{{formatDate date 'longDate'}}
```
