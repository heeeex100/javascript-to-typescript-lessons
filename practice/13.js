function queryTasks(tasks, options) {
  // TODO：搜索、状态筛选、排序、分页；不要修改 tasks。
  return { total: tasks.length, items: tasks.slice(0, options.pageSize) };
}
const tasks = [
  { id: 1, title: "JS 数组", done: false, priority: 2 },
  { id: 2, title: "js 异步", done: false, priority: 3 },
  { id: 3, title: "TS 泛型", done: true, priority: 1 },
];
console.log(queryTasks(tasks, { keyword: "js", status: "pending", page: 1, pageSize: 1 }));
