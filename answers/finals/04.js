function taskSummary(tasks) {
  return {
    pendingTitles: tasks.filter(task=>!task.done).map(task=>task.title),
    doneCount: tasks.filter(task=>task.done).length,
    totalCount: tasks.length,
  };
}
console.log(taskSummary([{title:"读 JS",done:false},{title:"喝水",done:true}]));
