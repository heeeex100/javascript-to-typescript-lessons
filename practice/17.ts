interface Task { id: number; title: string; done: boolean }
interface Issue { path: string; message: string }
type ImportResult = { ok: true; value: Task[] } | { ok: false; issues: Issue[] };
function parseImport(input: unknown): ImportResult {
  // TODO：不能用 as Task[] 假装校验完成。
  return { ok: true, value: input as Task[] };
}
console.log(parseImport([{id:1,title:" 学习 ",done:false},{id:1,title:" ",done:"false"}]));
