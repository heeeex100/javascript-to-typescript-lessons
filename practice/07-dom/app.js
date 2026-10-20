const form = document.querySelector("#task-form");
const input = document.querySelector("#title");
const list = document.querySelector("#tasks");
const message = document.querySelector("#message");
const remaining = document.querySelector("#remaining");
let nextId = 2;
let tasks = [{ id: 1, title: "运行第一个 JavaScript 程序", done: false }];

function render() {
  // TODO：在这里更新 remaining.textContent，让剩余任务数跟随数组变化。
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
      tasks = tasks.map(current => current.id === task.id ? { ...current, done: true } : current);
      message.textContent = `已完成：${task.title}`;
      render();
    });
    item.append(title, button);
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
  tasks = [...tasks, { id: nextId++, title, done: false }];
  input.value = "";
  message.textContent = `已添加：${title}`;
  render();
  input.focus();
});
render();
