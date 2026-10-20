async function runPool(jobs, limit) {
  if (!Number.isSafeInteger(limit) || limit < 1) throw new Error("并发数必须是正安全整数");
  const results = new Array(jobs.length);
  let next = 0;
  async function worker() {
    while (next < jobs.length) {
      const index = next++;
      try {
        results[index] = { status: "fulfilled", value: await jobs[index]() };
      } catch (reason) {
        results[index] = { status: "rejected", reason };
      }
    }
  }
  await Promise.all(Array.from({length: Math.min(limit, jobs.length)}, () => worker()));
  return results;
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
