import { readFileSync, writeFileSync, mkdtempSync, rmSync, realpathSync, existsSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import "../workshop/labs.js";
import "../workshop/advanced-labs.js";

const root = fileURLToPath(new URL("..", import.meta.url));
const drillMode = process.argv[2] === "--drill";
if (!drillMode) await import("../workshop/finals.js");
if (drillMode) await import("../workshop/drills.js");
const args = process.argv.slice(drillMode ? 3 : 2);
const pattern = drillMode ? /^\d{2}-\d{2}$/ : /^\d{1,2}$/;
const selections = args.filter(arg => pattern.test(arg));
const invalidArgs = args.some(arg => !pattern.test(arg) && !["--check", "--answer", "--starter", ...(drillMode ? ["--prepare"] : [])].includes(arg));
const id = (selections[0] ?? "").padStart(2, "0");
const lesson = (drillMode ? globalThis.learningDrills : globalThis.learningLabs).find(lab => lab.id === id);
const checking = args.includes("--check");
const answer = args.includes("--answer");
if (!lesson || selections.length !== 1 || invalidArgs || (args.includes("--answer") && args.includes("--starter")) ||
    (args.includes("--prepare") && args.length !== 2)) {
  console.log(drillMode ? "用法：npm run drill -- 02-01 [--prepare | --check]\n先 --prepare 创建独立文件，修改后 --check。" : "用法：npm run lab -- 01 [--check]\n基础 00～12，进阶 13～18；例如 npm run lab -- 13 --check");
  process.exit(args.length === 0 ? 0 : 1);
}
if (drillMode && args.includes("--prepare")) {
  const prepared = { [lesson.file]: lesson.starter };
  for (const [name, source] of Object.entries(lesson.files ?? {})) prepared[join(dirname(lesson.file), name)] = source;
  for (const [file, source] of Object.entries(prepared)) {
    mkdirSync(dirname(join(root, file)), { recursive: true });
    try { writeFileSync(join(root, file), source, { flag: "wx" }); }
    catch (error) { if (error.code !== "EEXIST") throw error; console.log(`${file} 文件已存在，保留你的修改。`); }
  }
  console.log(`编辑 ${lesson.file}，保存后运行 npm run drill -- ${id} --check`);
  process.exit(0);
}
if (lesson.lang === "dom") {
  console.log(`第 07 关综合大练习：浏览器打开 ${lesson.page}，编辑 ${lesson.file} 后刷新。\n验收：添加、完成、删除后数量同步；空白输入不增加任务。`);
  process.exit(0);
}
const sourcePath = drillMode ? (answer ? `小练习 ${id} 的内置参考` : lesson.file) : answer ? lesson.answerFile ?? `answers/practice/${lesson.id}.${lesson.lang}` : lesson.file;
const source = drillMode && answer ? lesson.answer : args.includes("--starter") ? lesson.starter :
  drillMode && !existsSync(join(root, sourcePath)) ? lesson.starter : readFileSync(join(root, sourcePath), "utf8");
const stage = realpathSync(mkdtempSync(join(tmpdir(), "js-ts-lesson-")));
const checks = checking ? lesson.checks : "";
const marker = `__LESSON_COMPLETE_${randomUUID()}__`;
const helper = lesson.lang === "ts"
  ? '\nfunction check(condition: boolean, message: string): void { if (!condition) throw new Error("挑战提示：" + message); }\n'
  : '\nfunction check(condition, message) { if (!condition) throw new Error("挑战提示：" + message); }\n';

console.log(`\n第 ${lesson.id} 关 · ${lesson.title}\n读取：${sourcePath}`);
let status = 0;
try {
  writeFileSync(join(stage, "package.json"), '{"type":"module"}');
  for (const [name, fallback] of Object.entries(lesson.files ?? {})) {
    const local = join(root, dirname(lesson.file), name);
    const content = answer && lesson.supportAnswers?.[name] ? readFileSync(join(root, lesson.supportAnswers[name]), "utf8") :
      !answer && !args.includes("--starter") && existsSync(local) ? readFileSync(local, "utf8") : fallback;
    mkdirSync(dirname(join(stage, name)), { recursive: true });
    writeFileSync(join(stage, name), content);
  }
  const entry = join(stage, `main.${lesson.lang}`);
  // 保持学习代码在文件开头，错误行号能对应到本关文件。
  writeFileSync(entry, source + helper + checks + (checking ? `\nconsole.log(${JSON.stringify(marker)});\n` : ""));
  if (lesson.lang === "ts") {
    writeFileSync(join(stage, "tsconfig.json"), JSON.stringify({
      compilerOptions: {
        target: "ES2022", module: "NodeNext", moduleResolution: "NodeNext", moduleDetection: "force",
        strict: true, noUncheckedIndexedAccess: true, noEmitOnError: true,
        lib: ["ES2022", "DOM"], types: [], outDir: "out",
      }, files: ["main.ts"],
    }));
    const compile = spawnSync(process.execPath, [join(root, "node_modules/typescript/bin/tsc"), "-p", stage, "--pretty", "false"], { encoding: "utf8", timeout: 15000 });
    // 输出路径换为学习者实际编辑的文件；附加验收代码单独说明。
    const compilerOutput = (compile.stdout ?? "") + (compile.stderr ?? "");
    process.stdout.write(compilerOutput.replaceAll(join(stage, "main.ts"), sourcePath));
    if (compile.error || compile.status !== 0) {
      console.log("类型检查未通过，尚未运行。请修改上面的 practice 文件，再试一次。\n若报错行号超过源码长度，那是附加验收在检查你的类型约定。");
      if (compile.error) console.log(compile.error.message);
      status = 1;
    }
  }
  if (status === 0) {
    const runnable = lesson.lang === "ts" ? join(stage, "out/main.js") : entry;
    const run = spawnSync(process.execPath, [runnable], { encoding: "utf8", timeout: 4000, maxBuffer: 1024 * 1024 });
    const output = run.stdout ?? "";
    process.stdout.write(output.replace(marker + "\n", "").replace(marker + "\r\n", ""));
    if (run.status !== 0 || run.error) {
      const error = (run.stderr ?? "").replaceAll(pathToFileURL(runnable).href, sourcePath).replaceAll(runnable, sourcePath);
      process.stderr.write(error);
      if (run.error) console.error("运行已停止：可能是无限循环、等待过长或输出过多。", run.error.message);
      status = 1;
    } else if (checking && !output.includes(marker)) {
      console.error("代码提前退出，验收尚未完成；本次不能标记通过。");
      status = 1;
    } else if (checking) {
      console.log("挑战通过：本关验收全部成立。");
    } else {
      console.log(`\n再试：npm run ${drillMode ? "drill" : "lab"} -- ${lesson.id} --check`);
    }
  }
} finally {
  rmSync(stage, { recursive: true, force: true });
}
process.exitCode = status;
