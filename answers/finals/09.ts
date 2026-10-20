interface Task { readonly id: number; title: string; note?: string }
function formatTask(task: Task): string {
  const note=task.note?.trim() || "无备注";
  return `${task.id} · ${task.title.trim()}：${note}`;
}
console.log(formatTask({id:1,title:" 写练习 "}));
