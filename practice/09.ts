interface Task {
  title: string;
  note?: string;
}
function noteText(task: Task): string {
  return task.note.trim();
}
console.log(noteText({ title: "写练习" }));
