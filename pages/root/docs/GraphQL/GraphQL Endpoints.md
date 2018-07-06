---
title: GraphQL Endpoints
url: /docs/graphql-endpoints
type: docs
include:
  - docs.sidebar
---

Zox.js will assemble all of our type definitions and resolvers
and make the schema available over several endpoints.

## POST request

The most common way of accessing the schema
is by sending a `POST` request to `/graphql`
with the body containing a JSON body of this format:

```json
{
  "query": "query($id:ID!){user(id:$id){id,name}}",
  "variables": {
    "id": 5
  }
}
```

It's also possible to hard code values into the query:

```json
{
  "query": "{user(id:5){id,name}}"
}
```

> Node: Both Queries and Mutations are passed in the `query` field

## GET request

This endpoint was made available primarily for testing purposes.  
It allows you to share url's containing the entire queries:

```http
http://localhost:8080/graphql?query={user(id:5){id,name}}
```

Using dynamic variables is less practical in this case, but still possible:

```http
http://localhost:8080/graphql?query=query($id:ID!){user(id:$id){id,name}}&variables={id:5}
```

## Predefined queries and mutations

A notable part of query execution time is spent in
parsing the query string and validating it against our schema.

We could try normalizing and caching the query string after parsing it,
but a malicious user can send nearly infinite number of
variations of the same query string,
which makes this quite a complicated task.  
But a small number of wasted CPU cycles and a minuscule RAM allocation
is the least of our worries.

The real hassle is handling large queries, especially if they contain recursive fields.

Take this query for example:

```json
{
  user(id: 1) {
    biography
    friends {
      biography
      friends {
        biography
        friends {
          biography
          friends {
            biography
          }
        }
      }
    }
  }
}
```

A malicious user would force us to load a huge amount of data from the database
and potentially send a response gigabytes in size,
not just that but we would probably make a huge number of
recursive database queries and probably run out of RAM in the process.

Common way of solving this problem is limiting the number of recursive calls.  
But this is rarely enough since even a few recursive fields
in a malicious request are enough to use up all of our RAM
with a relatively small number of request.
Plus we can't make a too low limit without falsely flagging legitimate requests.

More advanced solutions involve handling this on a per field basis,
but this is often time consuming to setup, configure and maintain,
which makes it unsuitable for smaller teams and start-ups.

#### Enter predefined queries

Predefined queries are stored on the server-side,
which allows us to load and validate them once at startup.
The clients can then reference them by id.

If you are developing a backend api for your own website frontend
then **you should definitely define all your queries on the server-side**
and make sure to disable the regular graphql endpoints.  
And even if you are developing a public api
you should still first consider crating a large variety of similar queries
rather than allow users to submit custom queries.

The query definition files are by default located in the `/src/graphql` directory.
This directory is configurable in `graphql` config file.  
The query id is the file name.
If the file name has the `.graphql` extension
then the extension is excluded from the query id.

It is recommended to split the Query, Mutation and Subscription definitions
into separate sub-directories with matching names.

You should put variations of the same query inside the same file,
rather than creating multiple files.

Here's an example file:

`/src/graphql/users.graphql`

```json
query all {
  users {
    id
    name
  }
}
```

The name `all` in this context is called the operation name.  
You can then execute this query by calling:

```http
http://localhost:8080/gql/users/all
```

Since this is the only query in this file you could just call:

```http
http://localhost:8080/gql/users
```

> **Note**  
If you did not specify the operation name, but your file has multiple operations
then if there is an operation called default it is executed,
or if not then the first operation i executed.

If your query accepts variables you can either use a POST request
with the variables as a JSON string in the body.
Or use a GET request with the variables in the url:

```http
http://localhost:8080/gql/user/userById?v={id:5}
```
