function renameTasks(tasks, id, title) {
  return tasks.map(task => {
    if (task.id === id) return { ...task, title: title };
    return task;
  });
}
function taskSummary(tasks) {
  return {
    pendingTitles: tasks.filter(task => !task.done).map(task => task.title),
    doneCount: tasks.filter(task => task.done).length,
    totalCount: tasks.length,
  };
}
const before = [{id:1,title:"读 JS",done:false},{id:2,title:"喝水",done:true}];
const after = renameTasks(before,1,"练 JS");
console.log(before, after, taskSummary(after));
