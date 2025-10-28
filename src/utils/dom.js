export function el(tag, props = {}, children = []) {
    const node = document.createElement(tag);

    for (const [k, v] of Object.entries(props)) {
        if (k === "style" && typeof v === "object") Object.assign(node.style, v);
        else if (k === "dataset" && typeof v === "object") Object.assign(node.dataset, v);
        else if (k === "on" && typeof v === "object") {
            for (const [evt, handler] of Object.entries(v)) node.addEventListener(evt, handler);
        } else if (k in node) node[k] = v;
        else node.setAttribute(k, v);
    }

    (Array.isArray(children) ? children : [children]).forEach(c => {
        if (c == null) return;
        node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });

    return node;
}

export function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }
