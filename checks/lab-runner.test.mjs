import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, copyFile, writeFile, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

test("CLI 验收识别提前退出和错误参数，正确代码才通过，练习文件不被改写", async () => {
  const root = await mkdtemp(join(tmpdir(), "lesson runner space "));
  try {
    for (const folder of ["scripts", "workshop", "practice"]) await mkdir(join(root, folder));
    await writeFile(join(root, "package.json"), '{"type":"module"}');
    await copyFile(fileURLToPath(new URL("../scripts/lab.mjs", import.meta.url)), join(root, "scripts/lab.mjs"));
    // 用 JSON 编码课程数据，避免夹具的多层引号影响实际验收。
    await writeFile(join(root, "workshop/labs.js"), "globalThis.learningLabs=" + JSON.stringify([{ id: "01", title: "验收", file: "practice/01.js", lang: "js", checks: 'check(value===2, "应为2");' }]) + ";");
    await writeFile(join(root, "workshop/advanced-labs.js"), "");
    const execute = args => spawnSync(process.execPath, ["scripts/lab.mjs", ...args], { cwd: root, encoding: "utf8", timeout: 10000 });
    await writeFile(join(root, "practice/01.js"), "process.exit(0);");
    const early = execute(["01", "--check"]);
    assert.equal(early.status, 1); assert.match(early.stderr, /提前退出/);
    await writeFile(join(root, "practice/01.js"), "const value=2;");
    const correct = execute(["01", "--check"]);
    assert.equal(correct.status, 0); assert.match(correct.stdout, /挑战通过/);
    assert.equal(await readFile(join(root, "practice/01.js"), "utf8"), "const value=2;");
    assert.doesNotMatch(correct.stdout, /__LESSON_COMPLETE_/);
    for (const args of [["--check"], ["01", "02"], ["01", "--typo"]]) assert.equal(execute(args).status, 1);
    assert.equal(execute([]).status, 0);
  } finally { await rm(root, { recursive: true, force: true }); }
});
