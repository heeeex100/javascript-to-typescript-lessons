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
    const local = current.lang === "ts";
    $("drill-code").readOnly = local;
    $("drill-actions").hidden = local;
    $("drill-local").hidden = !local;
    $("drill-command").textContent = `npm run drill -- ${id} --prepare\n# 编辑 ${current.file}，保存后执行：\nnpm run drill -- ${id} --check`;
    $("drill-location").textContent = local ? `这里是起点预览；编辑 ${current.file}，终端检查。` : "小练习与主挑战独立。网页 JS 小练习草稿单独保存在此浏览器，不包含在主挑战备份中。";
    $("drill-hint").textContent = current.hint;
    $("drill-answer").replaceChildren(WorkshopReader.render("```" + current.lang + "\n" + current.answer + "```\n\n" + current.explanation, location.href));
    for (const details of $("small-steps").querySelectorAll("details")) details.open = false;
    $("drill-output").textContent = "先运行看看，再改一处；检查反馈只针对这一步。";
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
    if (!current || current.lang !== "js") return;
    stop(); save(); const runId = token;
    const url = URL.createObjectURL(new Blob([WorkshopRunner.program], { type: "text/javascript" }));
    try { worker = new Worker(url); }
    catch (error) { $("drill-output").textContent = `无法启动小实验：${error.message}`; return; }
    finally { URL.revokeObjectURL(url); }
    $("drill-output").textContent = "";
    $("drill-run").disabled = true; $("drill-check").disabled = true; $("drill-stop").disabled = false;
    const append = text => { $("drill-output").textContent += text + "\n"; };
    worker.onmessage = ({ data }) => {
      if (runId !== token) return;
      if (data.type === "log") append(data.text);
      else if (data.type === "error") { append(data.text); stop(); }
      else if (data.type === "done") {
        append(checking ? "✓ 这一步通过。换一个输入再试，并说出为什么这样改。" : "运行完成。想确认是否达到目标，再点“检查这一步”。"); stop();
      }
    };
    worker.onerror = event => { if (runId === token) { append(event.message); stop(); } };
    timer = setTimeout(() => { if (runId === token) { append("超过 3 秒，已停止。请检查循环是否会结束。"); stop(); } }, 3000);
    worker.postMessage({ source: $("drill-code").value, checks: checking ? current.checks : "" });
  }
  $("drill-picker").onchange = event => choose(event.target.value);
  $("drill-code").oninput = () => { stop(); save(); $("drill-output").textContent = "代码改了，请重新运行或检查。"; };
  $("drill-run").onclick = () => run(false);
  $("drill-check").onclick = () => run(true);
  $("drill-stop").onclick = () => { stop(); $("drill-output").textContent += "\n已主动停止。"; };
  $("drill-next").onclick = () => {
    if (continueLesson) { continueLesson(); return; }
    const picker = $("drill-picker"); const option = picker.options[picker.selectedIndex + 1];
    if (option) choose(option.value);
  };
  return {
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
