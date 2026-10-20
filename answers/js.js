export function parseMinutes(text) {
  if (typeof text !== "string" || text.trim() === "") throw new Error("请输入分钟数");
  const minutes = Number(text);
  if (!Number.isFinite(minutes) || minutes < 0) throw new Error("分钟数必须是有限的非负数字");
  return minutes;
}

export function makeCounter(start = 0) {
  let count = start;
  return () => {
    count += 1;
    return count;
  };
}

export function pendingTitles(tasks) {
  return tasks.filter(task => !task.done).map(task => task.title);
}

export function completeTask(tasks, id) {
  return tasks.map(task => task.id === id ? { ...task, done: true } : task);
}
