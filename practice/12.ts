interface Task { id: number; title: string; done: boolean }
type Result = { ok: true; value: Task[] } | { ok: false; error: string };
function removeTask(tasks: Task[], id: number): Result {
  const index = tasks.findIndex(task => task.id === id);
  tasks.splice(index, 1);
  return { ok: true, value: tasks };
}
const tasks: Task[] = [{id:1,title:"学 JS",done:false},{id:2,title:"写 TS",done:false}];
console.log("删除结果：", removeTask(tasks, 1));
console.log("原列表：", tasks);
