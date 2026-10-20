// 概念原稿中的 drill 标记决定小题出现的位置；网页与讲义共享同一安排。
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import "../workshop/labs.js";
import "../workshop/advanced-labs.js";
import "../workshop/finals.js";
import "../workshop/drills.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const checking = process.argv.includes("--check");
const foundations = {};
async function update(relative, expected) {
  const file = path.join(root, relative);
  const actual = await readFile(file, "utf8").catch(error => {
    if (error.code === "ENOENT") return "";
    throw error;
  });
  if (actual === expected) return;
  if (checking) throw new Error(`${relative} 内容未同步，请运行 npm run sync:concepts`);
  await writeFile(file, expected);
}
function drillMarkdown(item) {
  return `##### 就地小练习 ${item.id} · ${item.title}\n\n${item.prompt}\n\n\`\`\`${item.lang}\n${item.starter.trim()}\n\`\`\`\n\n网页中在这一段下面直接练习。本地运行 \`npm run drill -- ${item.id} --prepare\`，编辑 \`${item.file}\`，再运行 \`npm run drill -- ${item.id} --check\`。\n\n<details>\n<summary>一点提示</summary>\n\n${item.hint}\n\n</details>\n\n<details>\n<summary>试过后再看解释</summary>\n\n\`\`\`${item.lang}\n${item.answer.trim()}\n\`\`\`\n\n${item.explanation}\n\n</details>`;
}
for (const lab of globalThis.learningLabs) {
  const source = await readFile(path.join(root, "reference", "foundations", `${lab.id}.md`), "utf8");
  foundations[lab.id] = source;
  const units = source.split(/\n(?=#### )/).slice(1);
  const drills = learningDrills.filter(item => item.lesson === lab.id);
  if (units.length !== drills.length) throw new Error(`${lab.id} 讲解段落与小题数量不一致`);
  units.forEach((unit, index) => {
    const marks = [...unit.matchAll(/<!-- drill:(\d{2}-\d{2}) -->/g)];
    if (marks.length !== 1 || !drills.some(d => d.id === marks[0][1] && d.teachingStep === index + 1)) {
      throw new Error(`${lab.id} 第 ${index + 1} 段的小题对应关系错误`);
    }
  });
  const interleaved = source.replace(/<!-- drill:(\d{2}-\d{2}) -->/g, (_marker, id) => drillMarkdown(drills.find(d => d.id === id)));
  const answer = lab.answerFile ?? `answers/practice/${lab.id}.${lab.lang}`;
  const location = lab.lang === "dom"
    ? `编辑 [${lab.file}](../${lab.file})，在浏览器打开 [综合任务页面](../${lab.page})，保存后刷新。`
    : `编辑 [${lab.file}](../${lab.file})，在项目根目录执行：\n\n\`\`\`sh\nnpm run lab -- ${lab.id}\nnpm run lab -- ${lab.id} --check\n\`\`\``;
  const requirements = (lab.requirements ?? [lab.goal]).map(text => `- ${text}`).join("\n");
  const examples = lab.examples ? `\n### 输入与预期结果\n\n${lab.examples}\n` : "";
  const hints = lab.steps.map((text, i) => `${i + 1}. ${text}`).join("\n");
  const article = `# ${lab.id} · ${lab.title}\n\n本关按“讲解一段 → 就地小练习”学习，最后完成综合大练习。\n\n<!-- foundations:start -->\n## 边看边练\n\n${interleaved.trim()}\n<!-- foundations:end -->\n\n## 综合大练习：${lab.finalTitle}\n\n**${lab.goal}**\n\n### 完成要求\n\n${requirements}\n${examples}\n### 在哪里写、怎么验收\n\n${location}\n\n起点只提供数据或函数外壳，需要自己把本关学过的动作组合起来。已有的旧版 practice 文件仍保留，新的基础综合题使用 practice/finals 目录。网页草稿与本地文件独立。\n\n<details>\n<summary>卡住时，再看解题思路</summary>\n\n${hints}\n\n${lab.hint}\n\n</details>\n\n<details>\n<summary>完成后复盘：这道题用到了什么</summary>\n\n${lab.concept}\n\n</details>\n\n### 完成后再加一个需求\n\n${lab.extension}\n\n扩展不计入本关基础验收。\n\n<details>\n<summary>已经独立尝试，再看完整参考</summary>\n\n[综合大练习参考](../${answer})${lab.answerPage ? ` · [参考页面](../${lab.answerPage})` : ""}\n\n</details>\n\n[返回教学目录](../README.md)。\n`;
  await update(lab.lesson, article);
}
await update("workshop/foundations.js", "// 由 npm run sync:concepts 生成，请编辑 reference/foundations/*.md。\n" +
  "globalThis.WorkshopFoundations = " + JSON.stringify(foundations, null, 2) + ";\n");
const links = learningLabs.map(lab => `| [${lab.id}](../${lab.lesson}) | ${foundations[lab.id].split("\n")[0].replace(/^### /, "")} | ${learningDrills.filter(d=>d.lesson===lab.id).length} | ${lab.finalTitle} |`).join("\n");
await update("reference/概念导航.md", `# 学习路线：讲一段，就练一下，最后做综合题\n\n每段讲解正下方都有对应小题，不再集中到最后。做完一小题后可以进入下一段；最后把本关知识组合成一个完整任务。第 02 关有六段，其余关各三段，共 ${learningDrills.length} 道就地小练习和 19 个综合大练习。\n\nJS 在网页里编辑、运行、检查；TS 小题用 npm run drill -- 08-01 --prepare 创建文件，修改后用 npm run drill -- 08-01 --check。综合题用 npm run lab -- 08 --check。基础综合题文件在 practice/finals；旧文件继续保留。\n\n| 关卡 | 先讲什么 | 小题数量 | 最后的综合题 |\n| --- | --- | --- | --- |\n${links}\n`);
console.log(`已${checking ? "核对" : "同步"} 19 关：${learningDrills.length} 道小题逐段对应，最后是综合大练习。`);
