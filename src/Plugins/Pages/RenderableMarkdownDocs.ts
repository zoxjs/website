import {RenderableStaticPage} from "zox/lib/Renderable/Content/RenderableStaticPage";
import {pageNameKey, StaticPageData, StaticPageType} from "zox/lib/OptionalPlugins/StaticPages/StaticPageManager";

export type SidebarLinkGroups = Array<SidebarLinkGroup>;

export type SidebarLinkGroup = {
    title: string
    links: Array<Link>
}

export type Link = {
    url: string
    title: string
}

@StaticPageType('docs')
export class RenderableMarkdownDocs extends RenderableStaticPage
{
    public readonly sidebarLinkGroups: SidebarLinkGroups;
    public readonly prevPage: Link;
    public readonly nextPage: Link;

    constructor(data: StaticPageData)
    {
        super(data);
        let prev: Link = undefined;
        let foundThisLink = false;
        if (this.sidebarLinkGroups)
        {
            for (const group of this.sidebarLinkGroups)
            {
                for (const link of group.links)
                {
                    if (foundThisLink && !this.nextPage)
                    {
                        this.nextPage = link;
                        break;
                    }
                    if (!foundThisLink && this.url == link.url)
                    {
                        this.prevPage = prev;
                        foundThisLink = true;
                    }
                    prev = link;
                }
                if (foundThisLink && this.nextPage)
                {
                    break;
                }
            }
        }
    }

    public templateCandidates()
    {
        return ['docs', 'docs-' + this[pageNameKey]];
    }
}
