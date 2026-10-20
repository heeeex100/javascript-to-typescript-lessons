export function pendingTitles(tasks) {
  return tasks.filter(task => !task.done).map(task => task.title);
}
