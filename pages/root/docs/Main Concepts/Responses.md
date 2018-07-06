---
title: Responses
url: /docs/responses
type: docs
include:
  - docs.sidebar
---

The role of a response is to send it's contents to the client.

The contents of a response can either be set through
the constructor or by setting the properties on the response object.

All responses have a `statusCode` and `headers` properties.
The default statusCode for all responses is 200 ( OK ),
while each response has it's own default headers.

## Built-in Response Classes

`StringResponse` will send a string as the response body.

`RenderResponse` will render the element before sending it.

`JsonResponse` will use **JSON.stringify** to serialize the response before sending it.

`EmptyResponse` will only send the provided headers without a body.

`RedirectResponse` will send a 303 response with the location header and no body.  
The client will access this location using a GET request.  
Usually used by form controllers which handle data, but don't display a page.

`EventStreamResponse` is a special case where we can write the messages (events) into the response body.
If a controller sends messages before returning this response the messages will be queued.
