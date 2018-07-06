---
title: GraphQL Enums
url: /docs/graphql-enums
type: docs
include:
  - docs.sidebar
---

Enums can be used to specify the range of values a field can have.

You should only use enums for things you know will not change during runtime.

For example days of the week (Monday - Sunday) would be easier
to work with if they were stored as an enum instead of a number or a string.

On the other hand things like user permission groups
(Anonymous, Authenticated, Moderator, Owner, Admin)
are better left as strings or numbers.  
This is because in most CMS system the Admin can create or remove these groups on their site.  
Of course if you do not intend to allow this to be changed by users
(including the Admin user) it is ok to make it an enum.

## There are 2 ways to define an enum

As a type definition, which has to be referenced by the resolvers that use it.  
In this case the value seen by resolvers and the client are the same
and that is the enum field name.

```typescript
export const WeekDayDef = `
enum WeekDay {
  Monday
  Tuesday
  Wednesday
  Thursday
  Friday
  Saturday
  Sunday
}
`;
```

If you wish to assign custom values to enum field you can define the enum as an `@Enum` plugin.
In this case the client will see the field name and resolvers will see the assigned value.

We can assign any number, string, boolean, object or even a function to enum fields.  
The only invalid values are undefined and null.
Other than that we just have to make sure we don't assign the same value to multiple fields,
otherwise the client will always see the name of the first field with that value.

An Enum only needs to have a `values` property containing `string: any` pairs.
Values can be defined either as a get method or as a normal property.

```ts
@Enum('WeekDay')
export class WeekDayEnum implements IEnum
{
    get values() {
        return {
            Monday: 1,
            Tuesday: 'Tuesday',
            Wednesday: true,
            Thursday: { value: 4 },
            Friday: 5.1,
            Saturday: () => 6,
            Sunday: 7,
        };
    };
}

@Enum('WeekDay')
export class WeekDayEnum implements IEnum
{
    readonly values = {
        Monday: 1,
        Tuesday: 'Tuesday',
        Wednesday: true,
        Thursday: { value: 4 },
        Friday: 5.1,
        Saturday: () => 6,
        Sunday: 7,
    };
}

// the above version is a shorthand for:

@Enum('WeekDay')
export class WeekDayEnum implements IEnum
{
    readonly values;
    
    constructor() {
        this.values = {
            Monday: 1,
            Tuesday: 'Tuesday',
            Wednesday: true,
            Thursday: { value: 4 },
            Friday: 5.1,
            Saturday: () => 6,
            Sunday: 7,
        };
    }
}
```

Like all other graphql plugins the `@Enum` plugins can declare dependencies to access services.
But unlike other plugins the instances of `@Enum` plugins are only used once at startup.

If you want to load the enum values from a database
you should load those values before building the schema,
because the values are read and used synchronously.

If you wish to reload enum names or values you will have to rebuild the entire schema.

If you wish to make enum value dynamic you can either assign a function as the value,
where the function would return the actual value;  
Or assign an object with a value property eg: `{ value: string }`
and alter it's value property when the actual value changes.
