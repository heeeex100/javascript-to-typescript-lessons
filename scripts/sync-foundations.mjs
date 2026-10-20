// 概念原稿只维护 reference/foundations/*.md；此脚本同步网页及独立讲义。
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import "../workshop/labs.js";
import "../workshop/advanced-labs.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const checking = process.argv.includes("--check");
const start = "<!-- foundations:start -->";
const end = "<!-- foundations:end -->";
const foundations = {};
async function update(relative, expected) {
  const file = path.join(root, relative);
  const actual = await readFile(file, "utf8").catch(error => {
    if (error.code === "ENOENT") return "";
    throw error;
  });
  if (actual === expected) return;
  if (checking) throw new Error(`${relative} 概念内容未同步，请运行 npm run sync:concepts`);
  await writeFile(file, expected);
}
for (const lab of globalThis.learningLabs) {
  const source = await readFile(path.join(root, "reference", "foundations", `${lab.id}.md`), "utf8");
  foundations[lab.id] = source;
  const document = await readFile(path.join(root, lab.lesson), "utf8");
  const section = `${start}\n## 动手前先认识\n\n先读下面几个概念，再展开小例子预测输出。看完即可回到本关练习，不必先背术语。\n\n${source.trim()}\n${end}\n\n`;
  const begin = document.indexOf(start);
  let expected;
  if (begin >= 0) {
    const finish = document.indexOf(end, begin);
    if (finish < 0) throw new Error(`${lab.lesson} 概念区块缺少结束标记`);
    expected = document.slice(0, begin) + section + document.slice(finish + end.length).replace(/^\s*\n/, "");
  } else {
    const heading = document.indexOf("\n## ");
    if (heading < 0) throw new Error(`${lab.lesson} 缺少插入位置`);
    expected = document.slice(0, heading + 1) + section + document.slice(heading + 1);
  }
  await update(lab.lesson, expected);
}
await update("workshop/foundations.js", "// 由 npm run sync:concepts 生成，请编辑 reference/foundations/*.md。\n" +
  "globalThis.WorkshopFoundations = " + JSON.stringify(foundations, null, 2) + ";\n");
const links = globalThis.learningLabs.map(lab => `| [${lab.id} · ${lab.title}](../${lab.lesson}) | ${foundations[lab.id].split("\n")[0].replace(/^### /, "")} |`).join("\n");
await update("reference/概念导航.md", `# 概念导航：从读懂代码到自己修改\n\n每关完整讲义和实验台都有“动手前先认识”，按下面顺序串起基础概念。每节包含定义、可复制的小例子、输出解释、改动实验和折叠自测答案。00–12 建立基础，13–18 补足进阶挑战的前置知识。\n\n小实验独立于挑战，不会自动修改草稿或改变通关记录。用 npm run concept -- 关卡编号 直接运行原例；加 --prepare 创建独立实验文件，修改后加 --local 运行。TS 先 npm ci；07 的 HTML 准备后用浏览器打开。\n\n| 关卡与完整讲义 | 本关概念 |\n| --- | --- |\n${links}\n\n更详细的原有概念材料仍保留在本目录 00–12 文件中，可在各关末尾进入。\n`);
console.log(`已${checking ? "核对" : "同步"} ${Object.keys(foundations).length} 关概念：网页、讲义和导航一致。`);
