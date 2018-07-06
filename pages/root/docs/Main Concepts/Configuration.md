---
title: Configuration
url: /docs/config
type: docs
include:
  - docs.sidebar
---

To avoid hard coding paths and options in our services can use the `ConfigService`
to instead load them from **.yaml** ( **.yml** ) or **.json** files.

By default the configuration files are located in the `config` directory
and you are recommended to create the config file for each service that requires it
even if you are going to use the default options.

If a config file does not exist an empty object will be used
and services are expected to fallback to their defaults.

If you need access to the config service you can create a dependency like this:

```ts
export class MyClass
{
    @Dependency
    private config: IConfiService
}
```

Then you can read any config file like this:

```js
this.config.getConfig('my.service');
```

This will look for files like:  
`my.service.yaml`  
`my.service.yml`  
`my.service.json`

In cases you are developing a serias of related services
you can use sub directories for your config files.

```js
this.config.getConfig('my.system/first.service');
```

There is a special function for loading the global config.

```js
this.config.getGlobalConfig();
```

It's used for enabling development options and it's defaults are:

```yaml
cache: true
watch: false
debug: false
```
