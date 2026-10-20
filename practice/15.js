function createLatestSearch(fetcher, render) {
  return async function search(query) {
    const items = await fetcher(query);
    render({ status: "success", query, items });
  };
}
// 使用手动控制的 Promise，稳定复现“后发先回”，无需真实网络。
const pending = new Map();
const search = createLatestSearch(query => new Promise(resolve => pending.set(query, resolve)), console.log);
const first = search("J");
const second = search("JS");
pending.get("JS")(["JS 新结果"]);
await second;
pending.get("J")(["J 旧结果"]);
await first;
