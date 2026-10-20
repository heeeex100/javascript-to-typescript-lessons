export interface Task {
  readonly id: number;
  readonly title: string;
  readonly done: boolean;
}

export type Result<T> = { ok: true; value: T } | { ok: false; error: string };
