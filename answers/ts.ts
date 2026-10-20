import type { Task, TitleResult } from "../exercises/ts.js";
import type { Task as ProjectTask, Result } from "../project/models.js";

export function formatTask(task: Task): string {
  const state = task.done ? "完成" : "待办";
  const note = task.note?.trim();
  return `[${state}] ${task.title}${note ? `（${note}）` : ""}`;
}

export function parseTitle(value: unknown): TitleResult {
  if (typeof value !== "string" || value.trim() === "") {
    return { ok: false, error: "标题不能为空" };
  }
  return { ok: true, value: value.trim() };
}

export function findById<T extends { id: number }>(items: readonly T[], id: number): T | undefined {
  return items.find(item => item.id === id);
}

export function removeTask(tasks: readonly ProjectTask[], id: number): Result<ProjectTask[]> {
  if (!tasks.some(task => task.id === id)) return { ok: false, error: "未找到任务" };
  return { ok: true, value: tasks.filter(task => task.id !== id) };
}
