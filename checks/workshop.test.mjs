import test from "node:test";
import assert from "node:assert/strict";
import { runInNewContext } from "node:vm";
import "../workshop/labs.js";
import "../workshop/advanced-labs.js";
import "../workshop/state.js";
import "../workshop/runner.js";

const labs = globalThis.learningLabs;
const State = globalThis.WorkshopState;
const first = labs.find(lab => lab.id === "01");
const evidence = (source, checks = first.checks) => ({ source, checks });

test("旧版草稿保留，无法对应代码和验收的旧通关标记需要重验", () => {
  const state = State.normalize(labs, { drafts: { "01": "我的旧草稿", "17": "不应作为网页 TS 草稿" }, passed: { "01": true }, lastLesson: "13" });
  assert.equal(state.drafts["01"], "我的旧草稿");
  assert.equal(state.drafts["17"], undefined);
  assert.equal(State.isPassed(state, first), false);
  assert.equal(state.lastLesson, "13");
});

test("备份往返保留草稿、通关依据；输入变化或验收变化使旧记录失效", () => {
  const source = "const total = 25;";
  const state = State.normalize(labs, { drafts: { "01": source }, passed: { "01": evidence(source) } });
  const restored = State.parseBackup(labs, State.exportBackup(labs, state));
  assert.deepEqual(restored, state);
  assert.equal(State.isPassed(restored, first), true);
  assert.equal(State.isPassed(restored, { ...first, checks: "新验收" }), false);
  restored.drafts["01"] = "已修改";
  assert.equal(State.isPassed(restored, first), false);
});

test("导入默认保留冲突草稿，新草稿合并；明确选择后才替换冲突", () => {
  const current = State.normalize(labs, { drafts: { "01": "本机", "02": "相同" } });
  const incoming = State.normalize(labs, { drafts: { "01": "另一台电脑", "02": "相同", "13": "新增" } });
  const before = JSON.stringify(current);
  const preview = State.planImport(labs, current, incoming);
  assert.equal(preview.state.drafts["01"], "本机");
  assert.equal(preview.state.drafts["13"], "新增");
  assert.deepEqual(preview.counts, { added: 1, conflicts: 1, unchanged: 1, replaced: 0 });
  assert.equal(JSON.stringify(current), before);
  assert.equal(State.planImport(labs, current, incoming, true).state.drafts["01"], "另一台电脑");
});

test("备份拒绝错误版本、无效草稿、过大内容；未知键不会进入状态", () => {
  for (const raw of ["oops", "null", '{"version":99}', JSON.stringify({ kind: "js-ts-workshop-backup", version: 1, state: { drafts: { "01": 42 }, passed: {} } })]) {
    assert.throws(() => State.parseBackup(labs, raw));
  }
  assert.throws(() => State.parseBackup(labs, " ".repeat(State.MAX_BACKUP + 1)));
  const input = JSON.parse('{"drafts":{"__proto__":{"polluted":true},"99":"unknown","01":""},"passed":{}}');
  const state = State.normalize(labs, input);
  assert.deepEqual(state.drafts, { "01": "" });
  assert.equal({}.polluted, undefined);
});

async function execute(source, checks = "") {
  const messages = [];
  const self = { postMessage: message => messages.push(message) };
  runInNewContext(globalThis.WorkshopRunner.program, { self });
  await self.onmessage({ data: { source, checks } });
  return messages;
}

test("运行器保留真实输出，失败验收不发出完成标记", async () => {
  const passed = await execute('console.log("hello", 25); const result = 5;', 'check(result === 5, "应为 5");');
  assert.equal(passed[0].text, "hello 25");
  assert.equal(passed.at(-1).type, "done");
  const failed = await execute("const value = 1;", 'check(value === 2, "应为 2");');
  assert.equal(failed.at(-1).type, "error");
  assert.match(failed.at(-1).text, /应为 2/);
  assert.equal(failed.some(message => message.type === "done"), false);
});

test("抛出 null、字符串、普通对象也能反馈，不因读取 error.name 二次崩溃", async () => {
  for (const [source, expected] of [["throw null;", "null"], ['throw "网络失败";', "网络失败"], ['throw {message:"错误"};', '{"message":"错误"}']]) {
    const messages = await execute(source);
    assert.equal(messages.at(-1).type, "error");
    assert.equal(messages.at(-1).text, expected);
  }
});

test("循环对象和 bigint 可显示，提前 return 和刷屏不会误标通过", async () => {
  const output = await execute('const x={n:1n}; x.self=x; console.log(x);');
  assert.match(output[0].text, /1n/);
  assert.match(output[0].text, /引用/);
  assert.equal(output.at(-1).type, "done");
  for (const source of ["return;", 'for(let i=0;i<151;i++) console.log(i);']) {
    const messages = await execute(source, 'check(true, "ok");');
    assert.equal(messages.at(-1).type, "error");
  }
});
