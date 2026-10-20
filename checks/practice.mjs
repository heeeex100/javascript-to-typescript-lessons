import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import "../workshop/labs.js";
import "../workshop/advanced-labs.js";

const root = fileURLToPath(new URL("..", import.meta.url));
let count = 0;
for (const lab of globalThis.learningLabs) {
  if (lab.lang === "dom") continue;
  if (process.argv.includes("--advanced") && !lab.advanced) continue;
  // 使用内置起始代码，不要求学习者已经编辑的文件仍然失败。
  const initial = spawnSync(process.execPath, ["scripts/lab.mjs", lab.id, "--starter", "--check"], { cwd: root, encoding: "utf8", timeout: 20000 });
  assert.equal(initial.status, 1, `${lab.id} 起始问题应被检查发现\n${initial.stdout}\n${initial.stderr}`);
  assert.match(initial.stdout + initial.stderr, /挑战提示|error TS|SyntaxError:.*not valid JSON/, `${lab.id} 应给出挑战提示、解析错误或真实类型错误`);
  const answer = spawnSync(process.execPath, ["scripts/lab.mjs", lab.id, "--answer", "--check"], { cwd: root, encoding: "utf8", timeout: 20000 });
  assert.equal(answer.status, 0, `${lab.id} 参考解法应通过\n${answer.stdout}\n${answer.stderr}`);
  assert.match(answer.stdout, /挑战通过/);
  count += 1;
  console.log(`通过 ${lab.id}：起始问题被发现，参考解法通过验收`);
}
console.log(`完成 ${count} 个可执行关卡的正反检查；DOM 第 07 关另需浏览器验收。`);
