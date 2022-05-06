const selectorParser = require("postcss-selector-parser");

function generateScopedName(name) {
    const randomStr = Math.random().toString(16).slice(2);
    return `_${randomStr}__${name}`;
};

const plugin = (options = {}) => {
    return {
        postcssPlugin: "my-postcss-modules-scope",
        Once(root, helpers) {
            const exports = {}

            function exportScopedName(name) {
                const scopedName = generateScopedName(name);

                exports[name] = exports[name] || [];

                if (exports[name].indexOf(scopedName) < 0) {
                    exports[name].push(scopedName);
                }

                return scopedName;
            }

            function localizeNode(node) {
                switch (node.type) {
                    case "class":
                        return selectorParser.className({
                            value: exportScopedName(
                                node.value,
                                node.raws && node.raws.value ? node.raws.value : null
                            ),
                        });
                    case "id": {
                        return selectorParser.id({
                            value: exportScopedName(
                                node.value,
                                node.raws && node.raws.value ? node.raws.value : null
                            ),
                        });
                    }
                    case "selector":
                        node.nodes = node.map(localizeNode);
                        return node;
                }
            }

            function traverseNode(node) {
                switch (node.type) {
                    case "root":
                    case "selector": {
                        node.each(traverseNode);
                        break;
                    }
                    case "id":
                    case "class":
                        exports[node.value] = [node.value];
                        break;
                    case "pseudo":
                        if (node.value === ":local") {
                            const selector = localizeNode(node.first, node.spaces);
            
                            node.replaceWith(selector);
            
                            return;
                        }
                }
                return node;
            }

            root.walkRules(rule => {
                const parsedSelector = selectorParser().astSync(rule)
                rule.selector = traverseNode(parsedSelector.clone()).toString();
            })
        }
    }
}

plugin.postcss = true;

module.exports = plugin;