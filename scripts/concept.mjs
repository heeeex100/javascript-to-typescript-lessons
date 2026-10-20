import { existsSync, readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync, realpathSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

const root = fileURLToPath(new URL("..", import.meta.url));
const args = process.argv.slice(2);
const id = (args[0] ?? "").padStart(2, "0");
const usage = "用法：npm run concept -- 08 [--prepare | --local]\n不加选项运行概念原例；--prepare 创建独立实验文件；修改后用 --local 运行。";
if (!/^\d{1,2}$/.test(args[0] ?? "") || Number(id) > 18 || args.length > 2 ||
    (args[1] && !["--prepare", "--local"].includes(args[1]))) {
  console.log(usage);
  process.exit(args.length === 0 ? 0 : 1);
}

let stage;
try {
  const markdown = readFileSync(join(root, "reference/foundations", `${id}.md`), "utf8");
  const example = markdown.match(/^```(js|ts|html)\r?\n([\s\S]*?)^```/m);
  if (!example) throw new Error(`第 ${id} 关缺少概念代码块。`);
  const [, language, original] = example;
  const extension = language === "js" ? "mjs" : language;
  const localFile = join(root, "practice/concepts", `${id}.${extension}`);
  const displayFile = relative(root, localFile).split("\\").join("/");
  if (args[1] === "--prepare") {
    mkdirSync(join(root, "practice/concepts"), { recursive: true });
    try { writeFileSync(localFile, original, { flag: "wx" }); }
    catch (error) {
      if (error.code !== "EEXIST") throw error;
      console.log(`文件已存在，保留你的修改：${displayFile}`);
    }
    console.log(`编辑 ${displayFile}\n再运行：npm run concept -- ${id} --local`);
  } else if (language === "html") {
    if (!existsSync(localFile)) {
      console.log(`这是浏览器 DOM 实验。先运行 npm run concept -- ${id} --prepare 创建 HTML 文件。`);
    } else {
      console.log(`启动 npm run workshop 后，打开终端给出的地址，将 /workshop/ 换为 /${displayFile}。\n也可直接用浏览器打开 ${displayFile}。`);
    }
  } else {
    if (args[1] === "--local" && !existsSync(localFile)) {
      throw new Error(`还没有 ${displayFile}；先运行 npm run concept -- ${id} --prepare。`);
    }
    const source = args[1] === "--local" ? readFileSync(localFile, "utf8") : original;
    const label = args[1] === "--local" ? displayFile : `reference/foundations/${id}.md 中的例子`;
    const compiler = join(root, "node_modules/typescript/bin/tsc");
    if (language === "ts" && !existsSync(compiler)) {
      throw new Error("尚未安装 TypeScript。请先在项目根目录运行 npm ci，再运行本命令。");
    }
    stage = realpathSync(mkdtempSync(join(tmpdir(), "js-ts-concept-")));
    writeFileSync(join(stage, "package.json"), '{"type":"module"}');
    const entry = join(stage, `main.${extension}`);
    writeFileSync(entry, source);
    let runnable = entry;
    const execute = (program, parameters) => {
      const result = spawnSync(program, parameters, {
        cwd: stage, encoding: "utf8", timeout: 15000, maxBuffer: 1024 * 1024,
      });
      const rewrite = text => (text ?? "")
        .replaceAll(pathToFileURL(runnable).href, label)
        .replaceAll(runnable, label).replaceAll(entry, label);
      process.stdout.write(rewrite(result.stdout));
      process.stderr.write(rewrite(result.stderr));
      if (result.error) throw new Error(`运行已停止（超时、输出过多或无法启动）：${result.error.code}`);
      return result.status === 0;
    };
    console.log(`第 ${id} 关概念实验 · ${label}`);
    let compiled = true;
    if (language === "ts") {
      writeFileSync(join(stage, "tsconfig.json"), JSON.stringify({
        compilerOptions: {
          strict: true, target: "ES2022", module: "NodeNext", moduleResolution: "NodeNext",
          moduleDetection: "force", noEmitOnError: true, types: [], outDir: "out",
        }, files: ["main.ts"],
      }));
      compiled = execute(process.execPath, [compiler, "-p", stage, "--pretty", "false"]);
      runnable = join(stage, "out/main.js");
      if (!compiled) console.error("类型检查未通过，尚未执行。");
    }
    if (!compiled || !execute(process.execPath, [runnable])) process.exitCode = 1;
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  if (stage) rmSync(stage, { recursive: true, force: true });
}
