import {bootstrap, startServer} from "zox";

bootstrap({
    config: {
        defaultsPath: 'config/default',
        overridesPath: 'config/static',
    },
    node_modules: true,
}).then(container =>
{
    startServer(container);
    console.log('Started at localhost:8080');
});
