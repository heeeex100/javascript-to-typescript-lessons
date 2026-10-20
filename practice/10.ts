type Result = { ok: true; value: string } | { ok: false; error: string };
function parseTitle(input: unknown): Result {
  return { ok: true, value: input.trim() };
}
console.log(parseTitle(" 学习 "));
console.log(parseTitle(null));
