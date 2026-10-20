async function loadTaskReport(loader) {
  // TODO：调用、等待、校验与失败反馈。
  return { status: "error", message: "加载失败" };
}
console.log(await loadTaskReport(async()=>["写代码","喝水"]));
