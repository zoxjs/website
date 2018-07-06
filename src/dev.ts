import {bootstrap, startServer} from "zox";

bootstrap({
    config: {
        defaultsPath: 'config/default',
        overridesPath: 'config/dev',
    },
    projectPlugins: true,
    node_modules: true,
    staticPages: true,
}).then(container =>
{
    startServer(container);
    console.log('Started at localhost:8080');
});
