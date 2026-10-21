export function saveTasks(tasks) { return JSON.stringify(tasks); }
export function loadTasks(text) {
  try {
    const value = JSON.parse(text);
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}
