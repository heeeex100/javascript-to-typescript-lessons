// 每段讲解独立呈现；示例改动在本次打开期间保留，不覆盖练习草稿。
globalThis.WorkshopLessonSteps = (() => {
  const running = new Set();
  const exampleDrafts = new Map();
  function stop() { for (const cancel of [...running]) cancel(); }
  function addRuns(body, lesson, step) {
    body.querySelectorAll('.lesson-code').forEach((box, number) => {
      const language = box.dataset.language;
      if (language !== "js") {
        if (["ts", "html"].includes(language)) {
          const note = document.createElement("p"); note.className = "example-local-note";
          note.textContent = `本段完整示例 · ${language === "ts" ? "TypeScript 在本地检查" : "HTML 在浏览器页面运行"}`;
          const details = document.createElement("details");
          const summary = document.createElement("summary"); summary.textContent = "如何运行这段代码";
          const instructions = document.createElement("p");
          instructions.textContent = `先运行 npm run concept -- ${lesson} --prepare，将本代码块完整复制到 practice/concepts/${lesson}.${language} 并保存。`;
          const command = document.createElement("p");
          command.textContent = language === "ts" ? `然后运行 npm run concept -- ${lesson} --local。普通 concept 命令运行第一段原例，不会读取你的修改。` : `在浏览器打开 practice/concepts/${lesson}.html；修改后刷新该页面。`;
          details.append(summary, instructions, command); box.prepend(note); box.append(details);
        }
        return;
      }
      const key = `${lesson}:${step}:${number}`;
      const pre = box.querySelector("pre");
      const code = pre.querySelector("code");
      const original = code.textContent;
      const editor = document.createElement("textarea");
      editor.className = "example-editor"; editor.spellcheck = false; editor.maxLength = 100000;
      editor.setAttribute("aria-label", `第 ${step + 1} 段示例 ${number + 1} 代码`);
      editor.value = exampleDrafts.get(key) ?? original;
      editor.rows = Math.min(16, Math.max(4, editor.value.split("\n").length + 1));
      editor.hidden = true; code.textContent = editor.value;
      const toolbar = document.createElement("div"); toolbar.className = "example-toolbar";
      const label = document.createElement("span"); label.textContent = "JavaScript · 可修改的示例";
      const edit = document.createElement("button"); edit.textContent = "修改例子";
      const copy = box.querySelector("button");
      toolbar.append(label, edit, copy);
      const actions = document.createElement("div"); actions.className = "example-actions";
      const button = document.createElement("button"); button.textContent = "运行这个例子"; button.className = "primary";
      const halt = document.createElement("button"); halt.textContent = "停止运行"; halt.disabled = true;
      const reset = document.createElement("button"); reset.textContent = "恢复示例";
      reset.disabled = editor.value === original;
      const note = document.createElement("p"); note.className = "quiet";
      note.textContent = "示例可自由试改，不影响下方小练习；刷新页面后示例恢复原样。";
      const output = document.createElement("pre"); output.hidden = true; output.setAttribute("role", "status");
      output.setAttribute("aria-live", "polite"); output.setAttribute("aria-label", "示例运行结果");
      let worker, timer, runId = 0;
      const cancel = () => {
        runId++; worker?.terminate(); worker = undefined; clearTimeout(timer);
        button.disabled = false; halt.disabled = true; running.delete(cancel);
        output.setAttribute("aria-busy", "false");
      };
      const feedback = (text, state = "") => {
        output.hidden = false; output.textContent = text; output.dataset.state = state;
        output.setAttribute("aria-busy", String(state === "running"));
      };
      edit.onclick = () => {
        editor.hidden = !editor.hidden; pre.hidden = !editor.hidden;
        edit.textContent = editor.hidden ? "修改例子" : "收起编辑";
        edit.setAttribute("aria-expanded", String(!editor.hidden));
        if (!editor.hidden) {
          editor.focus({ preventScroll: true });
          if (!matchMedia("(prefers-reduced-motion: reduce)").matches) editor.animate([{ opacity: 0.5 }, { opacity: 1 }], { duration: 120 });
        }
      };
      edit.setAttribute("aria-expanded", "false");
      editor.oninput = () => {
        cancel(); exampleDrafts.set(key, editor.value); code.textContent = editor.value;
        reset.disabled = editor.value === original;
        feedback("示例已修改，运行后查看新结果。");
      };
      reset.onclick = () => {
        cancel(); editor.value = original; code.textContent = original;
        exampleDrafts.delete(key); reset.disabled = true;
        feedback("已恢复原示例。");
      };
      halt.onclick = () => { cancel(); feedback("已停止示例运行。"); };
      button.onclick = () => {
        cancel(); const token = runId;
        button.disabled = true; halt.disabled = false;
        feedback("正在运行…", "running");
        let started = false;
        const append = text => {
          if (!started) { output.textContent = ""; started = true; }
          output.textContent += text + "\n";
        };
        const fail = text => { append(text); output.dataset.state = "error"; cancel(); };
        let url;
        try {
          url = URL.createObjectURL(new Blob([WorkshopRunner.program], { type: "text/javascript" }));
          worker = new Worker(url);
        } catch (error) { fail(`无法运行：${error.message}`); return; }
        finally { if (url) URL.revokeObjectURL(url); }
        running.add(cancel);
        worker.onmessage = ({ data }) => {
          if (token !== runId) return;
          if (data.type === "log") append(data.text);
          else if (data.type === "error") fail(data.text);
          else if (data.type === "done") {
            append(started ? "✓ 运行完成。" : "运行完成，没有打印内容。可以用 console.log(...) 查看结果。");
            output.dataset.state = "done"; cancel();
          }
        };
        worker.onerror = event => { if (token === runId) fail(event.message); };
        timer = setTimeout(() => { if (token === runId) fail("运行超过 3 秒，已停止。请检查循环或等待时间。"); }, 3000);
        worker.postMessage({ source: editor.value, checks: "" });
      };
      editor.onkeydown = event => {
        if ((event.ctrlKey || event.metaKey) && event.key === "Enter") { event.preventDefault(); button.click(); }
      };
      actions.append(button, halt, reset);
      box.prepend(toolbar); pre.after(editor); box.append(actions, note, output);
    });
  }
  return {
    stop,
    show(container, markdown, base, { lesson = "00", initialStep = 0, onStep, onComplete } = {}) {
      stop();
      const parts = markdown.split(/\n(?=#### )/);
      const intro = parts.shift();
      if (!parts.length) { container.replaceChildren(WorkshopReader.render(markdown, base)); return; }
      let index = Math.max(0, Math.min(parts.length - 1, initialStep));
      const heading = WorkshopReader.render(intro, base);
      const navigation = document.createElement("div"); navigation.className = "lesson-step-nav";
      const previous = document.createElement("button"); previous.textContent = "← 回看上一步";
      const selector = document.createElement("label"); selector.className = "step-selector";
      const caption = document.createElement("span"); caption.textContent = "当前讲解";
      const picker = document.createElement("select"); picker.id = "lesson-step-picker";
      parts.forEach((part, i) => {
        const option = document.createElement("option"); option.value = String(i);
        option.textContent = part.split("\n")[0].replace(/^####\s*/, ""); picker.append(option);
      });
      selector.append(caption, picker);
      const status = document.createElement("p"); status.className = "step-status"; status.setAttribute("aria-live", "polite");
      const next = document.createElement("button");
      const body = document.createElement("div"); body.className = "lesson-step-body"; body.tabIndex = -1;
      const locate = () => {
        body.focus({ preventScroll: true });
        navigation.scrollIntoView({ behavior: "instant", block: "start" });
      };
      const render = (move = false) => {
        stop(); picker.value = String(index); body.dataset.step = String(index);
        status.textContent = `讲解 ${index + 1} / ${parts.length}${index === parts.length - 1 ? " · 最后一段，接下来是综合大练习" : " · 本段下面有对应小练习"}`;
        previous.disabled = index === 0;
        next.textContent = index === parts.length - 1 ? "去做综合大练习 →" : "下一段讲解 →";
        body.replaceChildren(WorkshopReader.render(parts[index], base)); addRuns(body, lesson, index);
        onStep?.({ body, index, count: parts.length, next: advance });
        if (move) {
          locate();
          if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
            body.animate([{ opacity: 0.5, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 160 });
          }
        }
      };
      const advance = () => { if (index === parts.length - 1) onComplete?.(); else { index++; render(true); } };
      previous.onclick = () => { if (index > 0) { index--; render(true); } };
      next.onclick = advance;
      picker.onchange = () => { index = Number(picker.value); render(true); };
      navigation.append(previous, selector, next, status);
      container.replaceChildren(heading, navigation, body); render();
      return { locate };
    },
  };
})();
