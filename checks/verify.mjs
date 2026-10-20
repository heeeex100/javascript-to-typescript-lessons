import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import * as jsAnswers from "../answers/js.js";
import * as tsAnswers from "../dist/answers/ts.js";
import { checkJs, checkTs } from "./exercise-cases.mjs";
import { parseTasks } from "../dist/project/validation.js";
import { addTask, completeTask, pendingTitles } from "../dist/project/service.js";

checkJs(jsAnswers);
checkTs(tsAnswers);
console.log("通过：JS / TS 参考答案及边界输入");

assert.deepEqual(parseTasks("[]"), { ok: true, value: [] });
const valid = [{ id: 1, title: " JS ", done: false }];
assert.deepEqual(parseTasks(JSON.stringify(valid)), { ok: true, value: [{ id: 1, title: "JS", done: false }] });
for (const text of ["oops", "null", "123", "{}", '[{"id":1}]',
  '[{"id":0,"title":"JS","done":false}]',
  '[{"id":1.5,"title":"JS","done":false}]',
  '[{"id":9007199254740992,"title":"JS","done":false}]',
  '[{"id":1,"title":" ","done":false}]',
  '[{"id":1,"title":"JS","done":"false"}]',
  JSON.stringify([valid[0], valid[0]])]) {
  assert.equal(parseTasks(text).ok, false, `应拒绝：${text}`);
}
const tasks = Object.freeze([Object.freeze({ id: 1, title: "JS", done: false })]);
const added = addTask(tasks, " TS ");
assert.equal(added.ok, true);
assert.deepEqual(added.value, [tasks[0], { id: 2, title: "TS", done: false }]);
assert.equal(tasks.length, 1);
assert.equal(addTask(tasks, " ").ok, false);
assert.equal(addTask([{ id: Number.MAX_SAFE_INTEGER, title: "极限", done: false }], "TS").ok, false);
assert.deepEqual(addTask([], "JS").value, [{ id: 1, title: "JS", done: false }]);
const completed = completeTask(tasks, 1);
assert.equal(completed.ok, true);
assert.deepEqual(completed.value, [{ id: 1, title: "JS", done: true }]);
assert.equal(tasks[0].done, false);
assert.deepEqual(pendingTitles(completed.value), []);
assert.deepEqual(pendingTitles(tasks), ["JS"]);
assert.equal(completeTask(tasks, 999).ok, false);
assert.deepEqual(tsAnswers.removeTask(tasks, 1), { ok: true, value: [] });
assert.equal(tsAnswers.removeTask(tasks, 99).ok, false);
assert.equal(tasks.length, 1);
console.log("通过：项目 JSON 校验、添加、完成、删除答案和原数据保护");

const root = fileURLToPath(new URL("..", import.meta.url));
const cases = [
  ["examples/js/01-values.js", /转换后相加： 25/],
  ["examples/js/02-control.js", /总时长： 65/],
  ["examples/js/03-functions.js", /第一个计数器： 1 2/],
  ["examples/js/04-collections.js", /原任务状态： false/],
  ["examples/js/05-modules.js", /捕获解析失败/],
  ["examples/js/06-async.js", /A：开始[\s\S]*B：请求已发起[\s\S]*C：拿到结果 1[\s\S]*模拟加载失败/],
  ["dist/examples/ts/08-basics.js", /数字求和： 25/],
  ["dist/examples/ts/09-models.js", /备注： 无备注/],
  ["dist/examples/ts/10-narrowing.js", /结果是 25/],
  ["dist/examples/ts/11-generics.js", /空列表： undefined/],
  ["dist/project/main.js", /待办标题：[\s\S]*练习联合类型/],
];
for (const [file, expected] of cases) {
  const output = execFileSync(process.execPath, [file], { cwd: root, encoding: "utf8", timeout: 10000 });
  assert.match(output, expected, file);
}
console.log(`通过：${cases.length} 个可执行示例的关键输出`);
