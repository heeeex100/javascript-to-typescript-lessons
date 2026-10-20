interface Task { id: number; title: string; done: boolean }
interface Issue { path: string; message: string }
type ImportResult = { ok: true; value: Task[] } | { ok: false; issues: Issue[] };
function parseImport(input: unknown): ImportResult {
  if (!Array.isArray(input)) return { ok:false, issues:[{path:"$",message:"必须是数组"}] };
  const rows: unknown[] = input;
  const issues: Issue[] = [];
  const tasks: Task[] = [];
  const ids = new Set<number>();
  rows.forEach((row, index) => {
    const path = `$[${index}]`;
    if (typeof row !== "object" || row === null || Array.isArray(row)) {
      issues.push({path,message:"必须是任务对象"});
      return;
    }
    const id = "id" in row ? row.id : undefined;
    const title = "title" in row ? row.title : undefined;
    const done = "done" in row ? row.done : undefined;
    let valid = true;
    if (typeof id !== "number" || !Number.isSafeInteger(id) || id <= 0) {
      issues.push({path:path+".id",message:"id 必须是正安全整数"}); valid=false;
    } else if (ids.has(id)) {
      issues.push({path:path+".id",message:"id 重复"}); valid=false;
    } else { ids.add(id); }
    if (typeof title !== "string" || title.trim()==="") {
      issues.push({path:path+".title",message:"标题不能为空"}); valid=false;
    }
    if (typeof done !== "boolean") {
      issues.push({path:path+".done",message:"done 必须是布尔值"}); valid=false;
    }
    if (valid && typeof id==="number" && typeof title==="string" && typeof done==="boolean") {
      tasks.push({id,title:title.trim(),done});
    }
  });
  return issues.length ? {ok:false,issues} : {ok:true,value:tasks};
}
console.log(parseImport([{id:1,title:" 学习 ",done:false},{id:1,title:" ",done:"false"}]));
