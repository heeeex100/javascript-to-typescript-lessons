function loadTasks(text) {
  return JSON.parse(text);
}
console.log("正常存档：", loadTasks('[{"title":"学习"}]'));
console.log("坏存档：", loadTasks('oops'));
