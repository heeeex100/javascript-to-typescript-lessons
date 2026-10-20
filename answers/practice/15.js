function createLatestSearch(fetcher, render) {
  let latest = 0;
  return async function search(query) {
    const requestId = ++latest;
    render({ status: "loading", query });
    try {
      const items = await fetcher(query);
      if (requestId === latest) render({ status: "success", query, items });
    } catch (error) {
      if (requestId === latest) {
        render({ status: "error", query, error: error instanceof Error ? error.message : String(error) });
      }
    }
  };
}
const pending = new Map();
const search = createLatestSearch(query => new Promise(resolve => pending.set(query, resolve)), console.log);
const first = search("J");
const second = search("JS");
pending.get("JS")(["JS 新结果"]);
await second;
pending.get("J")(["J 旧结果"]);
await first;
