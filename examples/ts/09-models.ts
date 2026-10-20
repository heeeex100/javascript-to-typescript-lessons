interface Task {
  readonly id: number;
  title: string;
  done: boolean;
  note?: string;
}
function showTitle(value: { title: string }): string {
  return value.title;
}
function findTask(tasks: readonly Task[], id: number): Task | undefined {
  return tasks.find(task => task.id === id);
}
const task: Task = { id: 1, title: "学习接口", done: false };
console.log("标题：", showTitle(task));
console.log("备注：", task.note?.trim() ?? "无备注");
console.log("查找：", findTask([task], 2)?.title ?? "未找到");
export {};
