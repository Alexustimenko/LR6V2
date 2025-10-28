import { el, clear } from "../utils/dom.js";
import { debounce } from "../utils/helpers.js";
import { fetchTodos, addLocalTodo, fetchUsers } from "../utils/api.js";

export async function renderTodos(root) {
    const card = el("div", { className: "card" });
    card.appendChild(el("h2", { style: "margin:0 0 8px" }, "Todos"));

    const search = el("input", { type: "text", placeholder: "Поиск по title…" });

    const userSelect = el("select", { name: "user" }, [el("option", { value: "" }, "Выберите пользователя")]);
    const todoInput = el("input", { type: "text", placeholder: "Новый todo: title" });
    const addBtn = el("button", {}, "Добавить todo");
    const form = el("div", { className: "toolbar" }, [search, userSelect, todoInput, addBtn]);

    card.appendChild(form);
    const info = el("div", { className: "alert info", style: "display:none" });
    card.appendChild(info);

    const list = el("div", { className: "grid" });
    card.appendChild(list);
    root.appendChild(card);

    let todos = [];
    let users = [];
    try {
        [todos, users] = await Promise.all([fetchTodos(), fetchUsers()]);
    } catch (e) {
        info.style.display = "block";
        info.className = "alert err";
        info.textContent = "Ошибка загрузки данных.";
    }

    users.forEach(u => userSelect.appendChild(el("option", { value: u.id }, `${u.name} (${u.email})`)));

    render(todos);

    search.addEventListener(
        "input",
        debounce(() => {
            const q = search.value.trim().toLowerCase();
            const filtered = q ? todos.filter(t => t.title.toLowerCase().includes(q)) : todos;
            render(filtered);
        }, 300)
    );

    addBtn.addEventListener("click", () => {
        const userId = userSelect.value;
        const title = todoInput.value.trim();
        if (!userId || !title) return;

        const created = addLocalTodo({ userId, title });
        todos.push(created);
        render(todos);

        todoInput.value = "";
        info.style.display = "block";
        info.className = "alert ok";
        info.textContent = `Todo добавлен пользователю #${userId}.`;
    });

    function render(data) {
        clear(list);
        if (!data.length) {
            list.appendChild(el("div", { className: "muted" }, "Ничего не найдено"));
            return;
        }
        data.forEach(t => list.appendChild(todoCard(t)));
    }

    function todoCard(t) {
        return el("div", { className: "item" }, [
            el("h4", {}, t.title),
            el("p", { className: "muted" }, `userId: ${t.userId}`),
            el("div", { className: "flex" }, [
                el("span", { className: "badge" }, t.completed ? "completed" : "open"),
                t._local ? el("span", { className: "badge" }, "local") : null
            ])
        ]);
    }
}
