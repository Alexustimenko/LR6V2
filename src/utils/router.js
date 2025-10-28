import { renderUsers } from "../componets/users";
import { renderTodos } from "../componets/todos";
import { renderPosts } from "../componets/posts";
import { renderComments } from "../componets/comments";
import { renderBreadcrumbs } from "../componets/breadcrumps";
import { clear } from "./dom.js";

const ROUTES = {
    "#users": renderUsers,
    "#users#todos": renderTodos,
    "#users#posts": renderPosts,
    "#users#posts#comments": renderComments
};

export function initRouter(pageRoot, bcRoot) {
    const go = () => {
        const hash = location.hash || "#users";
        clear(bcRoot);
        renderBreadcrumbs(bcRoot, hash);

        clear(pageRoot);
        const render = ROUTES[hash];
        if (render) render(pageRoot);
        else pageRoot.append("404: unknown route");
    };

    window.addEventListener("hashchange", go);
    go();
}
