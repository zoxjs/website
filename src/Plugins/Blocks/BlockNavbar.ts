import {RenderableBlock} from "zox/lib/Renderable/Layout/RenderableBlock";
import {IConfigService} from "zox/lib/Services/ConfigService";
import {Dependency} from "zox/lib/ServiceContainer";
import {Block} from "zox/lib/Plugins/PluginManagers/BlockPluginManager";

@Block({
    name: 'navbar'
})
export class BlockNavbar extends RenderableBlock
{
    @Dependency
    protected config: IConfigService;

    public get siteName(): string
    {
        return this.config.getConfig('site').siteName;
    }
}
