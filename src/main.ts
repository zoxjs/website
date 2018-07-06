import {bootstrap, startServer} from "zox";

const options = {
    node_modules: true,
    staticPages: true,
};

bootstrap(options).then(container =>
{
    startServer(container);
    console.log('Started');
});
