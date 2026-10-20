import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, copyFile, writeFile, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

test("概念 CLI 隔离实验文件，重复准备不覆盖，错误参数和缺失依赖给出明确提示", async () => {
  const root = await mkdtemp(join(tmpdir(), "concept runner space "));
  try {
    for (const folder of ["scripts", "reference/foundations"]) await mkdir(join(root, folder), { recursive: true });
    await copyFile(fileURLToPath(new URL("../scripts/concept.mjs", import.meta.url)), join(root, "scripts/concept.mjs"));
    await writeFile(join(root, "reference/foundations/01.md"), '```js\nconsole.log("原例");\n```\n');
    await writeFile(join(root, "reference/foundations/08.md"), '```ts\nconst n: number = 2;\n```\n');
    await writeFile(join(root, "reference/foundations/07.md"), '```html\n<p>DOM</p>\n```\n');
    const execute = args => spawnSync(process.execPath, ["scripts/concept.mjs", ...args], { cwd: root, encoding: "utf8", timeout: 20000 });
    assert.equal(execute(["01", "--local"]).status, 1);
    assert.match(execute(["01"]).stdout, /原例/);
    assert.equal(execute(["01", "--prepare"]).status, 0);
    const file = join(root, "practice/concepts/01.mjs");
    await writeFile(file, 'console.log("我的实验");');
    assert.match(execute(["01", "--prepare"]).stdout, /保留你的修改/);
    assert.equal(await readFile(file, "utf8"), 'console.log("我的实验");');
    assert.match(execute(["01", "--local"]).stdout, /我的实验/);
    assert.match(execute(["01"]).stdout, /原例/);
    await writeFile(file, 'throw new Error("试验错误");');
    assert.equal(execute(["01", "--local"]).status, 1);
    assert.match(execute(["08"]).stderr, /npm ci/);
    assert.match(execute(["07"]).stdout, /浏览器 DOM/);
    assert.equal(execute(["07", "--prepare"]).status, 0);
    assert.match(await readFile(join(root, "practice/concepts/07.html"), "utf8"), /<p>DOM/);
    for (const args of [["19"], ["../01"], ["01", "--typo"], ["01", "--local", "--prepare"]]) {
      assert.equal(execute(args).status, 1);
    }
    assert.equal(execute([]).status, 0);
  } finally { await rm(root, { recursive: true, force: true }); }
});
