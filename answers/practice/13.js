function queryTasks(tasks, options) {
  if (!["all", "pending", "done"].includes(options.status)
      || !Number.isSafeInteger(options.page) || options.page < 1
      || !Number.isSafeInteger(options.pageSize) || options.pageSize < 1) {
    throw new Error("筛选或分页参数不合法");
  }
  const keyword = options.keyword.trim().toLowerCase();
  const filtered = tasks.filter(task => task.title.toLowerCase().includes(keyword)
    && (options.status === "all" || task.done === (options.status === "done")));
  const sorted = [...filtered].sort((a, b) => b.priority - a.priority || a.id - b.id);
  const start = (options.page - 1) * options.pageSize;
  return { total: sorted.length, items: sorted.slice(start, start + options.pageSize) };
}
const tasks = [
  { id: 1, title: "JS 数组", done: false, priority: 2 },
  { id: 2, title: "js 异步", done: false, priority: 3 },
  { id: 3, title: "TS 泛型", done: true, priority: 1 },
];
console.log(queryTasks(tasks, { keyword: "js", status: "pending", page: 1, pageSize: 1 }));
