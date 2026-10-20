import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import "../workshop/labs.js";
import "../workshop/advanced-labs.js";
import "../workshop/finals.js";
import "../workshop/drills.js";

const root = fileURLToPath(new URL("..", import.meta.url));
let count = 0;
const drillMode = process.argv.includes("--drills");
for (const lab of drillMode ? globalThis.learningDrills : globalThis.learningLabs) {
  if (lab.lang === "dom") continue;
  if (process.argv.includes("--advanced") && !lab.advanced) continue;
  // 使用内置起始代码，不要求学习者已经编辑的文件仍然失败。
  const command = ["scripts/lab.mjs", ...(drillMode ? ["--drill"] : []), lab.id];
  const initial = spawnSync(process.execPath, [...command, "--starter", "--check"], { cwd: root, encoding: "utf8", timeout: 20000 });
  assert.equal(initial.status, 1, `${lab.id} 起始问题应被检查发现\n${initial.stdout}\n${initial.stderr}`);
  assert.match(initial.stdout + initial.stderr, /挑战提示|error TS|SyntaxError:.*not valid JSON/, `${lab.id} 应给出挑战提示、解析错误或真实类型错误`);
  const answer = spawnSync(process.execPath, [...command, "--answer", "--check"], { cwd: root, encoding: "utf8", timeout: 20000 });
  assert.equal(answer.status, 0, `${lab.id} 参考解法应通过\n${answer.stdout}\n${answer.stderr}`);
  assert.match(answer.stdout, /挑战通过/);
  count += 1;
  console.log(`通过 ${lab.id}：起始问题被发现，参考解法通过验收`);
}
console.log(`完成 ${count} 个${drillMode ? "小步练习" : "可执行关卡"}的正反检查；真实 DOM 操作仍需浏览器验收。`);
