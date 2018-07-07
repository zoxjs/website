---
title: GraphQL Intro
url: /docs/graphql-intro
type: docs
include:
  - docs.sidebar
---

Zox.js was created with one goal in mind: **Making scalable systems**  
And this can easily be achieved using the `graphql-plugins`.

Setup a new zox project with GraphQL support:

```bash
npm i zox zox-plugins graphql-plugins
```

Lets start by defining a data type. Create a file called `User.ts`

```typescript
// GraphQL type:

export const UserDef = `
type User
{
  id: ID!
  name: String
  subscribedTo: [User]
}
`;

// TypeScript types corresponding to the database tables:

export type User = {
    id: number
    name: string
};

export type UserSubscription = {
    userId: number
    subscribedToUserId: number
};

// TypeScript type corresponding to our output

export type UserData = {
    id: number
    name: string
    subscribedTo: Array<UserData>
};
```

In our example GraphQL will expect the User type to have a list of subscriptions,
but in our database this is stored in a separate table.

So we will have to write a resolver to fetch this additional data.  
We will then also have to define a top level query field, to make the user data available.  
In the following example we will use mocked versions of our _users_ and _subscriptions_ tables.

Create a file called `UserResolvers.ts`

```typescript
import {Query, Resolver, ResolverBase} from "graphql-plugins";
import {UserData, User, UserSubscription, UserDef} from "./User";
import {users, subscriptions} from "./MockUserData";

@Resolver('User', 'subscribedTo', UserDef)
export class UsersQuery extends ResolverBase
{
    public resolve(thisUser, args, context): Array<UserData>
    {
        return subscriptions
        // filter only subscriptions of this user
        .filter(s => s.userId == thisUser.id)
        // load users to which this user is subscribed to
        .map(s => users.find(u => u.id == s.subscribedToUserId));
    }
}

@Query('user(id: ID!): User', UserDef)
export class UserQuery extends ResolverBase
{
    public resolve(root, args, context): Array<UserData>
    {
        return users.find(u => u.id == args.id);
    }
}
```

Here we define a `Resolver` for the `subscribedTo` field of the `User` type
where we define how to load the contents for this field.  
Then we define a top level `Query` field called `user`
that takes one required argument `id`
which we use to try to find the requested data.

In both cases we referenced the GraphQL type definition `UserDef`,
which will be used by `graphql-plugins` to generate the schema.  
It is important to reference all of the type definitions
related to each of our resolvers,
in order to make sure they are all included in the final schema.

Here's how a request to our new GraphQL schema might look like:

```graphql
{
  user(id: 5) {
    id
    name
    subscribedTo {
      id
      name
    }
  }
}
```

Or if you want to make the `id` parameter dynamic:

```graphql
query($id: ID!){
  user(id: $id) {
    id
    name
    subscribedTo {
      id
      name
    }
  }
}
```

We could also exclude the `subscribedTo` field from the query:

```graphql
query($id: ID!){
  user(id: $id) {
    id
    name
  }
}
```

In which case the resolver for the `subscribedTo` field will not execute
and we will avoid executing an unnecessary query.

The examples here are very simplified.
In production you will want to use a data loader
to combine all your queries into one or two,
in order to avoid executing tens or hundreds of queries per request.

## Context

Zox.js does not provide the `context` variable by default.
Instead you are expected to set the function for generating the context from your dev.js script.

```js
container.get(IGraphQLService).contextGenerator = (request) =>
{
    return { /* ... */ };
};
```
