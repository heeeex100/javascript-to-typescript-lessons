import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createWorkshopHandler } from "../scripts/static-server.mjs";

test("课程服务提供 HTML、中文文档与 HEAD，拒绝编码绕过和目录外文件", async () => {
  const parent = await mkdtemp(join(tmpdir(), "workshop-handler-"));
  const root = join(parent, "course");
  try {
    await mkdir(join(root, "workshop"), { recursive: true });
    await writeFile(join(root, "workshop/index.html"), "<h1>课程</h1>");
    await writeFile(join(root, "Windows使用说明.md"), "迁移步骤");
    await writeFile(join(root, "CONTRIBUTING.md"), "维护步骤");
    await writeFile(join(root, "private.txt"), "不能提供的文件");
    await writeFile(join(parent, "outside.txt"), "目录外文件");
    const handle = await createWorkshopHandler(root);
    async function request(url, method = "GET") {
      const result = {};
      const response = {
        writeHead(status, headers = {}) { result.status = status; result.headers = headers; return this; },
        end(body) { result.body = body?.toString(); return this; },
      };
      await handle({ url, method }, response); return result;
    }
    const html = await request("/");
    assert.equal(html.status, 200); assert.match(html.body, /课程/);
    assert.match(html.headers["Content-Type"], /text\/html/);
    assert.equal((await request("/workshop/", "HEAD")).body, undefined);
    assert.equal((await request("/" + encodeURIComponent("Windows使用说明.md"))).body, "迁移步骤");
    assert.equal((await request("/CONTRIBUTING.md")).body, "维护步骤");
    for (const path of ["/private.txt", "/workshop/..%2fprivate.txt", "/workshop/..%2f..%2foutside.txt", "/workshop/missing.js"]) {
      assert.equal((await request(path)).status, 404, path);
    }
    assert.equal((await request("/%ZZ")).status, 400);
    assert.equal((await request("/", "POST")).status, 405);
    if (process.platform !== "win32") {
      await symlink(join(root, "private.txt"), join(root, "workshop/private-link"));
      await symlink(join(parent, "outside.txt"), join(root, "workshop/outside-link"));
      assert.equal((await request("/workshop/private-link")).status, 404);
      assert.equal((await request("/workshop/outside-link")).status, 404);
    }
  } finally { await rm(parent, { recursive: true, force: true }); }
});
