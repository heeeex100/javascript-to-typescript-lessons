import type { Result, Task } from "./models.js";

// TS 源码也写 .js：编译后相对位置不变，Node 导入实际生成的 JS。
// 类型守卫必须真的检查每个必需字段，不能只写一个类型承诺。
export function isTask(value: unknown): value is Task {
  if (typeof value !== "object" || value === null) return false;
  return "id" in value && typeof value.id === "number"
    && Number.isSafeInteger(value.id) && value.id > 0
    && "title" in value && typeof value.title === "string" && value.title.trim().length > 0
    && "done" in value && typeof value.done === "boolean";
}

export function parseTasks(text: string): Result<Task[]> {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: "不是合法 JSON" };
  }
  if (!Array.isArray(raw)) return { ok: false, error: "任务列表必须是数组" };

  // Array.isArray 的内置类型守卫得到 any[]；接成 unknown[]，逐项认真检查。
  const items: unknown[] = raw;
  const tasks: Task[] = [];
  const ids = new Set<number>();
  for (const item of items) {
    if (!isTask(item)) return { ok: false, error: "任务字段不合法" };
    if (ids.has(item.id)) return { ok: false, error: "任务 id 重复" };
    ids.add(item.id);
    tasks.push({ id: item.id, title: item.title.trim(), done: item.done });
  }
  return { ok: true, value: tasks };
}
