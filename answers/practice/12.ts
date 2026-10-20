interface Task { id: number; title: string; done: boolean }
type Result = { ok: true; value: Task[] } | { ok: false; error: string };
function removeTask(tasks: Task[], id: number): Result {
  if (!tasks.some(task => task.id === id)) return { ok: false, error: "未找到任务" };
  return { ok: true, value: tasks.filter(task => task.id !== id) };
}
const tasks: Task[] = [{id:1,title:"学 JS",done:false},{id:2,title:"写 TS",done:false}];
console.log("删除结果：", removeTask(tasks, 1));
console.log("原列表：", tasks);
