import { el, clear } from "../utils/dom.js";
import { debounce } from "../utils/helpers.js";
import { fetchComments } from "../utils/api.js";

export async function renderComments(root) {
    const card = el("div", { className: "card" });
    card.appendChild(el("h2", { style: "margin:0 0 8px" }, "Комменты"));

    const search = el("input", { type: "text", placeholder: "Поиск по name/body…" });
    card.appendChild(el("div", { className: "toolbar" }, [search]));

    const info = el("div", { className: "alert info", style: "display:none" });
    card.appendChild(info);

    const list = el("div", { className: "grid" });
    card.appendChild(list);
    root.appendChild(card);

    let comments = [];
    try {
        comments = await fetchComments();
    } catch (e) {
        info.style.display = "block";
        info.className = "alert err";
        info.textContent = "Ошибка загрузки комментариев.";
    }

    render(comments);

    search.addEventListener(
        "input",
        debounce(() => {
            const q = search.value.trim().toLowerCase();
            const filtered = q
                ? comments.filter(c => c.name.toLowerCase().includes(q) || c.body.toLowerCase().includes(q))
                : comments;
            render(filtered);
        }, 300)
    );

    function render(data) {
        clear(list);
        if (!data.length) {
            list.appendChild(el("div", { className: "muted" }, "Ничего не найдено"));
            return;
        }
        data.forEach(c => list.appendChild(commentCard(c)));
    }

    function commentCard(c) {
        return el("div", { className: "item" }, [
            el("h4", {}, c.name),
            el("p", {}, c.body),
            el("div", { className: "flex" }, [
                el("span", { className: "badge" }, `postId: ${c.postId}`),
                el("span", { className: "badge" }, c.email)
            ])
        ]);
    }
}
