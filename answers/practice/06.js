async function loadTasks() {
  await new Promise(resolve => setTimeout(resolve, 60));
  return ["写代码", "喝水"];
}
console.log("准备");
const request = loadTasks();
console.log("已下单");
const tasks = await request;
console.log("拿到", tasks.length, "项");
