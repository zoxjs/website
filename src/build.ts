import {bootstrap} from "zox";
import {IStaticExportService} from "zox/lib/Plugins/Services/StaticExportService";

async function start()
{
    const container = await bootstrap({
        config: {
            defaultsPath: 'config/default',
        },
        projectPlugins: true,
        node_modules: true,
        staticPages: true,
    });
    const staticExport = container.get(IStaticExportService);
    console.log('Exporting Static Site...');
    const pages = await staticExport.getPages('/');
    await staticExport.savePages('../www', pages);
    process.exit(0);
}

start().catch(err => console.error(err));
