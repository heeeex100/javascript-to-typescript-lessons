import { parseTasks } from "./validation.js";
import { addTask, completeTask, pendingTitles } from "./service.js";

function main(): void {
  const loaded = parseTasks('[{"id":1,"title":"复习 JS","done":false}]');
  if (!loaded.ok) {
    console.log("加载失败：", loaded.error);
    return;
  }
  let tasks = loaded.value;
  const added = addTask(tasks, "练习联合类型");
  if (!added.ok) {
    console.log("添加失败：", added.error);
    return;
  }
  tasks = added.value;
  const completed = completeTask(tasks, 1);
  if (!completed.ok) {
    console.log("完成失败：", completed.error);
    return;
  }
  tasks = completed.value;
  console.log("全部任务：", tasks);
  console.log("待办标题：", pendingTitles(tasks));
  console.log("空标题演示：", addTask(tasks, "   "));
  console.log("无效数据演示：", parseTasks('[{"id":2,"title":"错误示例","done":"false"}]'));
}
main();
