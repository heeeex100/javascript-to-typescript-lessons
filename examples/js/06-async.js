function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function loadTasks(shouldFail = false) {
  await wait(20);
  if (shouldFail) throw new Error("模拟加载失败");
  return [{ id: 1, title: "学习异步", done: false }];
}

console.log("A：开始");
const promise = loadTasks(false);
console.log("B：请求已发起");
try {
  const tasks = await promise;
  console.log("C：拿到结果", tasks.length);
} catch (error) {
  console.log("加载错误：", error instanceof Error ? error.message : String(error));
}

try {
  await loadTasks(true);
} catch (error) {
  console.log("演示失败路径：", error instanceof Error ? error.message : String(error));
}
