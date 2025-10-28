import { renderUsers } from "../components/users.js";
import { renderTodos } from "../components/todos.js";
import { renderPosts } from "../components/posts.js";
import { renderComments } from "../components/comments.js";
import { renderBreadcrumbs } from "../components/breadcrumbs.js";
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
