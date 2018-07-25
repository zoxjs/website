---
title: Environment Bootstrapping
url: /docs/environment-bootstrapping
type: docs
include:
  - docs.sidebar
---

Zox.js is based on plugins and services,
with the goal to decentralize our code.
This requires us to load all of our plugins and setup all of our services
before we can start our app.

The built-in `bootstrap()` function should be sufficient for most use cases.  
Here's how you can use it in your dev.js file:

```typescript
import {bootstrap, startServer} from "zox";

bootstrap().then(container =>
{
    startServer(container, /* port: */ 8080);
    console.log('Started');
});
```

Or using async-await:

```typescript
import {bootstrap, startServer} from "zox";

(async function start()
{
    const container = await bootstrap();

    startServer(container, /* port: */ 8080);

    console.log('Started');
})();
```

If you however want to customize your environment here's how you can do it.

First define your bootstrap function and it's options.

```ts
export type BootstrapOptions = {
    configBasePath?: string
}

export async function bootstrap(options?: BootstrapOptions): Promise<ServiceContainer>
{
    options = options || {};
    options.configBasePath = options.configBasePath || 'config';
    
    const pluginDiscovery = new PluginDiscovery(); // required for loading plugins
    
    const container = new ServiceContainer(); // required for dependency injection
    container.registerAs(IPluginDiscoveryService, pluginDiscovery);
    
    // ...
    
    return container;
}
```

Then define how your plugins are loaded.

```js
await pluginDiscovery.scanProject(); // default method
await pluginDiscovery.scanDirectory('src/Plugins'); // hardcoded plugins directory path
```

Now you will need to register your services.

Since the config service has required parameters we will have to set it up separately.

```js
container.registerUnresolved(new ConfigService(options.configBasePath));
```

All other services should instead be able to get their options from the config service,
so we can load all of them in a single line of code.

```js
container.create(ServicePluginManager).registerServices(true);
```

The `true` parameter here indicates that
we should resolve all of our services right away,
instead of delaying their setup until the first time they are required,
which would be on first page load.