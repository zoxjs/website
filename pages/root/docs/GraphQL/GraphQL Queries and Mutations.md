---
title: GraphQL Queries and Mutations
url: /docs/graphql-queries-mutations
type: docs
include:
  - docs.sidebar
---

The fields of the top-level types `Query` and `Mutation` are usually used as endpoints
for requests, much like REST API endpoints.

To make defining these _endpoints_ easier the top-level fields are defined alongside their resolvers.

```ts
@Query('posts(offset: Int = 0, limit: Int = 25): [Post]', PostTypeDefs)
export class PostsQuery implements IResolver
{
    public handle(source, {offset, limit}, context, info): Array<Post>
    {
        return posts.slice(offset, offset + limit);
    }
}

@Mutation('postCreate(author: ID, text: String): Post', PostTypeDefs)
export class PostCreateMutation implements IResolver
{
    public handle(source, {author, text}, context, info): Post
    {
        const post: Post = {
            author,
            text,
            date: new Date(),
        };
        posts.push(post);
        return post;
    }
}
```

Both `@Query` and `@Mutation` take the field definition as the first parameter
and type defs as the second parameter.
