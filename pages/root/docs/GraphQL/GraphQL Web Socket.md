---
title: GraphQL Web Socket
url: /docs/graphql-web-socket
type: docs
include:
  - docs.sidebar
---

The most efficient way to access a GraphQL server is over a web socket.
That's why zox.js features a back-end web socket controller
and a front-end utility class that can communicate with it,
both of which are called `GraphQLWebSocket`.

We can establish a web socket connection by instantiating the GraphQLWebSocket on the front-end.  

```js
const gql = new GraphQLWebSocket();
```

The default web socket endpoint is `ws://${location.host}/graphql`,
but if our graphql server is on a different route or a different domain
we can pass the uri as the first parameter.

The `GraphQLWebSocket` client uses the `WebSocketEx` class
which allows us to automatically reconnect if the connection is lost.
This can be disabled by passing false as the second argument to `GraphQLWebSocket`.

Before using the connection we should either check `if (gql.readyState == WebSocket.OPEN)`
or set a task to be executed once it is open:

```js
gql.promiseOnOpen.then(() =>
{
    // use gql ...
});
```

We can use this connection to execute a query by calling:

```js
// using a predefined query by it's id and operation name
const args = { id: 'posts', op: 'all', vars: {} };

// using a custom query
const argsRaw = { raw: '{ id, text, ... }', vars: {} };

gql.query(args, handleResult, onDisconnected); // send the query
gql.queryAsync(args); // promisified version
```

We can also use it to subscribe to events:  
_the arguments are the same as when sending a normal query_

```js
const sid = gql.subscribe(args, handleEvent, onDisconnected);
gql.unsubscribe(sid);
```
