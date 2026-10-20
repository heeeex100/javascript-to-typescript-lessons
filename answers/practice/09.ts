interface Task {
  title: string;
  note?: string;
}
function noteText(task: Task): string {
  return task.note?.trim() || "无备注";
}
console.log(noteText({ title: "写练习" }));
