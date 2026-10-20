const labs = globalThis.learningLabs;
const State = globalThis.WorkshopState;
const $ = id => document.getElementById(id);
const storageKey = "js-ts-workshop-v1";
let canSave = true;
let stored = {};
let recoveryMessage = "";
try {
  const text = localStorage.getItem(storageKey);
  try { stored = JSON.parse(text ?? "{}"); }
  catch {
    // 保留损坏的原始记录，避免第一次导航就直接覆盖它。
    localStorage.setItem(storageKey + "-recovery", text);
    recoveryMessage = "旧记录格式有误，原始记录已保留；可导入学习备份恢复。";
  }
} catch { canSave = false; }
let state = State.normalize(labs, stored);
if (!recoveryMessage && stored?.passed && Object.values(stored.passed).some(value => value === true)) {
  recoveryMessage = "旧版草稿已保留；旧通关标记需要重新点击“检查挑战”确认。";
}
let current;
let worker;
let timeout;
let runToken = 0;
let pendingImport;
let readerToken = 0;
const lastTrack = { basic: "00", advanced: "13" };

function save() {
  try { localStorage.setItem(storageKey, JSON.stringify(state)); canSave = true; }
  catch { canSave = false; }
  updateDraftNote();
}
function updateDraftNote() {
  if (!current) return;
  $("draft-note").textContent = current.lang === "js"
    ? (canSave ? "草稿保存在此浏览器；可下载代码或导出备份。Ctrl / ⌘ + Enter 运行，加 Shift 检查。"
      : "草稿暂时无法保存，关闭前请下载代码或导出备份。")
    : `编辑 ${current.file}；这里显示起始代码，不会随本地修改同步。`;
}
function setStatus(text, kind = "") {
  $("status").textContent = text;
  $("status").dataset.state = kind;
}
function stop() {
  runToken++;
  worker?.terminate();
  worker = undefined;
  clearTimeout(timeout);
  $("run").disabled = false;
  $("check").disabled = false;
  $("stop").disabled = true;
}
function updateLines() {
  $("line-numbers").textContent = Array.from({ length: $("code").value.split("\n").length }, (_, i) => i + 1).join("\n");
  $("line-numbers").scrollTop = $("code").scrollTop;
}
function updateProgress() {
  const jsLabs = labs.filter(lab => lab.lang === "js" && Boolean(lab.advanced) === Boolean(current.advanced));
  const total = jsLabs.filter(lab => State.isPassed(state, lab)).length;
  $("progress").textContent = `${current.advanced ? "进阶" : "基础"}网页挑战：${total} / ${jsLabs.length} 关已通过；TS 在终端检查`;
  $("basic-track").setAttribute("aria-pressed", String(!current.advanced));
  $("advanced-track").setAttribute("aria-pressed", String(Boolean(current.advanced)));
  for (const button of $("lessons").children) {
    const lab = labs.find(lab => lab.id === button.dataset.id);
    button.hidden = Boolean(lab.advanced) !== Boolean(current.advanced);
    button.setAttribute("aria-current", button.dataset.id === current.id ? "step" : "false");
    button.querySelector(".lesson-name").textContent = (State.isPassed(state, lab) ? "✓ " : "") + lab.title;
  }
}
function select(id, historyMode = "push") {
  stop();
  current = labs.find(lab => lab.id === id) ?? labs[0];
  if (location.hash !== "#" + current.id) {
    history[historyMode === "replace" ? "replaceState" : "pushState"](null, "", "#" + current.id);
  }
  state.lastLesson = current.id;
  lastTrack[current.advanced ? "advanced" : "basic"] = current.id;
  $("eyebrow").textContent = `${current.advanced ? "进阶挑战 · " : ""}第 ${current.id} 关 / ${current.lang === "ts" ? "用 TypeScript 检查自己的代码" : current.lang === "dom" ? "让代码改变页面" : "在具体问题里学习 JavaScript"}`;
  $("title").textContent = current.title;
  $("goal").textContent = current.goal;
  globalThis.WorkshopLessonSteps.show($("foundations-content"),
    globalThis.WorkshopFoundations[current.id], new URL("../" + current.lesson, location.href).href);
  globalThis.WorkshopMini.select(current.id);
  $("foundations-panel").open = true;
  $("concept-command").textContent = `npm run concept -- ${current.id}${current.lang === "dom" ? " --prepare" : ""}`;
  $("language").textContent = current.lang === "ts" ? "TypeScript · 本地编译" : current.lang === "dom" ? "浏览器 DOM" : "JavaScript · 可编辑";
  const interactive = current.lang === "js";
  $("code").readOnly = !interactive;
  $("code").value = interactive ? state.drafts[current.id] ?? current.starter : current.starter;
  $("code").scrollTop = 0;
  $("editor-label").textContent = interactive ? "你的实验代码" : "起始代码预览 · 请编辑本地文件";
  $("js-controls").hidden = !interactive;
  $("local-controls").hidden = interactive;
  $("steps").replaceChildren(...current.steps.map(text => {
    const li = document.createElement("li"); li.textContent = text; return li;
  }));
  for (const key of ["hint", "concept", "extension"]) $(key).textContent = current[key];
  for (const details of document.querySelectorAll(".guide-panel details")) details.open = false;
  $("requirements-panel").hidden = !current.advanced;
  $("requirements-panel").open = Boolean(current.advanced);
  $("requirements").replaceChildren(...(current.requirements ?? []).map(text => {
    const item = document.createElement("li"); item.textContent = text; return item;
  }));
  $("lesson-link").href = "../" + current.lesson;
  $("file-link").href = "../" + (current.lang === "dom" ? "practice/07-dom/index.html" : current.file);
  $("file-link").textContent = current.lang === "dom" ? "打开要修改的任务页面 →" : "查看本关练习文件 →";
  $("local-note").textContent = current.lang === "dom" ? "打开任务页面，在编辑器修改 app.js，保存后刷新观察剩余数量。" : "在编辑器打开练习文件，用终端里的真实 tsc 检查。网页不模拟 TypeScript 编译。";
  $("command").textContent = current.lang === "dom" ? "practice/07-dom/app.js" : `npm run lab -- ${current.id}\nnpm run lab -- ${current.id} --check`;
  $("output").textContent = interactive ? "先猜猜输出，再点击运行。" : "本关的结果在浏览器任务页面或终端中查看。";
  setStatus(interactive ? (State.isPassed(state, current) ? "此草稿上次检查通过" : "等你运行") : "切换到实际操作");
  $("next").disabled = current === labs.at(-1);
  $("previous").disabled = current === labs[0];
  updateLines(); updateProgress(); save();
}
function edited() {
  stop();
  state.drafts[current.id] = $("code").value;
  delete state.passed[current.id];
  save(); updateProgress(); updateLines();
  setStatus("代码有改动，输出是上次结果；请重新运行");
}
function run(checking) {
  if (current.lang !== "js") return;
  stop();
  const token = runToken;
  const lab = current;
  const source = $("code").value;
  state.drafts[lab.id] = source;
  if (checking) delete state.passed[lab.id];
  save(); updateProgress();
  $("output").textContent = "";
  setStatus(checking ? "正在运行并检查…" : "正在运行…");
  $("run").disabled = true;
  $("check").disabled = true;
  $("stop").disabled = false;
  let url;
  try {
    url = URL.createObjectURL(new Blob([globalThis.WorkshopRunner.program], { type: "text/javascript" }));
    worker = new Worker(url);
  } catch (error) {
    stop();
    $("output").textContent = `无法启动实验：${error.message}\n请运行 npm run workshop，再通过本机网址打开。`;
    setStatus("当前浏览器限制了运行", "error"); return;
  } finally { if (url) URL.revokeObjectURL(url); }
  const append = text => { $("output").textContent += text + "\n"; };
  worker.onmessage = ({ data }) => {
    if (token !== runToken) return;
    if (data.type === "log") append(data.text);
    else if (data.type === "error") {
      append(data.text); setStatus("找到一个可以修的小问题", "error"); stop();
    } else if (data.type === "done") {
      if (checking) {
        state.passed[lab.id] = { source, checks: lab.checks };
        save(); updateProgress();
        append("✓ 本关验收通过。再试一个不同输入，看看你的理解是否成立。");
      }
      setStatus(checking ? "检查通过" : "运行完成 · 还可以检查挑战", checking ? "passed" : ""); stop();
    }
  };
  worker.onerror = event => {
    if (token !== runToken) return;
    append(event.message); setStatus("运行出错", "error"); stop();
  };
  timeout = setTimeout(() => {
    if (token !== runToken) return;
    append("运行超过 3 秒，已停止。看看是不是循环没有结束，或等待时间太长。");
    setStatus("已停止，页面仍可继续使用", "error"); stop();
  }, 3000);
  worker.postMessage({ source, checks: checking ? lab.checks : "" });
}
function download(name, text, type) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const link = document.createElement("a"); link.href = url; link.download = name;
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
async function openLesson(url) {
  const token = ++readerToken;
  $("reader-title").textContent = "动手指导";
  $("reader-content").textContent = "正在打开指导…";
  if (!$("lesson-dialog").open) $("lesson-dialog").showModal();
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("读取失败");
    const text = await response.text();
    if (token !== readerToken) return;
    $("reader-content").replaceChildren(globalThis.WorkshopReader.render(text, url));
    $("reader-content").scrollTop = 0;
  } catch {
    if (token !== readerToken) return;
    const note = document.createElement("p"); note.textContent = "无法读取指导。可以启动 npm run workshop 后重试，或直接打开原文件：";
    const link = document.createElement("a"); link.href = url; link.textContent = "打开指导文件";
    $("reader-content").replaceChildren(note, link);
  }
}

