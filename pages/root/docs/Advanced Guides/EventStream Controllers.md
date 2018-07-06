---
title: EventStream Controllers
url: /docs/eventstream-controllers
type: docs
include:
  - docs.sidebar
---

Event streams are simply long running HTTP responses.
This implies that events can only be sent in one direction.

EventStream Controllers simply return `EventStreamResponse`.

```ts
@Route({
    route: '/event/counting'
})
export class CountingEventStream extends Controller
{
    public handle(request: IncomingMessage): IResponse
    {
        console.log('Start counting');
        const eventStream = new EventStreamResponse();
        let i = 0;
        const loop = setInterval(() =>
        {
            const data = { msg: 'Server count: ' + ++i };

            // send the default message event
            eventStream.sendMessage(data);

            // send a custom event
            eventStream.sendMessage(data, 'increment');

            if (i == 10)
            {
                eventStream.close();
            }
        }, 1000);
        eventStream.onClose = () =>
        {
            clearInterval(loop);
            console.log('Counted to: ' + i);
        };
        return eventStream;
    }
}
```

In this example we created a new `EventStreamResponse`
and set an interval for generating events.

Event data can be anything serializable via `JSON.stringify()`.

## Client Side

On the client side you can access the event stream
using the standard EventSource class.

```js
var evtSource = new EventSource('/event/counting');
evtSource.addEventListener('message', e => console.log(e), false); // default event
evtSource.addEventListener('increment', e => console.log(e), false); // custom event
evtSource.onmessage = e => console.log(e); // alternative for default event
evtSource.close();
```

> **Note**  
Some browsers automatically restart the EventSource
if the server closes the connection.  
If you are closing the connection from the server-side
then make sure to notify the client to close the connection as well.