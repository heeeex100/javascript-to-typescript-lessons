interface Task { readonly id: number; title: string; note?: string }
function formatTask(task: Task): string {
  // TODO：规范化文字，拼完整任务卡。
  return "";
}
console.log(formatTask({id:1,title:" 写练习 "}));
