import assert from "node:assert/strict";

// 参数是待检查的实现，既可检查你的练习，也可检查参考答案。
export function checkJs(api) {
  assert.equal(api.parseMinutes("30"), 30);
  assert.equal(api.parseMinutes(" 0 "), 0);
  assert.equal(api.parseMinutes("2.5"), 2.5);
  for (const input of ["", "   ", "abc", "-1", "Infinity", null]) {
    assert.throws(() => api.parseMinutes(input), undefined, `应拒绝输入：${String(input)}`);
  }
  const a = api.makeCounter(0);
  const b = api.makeCounter(10);
  assert.equal(a(), 1);
  assert.equal(a(), 2);
  assert.equal(b(), 11);
  assert.equal(a(), 3);
  const tasks = Object.freeze([
    Object.freeze({ id: 1, title: "JS", done: false }),
    Object.freeze({ id: 2, title: "TS", done: true }),
  ]);
  assert.deepEqual(api.pendingTitles(tasks), ["JS"]);
  assert.deepEqual(api.pendingTitles([]), []);
  const updated = api.completeTask(tasks, 1);
  assert.deepEqual(updated, [{ id: 1, title: "JS", done: true }, tasks[1]]);
  assert.notEqual(updated, tasks);
  assert.equal(tasks[0].done, false);
  const missing = api.completeTask(tasks, 999);
  assert.deepEqual(missing, tasks);
  assert.notEqual(missing, tasks);
  assert.deepEqual(api.completeTask([], 1), []);
}

export function checkTs(api) {
  assert.equal(api.formatTask({ id: 1, title: "学习", done: false }), "[待办] 学习");
  assert.equal(api.formatTask({ id: 1, title: "学习", done: true, note: " 复习 " }), "[完成] 学习（复习）");
  assert.equal(api.formatTask({ id: 1, title: "学习", done: false, note: " " }), "[待办] 学习");
  assert.deepEqual(api.parseTitle(" JS "), { ok: true, value: "JS" });
  for (const input of ["", " ", null, undefined, 123, {}, []]) {
    assert.deepEqual(api.parseTitle(input), { ok: false, error: "标题不能为空" });
  }
  const item = { id: 3, title: "TS", extra: true };
  assert.equal(api.findById([item], 3), item);
  assert.equal(api.findById([item], 4), undefined);
  assert.equal(api.findById([], 3), undefined);
}
