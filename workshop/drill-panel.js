globalThis.WorkshopMini = (() => {
  const $ = id => document.getElementById(id);
  const key = "js-ts-workshop-small-steps-v1";
  let drafts = {};
  let canSave = true;
  try {
    const raw = JSON.parse(localStorage.getItem(key) ?? "{}");
    for (const item of globalThis.learningDrills) {
      if (item.lang === "js" && typeof raw?.[item.id] === "string" && raw[item.id].length <= 100000) {
        drafts[item.id] = raw[item.id];
      }
    }
  } catch { canSave = false; }
  let current, worker, timer, token = 0, continueLesson;
  function feedback(text, state = "") {
    $("drill-output").textContent = text;
    $("drill-output").dataset.state = state;
    $("drill-output").setAttribute("aria-busy", String(state === "running"));
    $("drill-next").classList.toggle("primary", state === "passed");
  }
  function stop() {
    token++; worker?.terminate(); worker = null; clearTimeout(timer);
    $("drill-run").disabled = false; $("drill-check").disabled = false; $("drill-stop").disabled = true;
  }
  function choose(id) {
    stop(); current = learningDrills.find(item => item.id === id);
    $("drill-picker").value = id;
    $("drill-title").textContent = "就地小练习 · " + current.title;
    $("drill-prompt").textContent = current.prompt;
    $("drill-code").value = drafts[id] ?? current.starter;
    const local = current.lang === "ts" || current.local;
    $("drill-code").readOnly = local;
    $("drill-actions").hidden = local;
    $("drill-local").hidden = !local;
    $("drill-command").textContent = `npm run drill -- ${id} --prepare\n# 编辑 ${current.file}，保存后执行：\nnpm run drill -- ${id} --check` + (current.debugCommand ? `\n\n# 观察断点：\n${current.debugCommand}` : "");
    $("drill-location").textContent = local ? `这里是起点预览；编辑 ${current.file}，终端检查。` : canSave ? "小练习草稿自动保存，已包含在学习备份中。示例试改和本题代码相互独立。" : "当前无法保存小练习草稿，请下载代码或导出学习备份。";
    $("drill-hint").textContent = current.hint;
    const companions = Object.entries(current.files ?? {}).map(([name, source]) => `\n\n配套文件 ${name}：\n\n\`\`\`js\n${source}\`\`\``).join("");
    $("drill-answer").replaceChildren(WorkshopReader.render("```" + current.lang + "\n" + current.answer + "```\n\n" + current.explanation + companions, location.href));
    for (const details of $("small-steps").querySelectorAll("details")) details.open = false;
    feedback(local ? (current.localNote ?? "按上面的命令准备文件，修改后在终端检查。") : "运行结果会显示在这里。");
    $("drill-next").disabled = !continueLesson && !$("drill-picker").options[$("drill-picker").selectedIndex + 1];
    $("drill-next").textContent = "继续学习 →";
  }
  function save() {
    drafts[current.id] = $("drill-code").value;
    if (canSave) {
      try { localStorage.setItem(key, JSON.stringify(drafts)); }
      catch { canSave = false; }
    }
    if (!canSave) $("drill-location").textContent = "当前无法保存小练习草稿，请在离开前复制代码到自己的文件。";
  }
  function run(checking) {
    if (!current || current.lang !== "js" || current.local) return;
    stop(); save(); const runId = token;
    const url = URL.createObjectURL(new Blob([WorkshopRunner.program], { type: "text/javascript" }));
    try { worker = new Worker(url); }
    catch (error) { feedback(`无法启动小实验：${error.message}`, "error"); return; }
    finally { URL.revokeObjectURL(url); }
    feedback(checking ? "正在运行并检查…" : "正在运行…", "running");
    $("drill-run").disabled = true; $("drill-check").disabled = true; $("drill-stop").disabled = false;
    let started = false;
    const append = text => {
      if (!started) { $("drill-output").textContent = ""; started = true; }
      $("drill-output").textContent += text + "\n";
    };
    const finish = state => {
      $("drill-output").dataset.state = state;
      $("drill-next").classList.toggle("primary", state === "passed");
      $("drill-output").setAttribute("aria-busy", "false"); stop();
    };
    worker.onmessage = ({ data }) => {
      if (runId !== token) return;
      if (data.type === "log") append(data.text);
      else if (data.type === "error") { append(data.text); finish("error"); }
      else if (data.type === "done") {
        append(checking ? "✓ 这一步通过。可以继续学习，也可以换输入再验证。" : "运行完成。"); finish(checking ? "passed" : "done");
      }
    };
    worker.onerror = event => { if (runId === token) { append(event.message); finish("error"); } };
    timer = setTimeout(() => { if (runId === token) { append("超过 3 秒，已停止。请检查循环是否会结束。"); finish("error"); } }, 3000);
    worker.postMessage({ source: $("drill-code").value, checks: checking ? current.checks : "" });
  }
  $("drill-picker").onchange = event => choose(event.target.value);
  $("drill-code").oninput = () => { stop(); save(); feedback("代码改了，请重新运行或检查。"); };
  $("drill-run").onclick = () => run(false);
  $("drill-check").onclick = () => run(true);
  $("drill-stop").onclick = () => { stop(); feedback("已主动停止，本次没有完成检查。"); };
  $("drill-download").onclick = () => globalThis.WorkshopDownload(`${current.id}.js`, $("drill-code").value, "text/javascript;charset=utf-8");
  $("drill-reset").onclick = () => globalThis.WorkshopConfirmReset("恢复这道小练习的起始代码？当前草稿将被替换，可先下载代码。", () => {
    stop(); $("drill-code").value = current.starter; save();
    feedback("已恢复小练习起点。"); $("drill-code").focus();
  });
  $("drill-code").onkeydown = event => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") { event.preventDefault(); run(event.shiftKey); }
  };
  $("drill-next").onclick = () => {
    if (continueLesson) { continueLesson(); return; }
    const picker = $("drill-picker"); const option = picker.options[picker.selectedIndex + 1];
    if (option) choose(option.value);
  };
  return {
    getDrafts() { return { ...drafts }; },
    replaceDrafts(next) {
      drafts = { ...next };
      try { localStorage.setItem(key, JSON.stringify(drafts)); canSave = true; }
      catch { canSave = false; }
    },
    select(lesson, step, onContinue) {
      continueLesson = onContinue;
      const items = learningDrills.filter(item => item.lesson === lesson && (step === undefined || item.teachingStep === step));
      $("drill-picker").hidden = items.length <= 1;
      document.querySelector('label[for="drill-picker"]').hidden = items.length <= 1;
      $("small-steps").hidden = !items.length;
      $("drill-picker").replaceChildren(...items.map((item, i) => {
        const option = document.createElement("option"); option.value = item.id;
        option.textContent = `${i + 1}. ${item.title}`; return option;
      }));
      if (items.length) choose(items[0].id); else stop();
    },
    stop,
  };
})();
