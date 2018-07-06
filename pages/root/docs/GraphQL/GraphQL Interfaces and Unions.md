---
title: GraphQL Interfaces and Unions
url: /docs/graphql-interfaces-unions
type: docs
include:
  - docs.sidebar
---

When we want to define a field that can return different types of data
we have to define special rules for those fields and how their type is resolved.

In GraphQL we have 2 tools we can use to define these rules:
- interfaces which define a list of fields the result type must have
- unions which define a set of types that a field can return

Lets start by defining an interface and a union.

```typescript
export type Node = {
    id: number
};

export const NodeDef = `
interface Node {
  id: ID!
}
`;

export const PostUnionDef = `
union PostUnion = BlogPost | ForumPost
`;

export const BlogPostDef = `
type BlogPost implements Node
{
  id: ID!
  author: User!
  text: String!
}
`;

export const ForumPostDef = `
type ForumPost implements Node
{
  id: ID!
  threadId: ID!
  author: User!
  text: String!
}
`;
```

To be able to define fields like these:

```
node(id: ID!): Node
post(id: ID!): PostUnion
```

We will have to check what kind of data was returned by this field's resolver.

Both interfaces and unions are resolved in the same way,
by checking the contents of the value.

Since in our example only the forum posts have a reference to the thread they belong to
we can check if the value has the `threadId` property
and deduce if it is a ForumPost or a BlogPost.

```ts
@ResolveType('Node', NodeDef)
export class ResolveNode implements IResolveType
{
    public resolve(value, context, info): string
    {
        return 'threadId' in value ? 'ForumPost' : 'BlogPost';
    }
}

@ResolveType('PostUnion', PostUnionDef)
export class ResolvePostUnion implements IResolveType
{
    public resolve(value, context, info): string
    {
        return 'threadId' in value ? 'ForumPost' : 'BlogPost';
    }
}
```
