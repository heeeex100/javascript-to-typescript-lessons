import { pendingTitles } from "./lib/tasks.js";

const text = '[{"id":1,"title":"学习模块","done":false}]';
const tasks = JSON.parse(text);
console.log("待办：", pendingTitles(tasks));
console.log("转回文本：", JSON.stringify(tasks));
try {
  JSON.parse("这不是 JSON");
} catch (error) {
  console.log("捕获解析失败：", error instanceof Error ? error.message : String(error));
}
