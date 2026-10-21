import { saveTasks, loadTasks } from "./storage.js";
const tasks = [{title:"学习",done:false}];
console.log(loadTasks(saveTasks(tasks)));
for (const text of ["oops", "null", "{}"]) console.log(text, loadTasks(text));
