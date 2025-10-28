import { initRouter } from "./utils/router.js";

const root = document.getElementById("root");

function mountApp() {
    root.innerHTML = `
    <div class="container">
      <div class="header">
        <h1 style="margin:0;font-size:22px;"> Tandem </h1>
        <span class="badge">vanilla JS</span>
        <div class="right">
          <a class="muted" href="#users">Пользователи</a>
          <span class="muted"> · </span>
          <a class="muted" href="#users#todos">Тодос</a>
          <span class="muted"> · </span>
          <a class="muted" href="#users#posts">Посты</a>
          <span class="muted"> · </span>
          <a class="muted" href="#users#posts#comments">Комменты</a>
        </div>
      </div>
      <div id="breadcrumbs"></div>
      <div id="page"></div>
    </div>
  `;
}

mountApp();
initRouter(document.getElementById("page"), document.getElementById("breadcrumbs"));

if (!location.hash) location.hash = "#users";
