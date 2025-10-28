import { el } from "../utils/dom.js";

const labels = {
    users: "Пользователи",
    todos: "Тодос",
    posts: "Посты",
    comments: "Комменты"
};

export function renderBreadcrumbs(root, hash) {
    const parts = (hash || "#users").split("#").filter(Boolean);
    const nav = el("div", { className: "breadcrumbs card" });


    if (parts.length === 0) parts.push("users");

    parts.forEach((part, idx) => {
        const href = "#" + parts.slice(0, idx + 1).join("#");
        nav.appendChild(el("a", { href }, labels[part] || part));
        if (idx < parts.length - 1) nav.appendChild(document.createTextNode(" / "));
    });

    root.appendChild(nav);
}
