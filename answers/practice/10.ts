type Result = { ok: true; value: string } | { ok: false; error: string };
function parseTitle(input: unknown): Result {
  if (typeof input !== "string" || input.trim() === "") {
    return { ok: false, error: "标题不能为空" };
  }
  return { ok: true, value: input.trim() };
}
console.log(parseTitle(" 学习 "));
console.log(parseTitle(null));
