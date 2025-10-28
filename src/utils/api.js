import { storage } from "./storage.js";


const LS_USERS = "users";
const LS_TODOS = "todos";

async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}


export async function fetchUsers() {
  const remote = await getJSON("https://jsonplaceholder.typicode.com/users");
  const local = storage.get(LS_USERS, []);
  return [...remote, ...local]; 
}

export function addLocalUser({ name, email, username }) {
  const users = storage.get(LS_USERS, []);
  const newUser = {
    id: 10000 + users.length, 
    name,
    email,
    username: username || name.split(" ")[0],
    _local: true
  };
  users.push(newUser);
  storage.set(LS_USERS, users);
  return newUser;
}

export function deleteLocalUser(id) {
  const users = storage.get(LS_USERS, []);
  const next = users.filter(u => u.id !== id);
  storage.set(LS_USERS, next);
}


export async function fetchTodos() {
  const remote = await getJSON("https://jsonplaceholder.typicode.com/todos");
  const local = storage.get(LS_TODOS, []);
  return [...remote, ...local];
}

export function addLocalTodo({ userId, title }) {
  const todos = storage.get(LS_TODOS, []);
  const todo = {
    userId: Number(userId),
    id: 200000 + todos.length,
    title,
    completed: false,
    _local: true
  };
  todos.push(todo);
  storage.set(LS_TODOS, todos);
  return todo;
}


export async function fetchPosts() {
  return getJSON("https://jsonplaceholder.typicode.com/posts");
}
export async function fetchComments() {
  return getJSON("https://jsonplaceholder.typicode.com/comments");
}
