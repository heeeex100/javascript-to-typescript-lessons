export interface Task {
  readonly id: number;
  title: string;
  done: boolean;
  note?: string;
}
export type TitleResult = { ok: true; value: string } | { ok: false; error: string };

// 第 09 课：[待办] 学习 或 [完成] 学习（备注）。
export function formatTask(task: Task): string {
  throw new Error("TODO：实现 formatTask");
}

// 第 10 课：只有非空字符串成功；去除两侧空白；失败提示为“标题不能为空”。
export function parseTitle(value: unknown): TitleResult {
  throw new Error("TODO：实现 parseTitle");
}

// 第 11 课：保留元素类型；不存在时返回 undefined。
export function findById<T extends { id: number }>(items: readonly T[], id: number): T | undefined {
  throw new Error("TODO：实现 findById");
}