for (const lesson of labs) {
  const button = document.createElement("button"); button.type = "button"; button.dataset.id = lesson.id;
  const number = document.createElement("span"); number.textContent = lesson.id;
  const title = document.createElement("span"); title.className = "lesson-name"; title.textContent = lesson.title;
  button.append(number, title); button.addEventListener("click", () => select(lesson.id));
  $("lessons").append(button);
}
$("basic-track").addEventListener("click", () => select(lastTrack.basic));
$("advanced-track").addEventListener("click", () => select(lastTrack.advanced));
$("run").addEventListener("click", () => run(false));
$("check").addEventListener("click", () => run(true));
$("stop").addEventListener("click", () => { stop(); setStatus("已手动停止，本次没有完成验收"); });
$("code").addEventListener("input", edited);
$("code").addEventListener("scroll", () => { $("line-numbers").scrollTop = $("code").scrollTop; });
$("code").addEventListener("keydown", event => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") { event.preventDefault(); run(event.shiftKey); }
  // Tab 保留浏览器默认焦点移动，避免键盘用户被困在编辑框中。
});
$("download-code").addEventListener("click", () => download(`${current.id}.js`, $("code").value, "text/javascript;charset=utf-8"));
$("export-backup").addEventListener("click", () => {
  download("js-ts-learning-backup.json", State.exportBackup(labs, state), "application/json");
  $("backup-feedback").textContent = "已导出网页草稿与验收记录。在另一台电脑使用“导入学习备份”恢复。";
});
$("import-backup").addEventListener("click", () => $("backup-file").click());
$("backup-file").addEventListener("change", async event => {
  const file = event.target.files[0]; event.target.value = "";
  if (!file) return;
  try {
    if (file.size > State.MAX_BACKUP) throw new Error("备份超过 2 MB，请选择实验台导出的 JSON。");
    pendingImport = State.parseBackup(labs, await file.text());
    const { counts } = State.planImport(labs, state, pendingImport);
    $("import-summary").textContent = `新增 ${counts.added} 关草稿，相同 ${counts.unchanged} 关，冲突 ${counts.conflicts} 关。默认跳过冲突，保留本机内容。`;
    $("overwrite-drafts").checked = false;
    $("import-dialog").showModal();
  } catch (error) { pendingImport = undefined; $("backup-feedback").textContent = error.message; }
});
$("confirm-import").addEventListener("click", () => {
  if (!pendingImport) return;
  stop();
  const resume = Object.keys(state.drafts).length === 0 ? pendingImport.lastLesson : current.id;
  const plan = State.planImport(labs, state, pendingImport, $("overwrite-drafts").checked);
  state = plan.state; save();
  pendingImport = undefined; $("import-dialog").close(); select(resume, "replace");
  $("backup-feedback").textContent = `已导入 ${plan.counts.added} 关，替换 ${plan.counts.replaced} 关，保留 ${plan.counts.conflicts - plan.counts.replaced} 关冲突草稿。`;
});
$("cancel-import").addEventListener("click", () => $("import-dialog").close());
$("import-dialog").addEventListener("close", () => { pendingImport = undefined; });
$("reset").addEventListener("click", () => {
  if (!confirm("把本关网页草稿恢复到起始代码？建议先下载代码或导出学习备份。")) return;
  delete state.drafts[current.id]; delete state.passed[current.id]; save(); select(current.id, "replace");
});
$("next").addEventListener("click", () => select(labs[Math.min(labs.indexOf(current) + 1, labs.length - 1)].id));
$("previous").addEventListener("click", () => select(labs[Math.max(labs.indexOf(current) - 1, 0)].id));
$("lesson-link").addEventListener("click", event => { event.preventDefault(); openLesson(event.currentTarget.href); });
$("foundations-index").addEventListener("click", event => { event.preventDefault(); openLesson(event.currentTarget.href); });
$("reader-content").addEventListener("click", event => {
  const link = event.target.closest("a");
  if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  const url = new URL(link.href);
  if (url.origin === location.origin && url.pathname.endsWith(".md")) { event.preventDefault(); openLesson(url.href); }
});
$("close-reader").addEventListener("click", () => $("lesson-dialog").close());
$("lesson-dialog").addEventListener("close", () => { readerToken++; });
window.addEventListener("hashchange", () => select(location.hash.slice(1), "replace"));
select(location.hash.slice(1) || state.lastLesson, "replace");
$("backup-feedback").textContent = recoveryMessage;
