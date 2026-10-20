// 一次只显示一小步；JS 例子就地运行，完整讲义仍保留全部内容。
globalThis.WorkshopLessonSteps = (() => {
  const running = new Set();
  function stop() { for (const cancel of [...running]) cancel(); }
  function addRuns(body) {
    for (const box of body.querySelectorAll('.lesson-code[data-language="js"]')) {
      const button = document.createElement("button"); button.textContent = "运行这个例子";
      const output = document.createElement("pre"); output.hidden = true; output.setAttribute("role", "status");
      button.onclick = () => {
        button.disabled = true; output.hidden = false; output.textContent = "";
        let worker, timer;
        const cancel = () => {
          worker?.terminate(); clearTimeout(timer); button.disabled = false; running.delete(cancel);
        };
        const append = text => { output.textContent += text + "\n"; };
        const url = URL.createObjectURL(new Blob([WorkshopRunner.program], { type: "text/javascript" }));
        try { worker = new Worker(url); }
        catch (error) { append(`无法运行：${error.message}`); cancel(); return; }
        finally { URL.revokeObjectURL(url); }
        running.add(cancel);
        worker.onmessage = ({ data }) => {
          if (data.type === "log") append(data.text);
          else if (data.type === "error") { append(data.text); cancel(); }
          else if (data.type === "done") { if (!output.textContent) append("运行完成，没有打印内容。"); cancel(); }
        };
        worker.onerror = event => { append(event.message); cancel(); };
        timer = setTimeout(() => { append("运行超过 3 秒，已停止。"); cancel(); }, 3000);
        worker.postMessage({ source: box.querySelector("pre code").textContent, checks: "" });
      };
      box.append(button, output);
    }
  }
  return {
    stop,
    show(container, markdown, base, { onStep, onComplete } = {}) {
      stop();
      const parts = markdown.split(/\n(?=#### )/);
      const intro = parts.shift();
      if (!parts.length) { container.replaceChildren(WorkshopReader.render(markdown, base)); return; }
      let index = 0;
      const heading = WorkshopReader.render(intro, base);
      const navigation = document.createElement("div"); navigation.className = "lesson-step-nav";
      const previous = document.createElement("button"); previous.textContent = "← 回看上一步";
      const status = document.createElement("span"); status.setAttribute("aria-live", "polite");
      const next = document.createElement("button"); next.textContent = "下一小步 →";
      const body = document.createElement("div"); body.className = "lesson-step-body";
      const render = () => {
        stop();
        status.textContent = `${index + 1} / ${parts.length}`;
        previous.disabled = index === 0;
        next.textContent = index === parts.length - 1 ? "去做综合大练习 →" : "下一段讲解 →";
        body.replaceChildren(WorkshopReader.render(parts[index], base)); addRuns(body);
        onStep?.({ body, index, count: parts.length, next: advance });
      };
      const advance = () => { if (index === parts.length - 1) onComplete?.(); else { index++; render(); } };
      previous.onclick = () => { index--; render(); };
      next.onclick = advance;
      navigation.append(previous, status, next);
      container.replaceChildren(heading, navigation, body); render();
    },
  };
})();
