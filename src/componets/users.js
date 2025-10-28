import { el, clear } from "../utils/dom.js";
import { debounce } from "../utils/helpers.js";
import { fetchUsers, addLocalUser, deleteLocalUser } from "../utils/api.js";

export async function renderUsers(root) {
  const wrap = el("div", { className: "card" });
  wrap.appendChild(el("h2", { style: "margin:0 0 8px" }, "Пользователи"));

  // toolbar: поиск + форма создания
  const search = el("input", { type: "text", placeholder: "Поиск по имени или email…" });

  const form = el("form", { className: "inline", on: { submit: onCreate } }, [
    el("input", { type: "text", placeholder: "Имя", name: "name", required: true }),
    el("input", { type: "text", placeholder: "Email", name: "email", required: true }),
    el("input", { type: "text", placeholder: "Username (опц.)", name: "username" }),
    el("button", { type: "submit" }, "Добавить пользователя")
  ]);

  wrap.appendChild(el("div", { className: "toolbar" }, [search, form]));
  const info = el("div", { className: "alert info", style: "display:none" });
  wrap.appendChild(info);

  const list = el("div", { className: "grid" });
  wrap.appendChild(list);

  root.appendChild(wrap);

  let users = [];
  try {
    users = await fetchUsers();
  } catch (e) {
    info.style.display = "block";
    info.className = "alert err";
    info.textContent = "Ошибка загрузки пользователей.";
  }

  render(users);

  // поиск с дебаунсом
  search.addEventListener(
    "input",
    debounce(() => {
      const q = search.value.trim().toLowerCase();
      const filtered = q
        ? users.filter(u =>
            u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
          )
        : users;
      render(filtered);
    }, 300)
  );

  function render(data) {
    clear(list);
    if (!data.length) {
      list.appendChild(el("div", { className: "muted" }, "Ничего не найдено"));
      return;
    }
    data.forEach(u => list.appendChild(userCard(u)));
  }

  function userCard(u) {
    return el("div", { className: "item" }, [
      el("h4", {}, u.name),
      el("p", {}, `Email: ${u.email}`),
      el("div", { className: "flex" }, [
        el("span", { className: "badge" }, u.username),
        u._local
          ? el("span", { className: "badge" }, "local")
          : el("span", { className: "badge" }, `id: ${u.id}`),
        el("span", { className: "right" }),
        el("a", { className: "secondary", href: "#users#todos" }, "Todos"),
        el("a", { className: "secondary", href: "#users#posts", style: "margin-left:6px" }, "Посты"),
        u._local
          ? el(
              "button",
              {
                className: "danger",
                style: "margin-left:8px",
                on: {
                  click: () => {
                    if (confirm(`Удалить локального пользователя "${u.name}"?`)) {
                      deleteLocalUser(u.id);
                      users = users.filter(x => x.id !== u.id);
                      render(users);
                    }
                  }
                }
              },
              "Удалить"
            )
          : null
      ])
    ]);
  }

  function onCreate(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = (fd.get("name") || "").toString().trim();
    const email = (fd.get("email") || "").toString().trim();
    const username = (fd.get("username") || "").toString().trim();

    if (!name || !email) return;

    const created = addLocalUser({ name, email, username });
    users.push(created);
    render(users);

    e.currentTarget.reset();
    info.style.display = "block";
    info.className = "alert ok";
    info.textContent = `Пользователь "${created.name}" создан локально.`;
  }
}
