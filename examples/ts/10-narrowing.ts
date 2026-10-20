type Result = { ok: true; value: number } | { ok: false; error: string };
function describe(result: Result): string {
  if (result.ok) return `结果是 ${result.value}`;
  return `失败：${result.error}`;
}
function normalizeId(id: string | number): string {
  return typeof id === "number" ? id.toFixed(0) : id.trim();
}
const raw: unknown = JSON.parse('{"title":"学习收窄"}');
if (typeof raw === "object" && raw !== null && "title" in raw) {
  if (typeof raw.title === "string") console.log("已验证的标题：", raw.title.trim());
}
console.log(describe({ ok: true, value: 25 }));
console.log(describe({ ok: false, error: "无效输入" }));
console.log("统一 ID：", normalizeId(" 42 "));
export {};
