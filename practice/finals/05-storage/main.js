import { saveTasks, loadTasks } from "./storage.js";
const tasks = [{ title: "学习", done: false }];
console.log(loadTasks(saveTasks(tasks)));
// TODO：再调用 loadTasks 观察坏文本、null 和对象文本。
