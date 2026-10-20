// 概念原稿只维护 reference/foundations/*.md；此脚本同步网页及独立讲义。
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import "../workshop/labs.js";
import "../workshop/advanced-labs.js";
import "../workshop/drills.js";

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
  const drills = globalThis.learningDrills.filter(item => item.lesson === lab.id);
  const practice = drills.map(item => `### ${item.id} · ${item.title}\n\n${item.prompt}\n\n\`\`\`${item.lang}\n${item.starter.trim()}\n\`\`\`\n\n在实验台选择这道小题，或运行 \`npm run drill -- ${item.id} --prepare\` 后编辑 \`${item.file}\`，再运行 \`npm run drill -- ${item.id} --check\`。\n\n<details>\n<summary>一点提示</summary>\n\n${item.hint}\n\n</details>\n\n<details>\n<summary>试过后再看解释</summary>\n\n\`\`\`${item.lang}\n${item.answer.trim()}\n\`\`\`\n\n${item.explanation}\n\n</details>\n`).join("\n");
  const section = `${start}\n## 一步一步看懂，再拆开练\n\n一次只看一小步。先运行具体代码、逐行看值怎样变化，做几个小练习后再组合成主挑战。\n\n${source.trim()}\n## 本关小步练习\n\n${practice}\n${end}\n\n`;
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
await update("reference/概念导航.md", `# 学习路线：先看具体代码，再做一小步\n\n19 关讲解已拆成五步：看一个例子 → 逐行追踪值 → 改一个地方 → 分开练 → 最后认识名称。实验台每次只展示一步，可前后翻看；完整讲义包含全部内容。\n\n共有 ${globalThis.learningDrills.length} 道带运行检查的小练习。第 02 关有六道，从“加一次”逐渐到“带条件循环”；其余关各三道。先做小题，再做原有主挑战。用 npm run drill -- 02-01 --prepare 创建本地小题，修改后用 npm run drill -- 02-01 --check；网页 JS 小题可直接编辑。\n\n原例仍可用 npm run concept -- 关卡编号 运行；加 --prepare 创建独立实验文件，加 --local 运行修改版本。TS 先 npm ci，07 的真实 DOM 在浏览器操作。\n\n| 关卡与完整讲义 | 这一关先弄懂什么 |\n| --- | --- |\n${links}\n\nreference 目录中原有 00–12 材料保留为语法查阅资料，不必先读完。\n`);
console.log(`已${checking ? "核对" : "同步"} ${Object.keys(foundations).length} 关概念：网页、讲义和导航一致。`);
