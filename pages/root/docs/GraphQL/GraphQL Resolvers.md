---
title: GraphQL Resolvers
url: /docs/graphql-resolvers
type: docs
include:
  - docs.sidebar
---

GraphQL types often have fields who's data has to be loaded from the database,
calculated from other fields or just formatted.
This is achieved by assigning a resolver to that field.

Lets see how we could load the `author` of a `Post`.

```ts
export const PostDef = `
type Post implements Node
{
  id: ID!
  author: User!
  text: String!
  created: Date!
}
`;

export const PostTypeDefs = [PostDef, NodeDef, UserDef, DateDef];

@Resolver('Post', 'author', PostTypeDefs)
export class AuthorResolver implements IResolver
{
    public handle(source: Post, args, context, info: GraphQLResolveInfo): User
    {
        return users.find(u => u.id == source.user);
    }
}
```

In this example we assigned our resolver to the `author` field of the `Post` type
and we referenced the type defs related to the Post type.

The arguments to `@Resolver` are:
- type name
- field name
- type def or an array of type defs

For `PostTypeDefs` we referenced 4 type defs:
- `PostDef` because it is our target type
- `NodeDef` because Post implements the Node interface
- `UserDef` because the author field is of type User
- `DateDef` because the created field is of type Date

## Base resolvers

In most cases you'll want to check user's access rights before resolving a field.
To avoid doing this in each individual resolver
it is recommended to instead use a base resolver class which could look like this:

```ts
export abstract class ResolverBase implements IResolver
{
    public handle(source, args, context, info: GraphQLResolveInfo): any
    {
        // check access...
        
        return this.resolve(source, args, context, info);
    }

    public abstract resolve(source, args, context, info: GraphQLResolveInfo): any;
}
```
