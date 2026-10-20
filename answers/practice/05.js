function loadTasks(text) {
  try {
    const value = JSON.parse(text);
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}
console.log("正常存档：", loadTasks('[{"title":"学习"}]'));
console.log("坏存档：", loadTasks('oops'));
