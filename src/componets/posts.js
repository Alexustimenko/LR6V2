import { el, clear } from "../utils/dom.js";
import { debounce } from "../utils/helpers.js";
import { fetchPosts } from "../utils/api.js";

export async function renderPosts(root) {
  const card = el("div", { className: "card" });
  card.appendChild(el("h2", { style: "margin:0 0 8px" }, "Посты"));

  const search = el("input", { type: "text", placeholder: "Поиск в title/body…" });
  card.appendChild(el("div", { className: "toolbar" }, [search]));

  const info = el("div", { className: "alert info", style: "display:none" });
  card.appendChild(info);

  const list = el("div", { className: "grid" });
  card.appendChild(list);
  root.appendChild(card);

  let posts = [];
  try {
    posts = await fetchPosts();
  } catch (e) {
    info.style.display = "block";
    info.className = "alert err";
    info.textContent = "Ошибка загрузки постов.";
  }

  render(posts);

  search.addEventListener(
    "input",
    debounce(() => {
      const q = search.value.trim().toLowerCase();
      const filtered = q
        ? posts.filter(p => p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q))
        : posts;
      render(filtered);
    }, 300)
  );

  function render(data) {
    clear(list);
    if (!data.length) {
      list.appendChild(el("div", { className: "muted" }, "Ничего не найдено"));
      return;
    }
    data.forEach(p => list.appendChild(postCard(p)));
  }

  function postCard(p) {
    return el("div", { className: "item" }, [
      el("h4", {}, p.title),
      el("p", {}, p.body),
      el("div", { className: "flex" }, [
        el("span", { className: "badge" }, `id: ${p.id}`),
        el("a", { className: "right secondary", href: "#users#posts#comments" }, "Комменты")
      ])
    ]);
  }
}
