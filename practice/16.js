async function runPool(jobs, limit) {
  // Promise.allSettled 会等全部结果，但这里仍会一下启动所有任务。
  return Promise.allSettled(jobs.map(job => job()));
}
let active = 0;
const jobs = [0,1,2,3,4].map(id => async () => {
  active++;
  console.log("开始", id, "同时运行", active);
  await new Promise(resolve => setTimeout(resolve, 15));
  active--;
  if (id === 2) throw new Error("第三项失败");
  return id * 10;
});
console.log(await runPool(jobs, 2));
