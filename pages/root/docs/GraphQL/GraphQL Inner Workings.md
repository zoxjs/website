---
title: GraphQL Inner Workings
url: /docs/graphql-inner-workings
type: docs
include:
  - docs.sidebar
---

In the early versions of `graphql-js` you had to define your schema in code.

Even in this minimal example we had to write a lot of code:

```javascript
const User = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        name: {
            type: new GraphQLNonNull(GraphQLString)
        },
        friends: {
            type: new GraphQLNonNull(new GraphQLList(User)),
            resolve(thisUser, args, context, info)
            {
                return usersDatabaseTable.filter(u => thisUser.friends.indexOf(u.id) >= 0);
            }
        }
    })
});
```

## Enter schema definitions

```ts
type User {
  id: ID!
  name: String!
  friends: [User]!
}
```

We just saved ourselves a lot of typing!  
But more importantly our schema is now readable and maintainable,
and we are avoiding the common JavaScript problem of resolving circular references.

We can now simply concatenate all of out type definitions
and build the `GraphQLObjectType` objects that we previously wrote in JavaScript.

```javascript
import {buildSchema} from "graphql";

const schema = buildSchema(typeDefs);
```

Now we will have a schema that we can execute, well almost.
We still need to assign that `resolver` function for the `friends` field,
which we can not do in the type definition file.

We will have to assign all of our resolvers retroactively,
so lets first go ahead and define them.

```javascript
const resolvers = {
    User: {
        friends: (thisUser, args, context, info) =>
        {
            return usersDatabaseTable.filter(
                user => thisUser.friends.indexOf(user.id) >= 0
            );
        }
    }
};
```

Now we will just have to assign those to our types,
luckily there is a helper function for this!

```javascript
import {buildSchema} from "graphql";
import {assignResolvers} from "graphql-plugins";

const schema = buildSchema(typeDefs);
assignResolvers(schema, resolvers);
```

To simplify this let's just write:

```javascript
import {makeSchema} from "graphql-plugins";

const schema = makeSchema(typeDefs, resolvers);
```

And we got our first valid GraphQL type!

But the client can not access it just yet,
lets see how we can accomplish that.

## Top Level Types

GraphQL defines 3 Top Level Types:
- Query: for accessing data
- Mutation: for modifying data
- Subscription: for establishing an event stream, usually over a web socket

Since the client can only access data from the Query type
lets make our users available as as field on the Query type.

Our typeDefs should now look like this:

```ts
type User {
  id: ID!
  name: String!
  friends: [User]!
}
type Query {
  users(limit: Int = 20): [User]!
}
```

And our resolvers should look like this:

```javascript
const resolvers = {
    User: {
        friends: (thisUser, args, context, info) =>
        {
            return usersDatabaseTable.filter(
                user => thisUser.friends.indexOf(user.id) >= 0
            );
        }
    },
    Query: {
        users: (root, args, context, info) =>
        {
            return usersDatabaseTable.limit(args.limit);
        }
    }
};
```

Here we defined a field `users` with an argument `limit`
which the client can use to limit how many users to load from the database.

We can now execute some queries:

```javascript
import {graphql} from "graphql";

const query = `{
  users(limit: 5) {
    id
    name
    friends {
      id
      name
    }
  }
}`;

graphql(schema, query);
```

And this is what the `graphql-plugins` is built upon.  
Hopefully you now understand the inner working of GraphQL.
