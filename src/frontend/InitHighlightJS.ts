
export function InitHighlightJS()
{
    const hljs = require('highlight.js/lib/highlight');
    hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'));
    hljs.registerLanguage('typescript', require('highlight.js/lib/languages/typescript'));
    hljs.registerLanguage('handlebars', require('highlight.js/lib/languages/handlebars'));
    hljs.registerLanguage('xml', require('highlight.js/lib/languages/xml'));
    hljs.registerLanguage('json', require('highlight.js/lib/languages/json'));
    hljs.registerLanguage('yaml', require('highlight.js/lib/languages/yaml'));
    hljs.initHighlightingOnLoad();
}
