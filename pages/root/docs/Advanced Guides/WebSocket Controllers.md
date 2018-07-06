---
title: WebSocket Controllers
url: /docs/websocket-controllers
type: docs
include:
  - docs.sidebar
---

When you need real-time communication with the server
or an even feed the best way to achieve this is via web sockets.

Web socket routes work exactly the same as normal routes,
meaning that you can use dynamic routes `/path/:param`
and read the query parameters.

```ts
@WebSocketRoute('/path')
export class MyWebSocket extends WebSocketController
{
    protected init(): void
    {
        console.log('Web socket connection');
        this.send('Hello');
    }

    protected onMessage(data: WebSocket.Data): void
    {
        console.log('Web socket message');
        this.send('Ok: ' + data);
    }
}
```

The `init()` method is called when the web socket connection is established.

The `onMessage()` method is called when a message is received
and it's parameter is either a string, Buffer of Buffer[]
depending on the type of data the client sent.

The HTTP request is available as the `request` property.

The web socket connection is available as the `ws` property,
but you should use the `send()` helper method
instead of writing to the web socket directly.

## Client Side

On the client side you can access the web socket endpoint
using the standard WebSocket class.

```js
var sock = new WebSocket("ws://localhost:8080/path");
sock.addEventListener('message', e => console.log(e));
sock.send('Hello World');
sock.close();
```

To use auto-reconnect features and the accompanying events
you can simply switch to our `WebSocketEx` class.

```js
var sock = new WebSocketEx("ws://localhost:8080/path");
sock.addEventListener('message', e => console.log(e));
sock.send('Hello World');
sock.close();
```
