async function loadTaskReport(loader) {
  try {
    const items = await loader();
    if (!Array.isArray(items)) throw new Error("需要数组");
    return { status: "success", items, count: items.length };
  } catch { return { status: "error", message: "加载失败" }; }
}
console.log(await loadTaskReport(async()=>["写代码","喝水"]));
