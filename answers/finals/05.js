function saveTasks(tasks) { return JSON.stringify(tasks); }
function loadTasks(text) {
  try {
    const value = JSON.parse(text);
    return Array.isArray(value) ? value : [];
  } catch { return []; }
}
console.log(loadTasks(saveTasks([{title:"学习",done:false}])));
