const form = document.querySelector("#task-form");
const input = document.querySelector("#title");
const list = document.querySelector("#tasks");
const message = document.querySelector("#message");
const remaining = document.querySelector("#remaining");
let nextId = 2;
let tasks = [{ id: 1, title: "运行第一个 JavaScript 程序", done: false }];

function render() {
  // TODO 1：根据 tasks 更新未完成数量。
  list.replaceChildren();
  for (const task of tasks) {
    const item = document.createElement("li");
    const title = document.createElement("span");
    title.textContent = task.title;
    if (task.done) title.classList.add("done");
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = task.done ? "已完成" : "完成";
    button.disabled = task.done;
    button.addEventListener("click", () => {
      // TODO 2：把这项任务标为完成。
      message.textContent = `已完成：${task.title}`;
      render();
    });
    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "删除";
    remove.addEventListener("click", () => {
      // TODO 3：从任务数组中删除这一项。
      message.textContent = `已删除：${task.title}`;
      render();
    });
    item.append(title, button, remove);
    list.append(item);
  }
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const title = input.value.trim();
  if (!title) {
    message.textContent = "请先输入任务标题";
    return;
  }
  // TODO 4：往任务数组增加新任务，id 用 nextId++。
  input.value = "";
  message.textContent = `已添加：${title}`;
  render();
  input.focus();
});
render();
