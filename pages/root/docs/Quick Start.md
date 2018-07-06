---
title: Quick start
url: /docs/quick-start
---

This guide will get you started with a fresh web server project
and give you a general idea of how to build web apps!

First lets create a new project.

```bash
mkdir <your-projet-name>
cd <your-projet-name>
npm init -y
npm install web-server
```

The goal of the web-server is to decentralize your code,
so the only thing you should do in your dev.js file is to bootstrap your project
and start the server.

```typescript
import {bootstrap, startServer} from "web-server/bootstrap";

bootstrap().then(container => {
    startServer(container);
    console.log('Started');
});
```

The `bootstrap()` function will load all of your modules
and return the container containing instances of your classes.  
You can use the built-in `startServer` function to start listening
for http and web socket connections.

If you intend to initialize more services, like a database connection,
you can use a much nicer async-await pattern:

```typescript
import {bootstrap, startServer} from "web-server/bootstrap";

(async function start()
{
    const container = await bootstrap();

    startServer(container);

    console.log('Started');
})();
```

Now lets create a simple controller.  
You can put this class anywhere inside of the `Plugins` folder.   
Here's a TypeScript example:

```typescript
import {Route} from "web-server/Route";
import {Controller} from "web-server/Controller";
import {IResponse} from "web-server/Responses/IResponse";
import {StringResponse} from "web-server/Responses/StringResponse";

@Route({
    route: '/'
})
export class MyHome extends Controller
{
    public handle(): IResponse
    {
        return new StringResponse('Hello World');
    }
}
```

Which is equivalent to this JavaScript example:

```js
import {Route} from "web-server/Route";
import {Controller} from "web-server/Controller";
import {StringResponse} from "web-server/Responses/StringResponse";

export class MyHome extends Controller
{
    handle()
    {
        return new StringResponse('Hello World');
    }
}
Route({
    route: '/'
})(MyHome);
```

While you can write your code in vanilla JavaScript in a similar way as TypeScript
we strongly recommend using TypeScript if you can.

All you have to do to get started with TypeScript is install the compiler,
rename your .js and .jsx files to .ts and .tsx and watch for changes:

```
npm i -g typescript
tsc --watch
```

If you are using one of the more popular IDE-s 
it will probably have this functionality either built-in or available as a plugin,
so you might not even need to install or run anything to get started!

Any valid JavaScript is valid TypeScript code,
so you are already qualified to work with TypeScript!
