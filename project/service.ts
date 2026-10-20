import type { Result, Task } from "./models.js";

// 约定：传入的 tasks 已由 parseTasks 或本模块构建，满足有效 id、标题等规则。
export function addTask(tasks: readonly Task[], title: string): Result<Task[]> {
  const normalized = title.trim();
  if (!normalized) return { ok: false, error: "标题不能为空" };
  const id = tasks.reduce((max, task) => Math.max(max, task.id), 0) + 1;
  if (!Number.isSafeInteger(id)) return { ok: false, error: "任务 id 已超出安全整数范围" };
  return { ok: true, value: [...tasks, { id, title: normalized, done: false }] };
}

export function completeTask(tasks: readonly Task[], id: number): Result<Task[]> {
  if (!tasks.some(task => task.id === id)) return { ok: false, error: "未找到任务" };
  return { ok: true, value: tasks.map(task => task.id === id ? { ...task, done: true } : task) };
}

export function pendingTitles(tasks: readonly Task[]): string[] {
  return tasks.filter(task => !task.done).map(task => task.title);
}
