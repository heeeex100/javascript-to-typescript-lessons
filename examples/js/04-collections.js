const tasks = [
  { id: 1, title: "学习 JS", done: false },
  { id: 2, title: "完成练习", done: true },
];
const pendingTitles = tasks.filter(task => !task.done).map(task => task.title);
console.log("待办：", pendingTitles);
console.log("未找到：", tasks.find(task => task.id === 999)?.title ?? "未找到");
const updated = tasks.map(task => task.id === 1 ? { ...task, done: true } : task);
console.log("原任务状态：", tasks[0].done);
console.log("新任务状态：", updated[0].done);
console.log("已完成数量：", updated.reduce((sum, task) => sum + (task.done ? 1 : 0), 0));
const a = { meta: { minutes: 20 } };
const b = { ...a };
b.meta.minutes = 30;
console.log("浅拷贝共享嵌套对象：", a.meta.minutes);
