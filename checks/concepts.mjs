import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const expected = {
  "00": /数组：15 分钟\s+topic/,
  "01": /82 10\s+string number\s+0 NaN/,
  "02": /2 0\s+3 3\s+5 8\s+最终 8/,
  "03": /21 42/,
  "04": /JS true\s+false true/,
  "05": /string 复习\s+true\s+false/,
  "06": /开始\s+进入函数\s+继续主流程\s+已完成/,
  "08": /\n12\s*$/,
  "09": /""\s+空白或缺失/,
  "10": /需要有限数字/,
  "11": /JS 1 undefined/,
  "12": /false true\s+false true/,
  "13": /\[\s*25\s*\]\s+3 \[\s*12, 3, 25, 8\s*\]/,
  "14": /1 2 1\s+草稿 B 1/,
  "15": /新结果\s+旧结果/,
  "16": /\n0\s+\[ '开始 0', '开始 1' \] \[ 0, 10 \]/,
  "17": /JS\s+string true/,
  "18": /saved \{ id: 7 \}\s+failed \{ message: '离线' \}/,
};
for (const [id, output] of Object.entries(expected).sort(([a], [b]) => a.localeCompare(b))) {
  const result = spawnSync(process.execPath, ["scripts/concept.mjs", id], {
    cwd: root, encoding: "utf8", timeout: 30000,
  });
  assert.equal(result.status, 0, `${id}\n${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, output, `${id} 的输出应与讲义解释一致`);
  console.log(`通过 ${id}：概念例子执行与讲义预期一致`);
}
console.log("18 个命令行概念例子通过；07 为浏览器 DOM 实验。");
