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
