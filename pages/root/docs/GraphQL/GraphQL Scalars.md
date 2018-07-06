---
title: GraphQL Scalars
url: /docs/graphql-scalars
type: docs
include:
  - docs.sidebar
---

Scalars are used to move parsing, validation and serialization of data types out from resolvers.

Scalars have 3 methods:

`serialize(value)` converts a object to a string, number or boolean.  
This value comes from our resolvers and the result is sent to the client.

`parseValue(value)` converts a string, number or boolean to an object.  
This value comes from the client and the result is passed to the resolver.

`parseLiteral(valueNode, variables?)` coverts AST ValueNode to an object.  
The value is defined in the query and we are given the parsed AST representation
containing:  
`{ kind: string, value: string }`  
The variables can be accessed here as well, if any are provided.

All of 3 these methods can return `undefined` (or not return anything) to indicate an invalid value.
Or an Error can be thrown to show a custom error message.

## Date Scalar

Date is probably the most used non-standard scalar
and graphql-system comes with a built-in version
that serializes Date objects as the number of milliseconds since 1 January, 1970 UTC.

This is also a great template for creating new custom scalars.

```ts
export const DateDef = `
scalar Date
`;

@Scalar('Date', DateDef)
export class DateScalar implements IScalar<Date, number>
{
    public serialize(value: Date): number
    {
        return value.valueOf();
    }

    public parseValue(value: number): Date | void
    {
        if (typeof value === 'number')
        {
            return new Date(value);
        }
    }

    public parseLiteral(valueNode: ValueNode, variables?: { [p:string]: any }): Date | void
    {
        if (valueNode.kind === Kind.INT)
        {
            const value = parseInt(valueNode.value);
            if (!isNaN(value))
            {
                return new Date(value);
            }
        }
    }
}
```

## RegExp Scalar

Regular expressions are great for filtering data,
so graphql-system comes with a built-in version of this scalar.

The serialized type is a string and it can use one of 2 formats:
- `"/regexp?/g"` version with slashes allows us to add modifiers
- `"regexp?"` version without modifiers
