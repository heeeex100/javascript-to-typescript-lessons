import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import "../workshop/labs.js";
import "../workshop/advanced-labs.js";
import "../workshop/finals.js";

test("统计器综合题同时验收四项统计，并覆盖空数组、全跳过和边界值", async () => {
  const lab = learningLabs.find(item => item.id === "02");
  const answer = await readFile(new URL("../" + lab.answerFile, import.meta.url), "utf8");
  const run = source => runInNewContext(source + "\n" + lab.checks, {
    console: { log() {} }, check: (condition, message) => assert.ok(condition, message),
  });
  for (const sessions of [[], [1, 2], [25, 25], [10, 25, 40, 15], [30]]) {
    run(answer.replace(/const sessions = .*?;/, "const sessions = " + JSON.stringify(sessions) + ";"));
  }
  assert.throws(() => run(answer.replace("skipped = skipped + 1", "skipped = skipped")), /skipped/);
  assert.throws(() => run(answer.replace("average = total / count", "average = total")), /平均/);
});

test("分钟数题检查文字输入及三个结果，换输入后仍按实际结果判断", () => {
  const lab = learningLabs.find(item => item.id === "01");
  const fixed = lab.starter.replace("numeric = input", "numeric = Number(input)")
    .replace("total = input + bonus", "total = numeric + bonus")
    .replace("valid = true", "valid = Number.isFinite(total)");
  const run = source => runInNewContext(source + "\n" + lab.checks, {
    console: { log() {} }, check: (condition, message) => assert.ok(condition, message),
  });
  for (const input of ["20", "0", "30", "abc"]) {
    run(fixed.replace('input = "20"', 'input = ' + JSON.stringify(input)));
  }
  assert.throws(() => run(fixed.replace('input = "20"', "input = 20")), /input/);
  assert.throws(() => run(fixed.replace("numeric = Number(input)", "numeric = input")), /numeric/);
  assert.throws(() => run(fixed.replace("total = numeric + bonus", "total = input + bonus")), /总时长/);
  assert.throws(() => run(fixed.replace('input = "20"', 'input = "abc"').replace("valid = Number.isFinite(total)", "valid = true")), /valid/);
});
