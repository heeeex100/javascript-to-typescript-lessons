import { readFile, realpath, stat } from "node:fs/promises";
import { resolve, relative, sep, isAbsolute, extname } from "node:path";

const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".md": "text/plain", ".ts": "text/plain" };
const rootDocuments = new Set(["README.md", "CONTRIBUTING.md", "Windows使用说明.md", "学习检查记录.md"]);
const allowed = name => /^(workshop|practice|lessons|challenges|reference|answers|examples)\//.test(name) || rootDocuments.has(name);

export async function createWorkshopHandler(directory) {
  const root = await realpath(directory);
  return async (request, response) => {
    if (!["GET", "HEAD"].includes(request.method)) {
      response.writeHead(405, { Allow: "GET, HEAD" }).end("Method not allowed"); return;
    }
    let pathname;
    try { pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname); }
    catch { response.writeHead(400).end("Bad URL"); return; }
    try {
      let path = resolve(root, pathname === "/" ? "workshop/index.html" : pathname.slice(1));
      if ((await stat(path)).isDirectory()) path = resolve(path, "index.html");
      path = await realpath(path);
      const local = relative(root, path);
      // 在规范化及解析符号链接后再判断可提供的文件，防止编码路径绕过目录限制。
      if (isAbsolute(local) || local === ".." || local.startsWith(".." + sep) || !allowed(local.split(sep).join("/"))) {
        response.writeHead(404).end("Not found"); return;
      }
      const content = await readFile(path);
      response.writeHead(200, {
        "Content-Type": (types[extname(path)] ?? "text/plain") + "; charset=utf-8",
        "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff",
      });
      response.end(request.method === "HEAD" ? undefined : content);
    } catch { response.writeHead(404).end("Not found"); }
  };
}
