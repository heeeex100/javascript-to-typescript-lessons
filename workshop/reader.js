// 只渲染课程用到的 Markdown 子集；文本一律通过 DOM 节点插入，不执行原始 HTML。
globalThis.WorkshopReader = (() => {
  const safeUrl = (value, base) => {
    try {
      const url = new URL(value, base);
      return ["http:", "https:", "file:"].includes(url.protocol) ? url.href : null;
    } catch { return null; }
  };
  function inline(parent, text, base) {
    const pattern = /(`[^`]+`|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g;
    let start = 0;
    for (const match of text.matchAll(pattern)) {
      parent.append(document.createTextNode(text.slice(start, match.index)));
      const token = match[0];
      if (token.startsWith("`")) {
        const code = document.createElement("code"); code.textContent = token.slice(1, -1); parent.append(code);
      } else if (token.startsWith("**")) {
        const strong = document.createElement("strong"); strong.textContent = token.slice(2, -2); parent.append(strong);
      } else {
        const parts = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        const href = safeUrl(parts[2], base);
        const link = document.createElement(href ? "a" : "span");
        link.textContent = parts[1];
        if (href) link.href = href;
        parent.append(link);
      }
      start = match.index + token.length;
    }
    parent.append(document.createTextNode(text.slice(start)));
  }

  function render(markdown, base) {
    const root = document.createElement("article"); root.className = "lesson-content";
    const parents = [root];
    const lines = markdown.replaceAll("\r\n", "\n").split("\n");
    const parent = () => parents.at(-1);
    let paragraph = [];
    const flush = () => {
      if (!paragraph.length) return;
      const p = document.createElement("p"); inline(p, paragraph.join(" "), base); parent().append(p); paragraph = [];
    };
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/^<!-- (?:foundations:(?:start|end)|drill:\d{2}-\d{2}) -->$/.test(line)) { flush(); continue; }
      if (line.startsWith("```")) {
        flush(); const language = line.slice(3).trim(); const codeLines = [];
        while (++i < lines.length && !lines[i].startsWith("```")) codeLines.push(lines[i]);
        const box = document.createElement("div"); box.className = "lesson-code";
        box.dataset.language = language;
        const pre = document.createElement("pre"); const code = document.createElement("code");
        code.textContent = codeLines.join("\n"); pre.append(code);
        const button = document.createElement("button"); button.type = "button"; button.textContent = "复制代码";
        let copyTimer;
        button.addEventListener("click", async () => {
          clearTimeout(copyTimer);
          try { await navigator.clipboard.writeText(box.querySelector("textarea")?.value ?? code.textContent); button.textContent = "已复制 ✓"; }
          catch { button.textContent = "请选中代码复制"; }
          copyTimer = setTimeout(() => { button.textContent = "复制代码"; }, 1800);
        });
        if (language === "mermaid") {
          const note = document.createElement("p"); note.textContent = "流程图源码（可在支持 Mermaid 的编辑器查看）"; box.append(note);
        }
        box.append(button, pre); parent().append(box); continue;
      }
      if (line.trim() === "<details>") {
        flush(); const details = document.createElement("details"); parent().append(details); parents.push(details); continue;
      }
      if (line.trim() === "</details>") { flush(); if (parents.length > 1) parents.pop(); continue; }
      const summary = line.match(/^<summary>(.*?)<\/summary>$/);
      if (summary) { flush(); const node = document.createElement("summary"); inline(node, summary[1], base); parent().append(node); continue; }
      if (line.startsWith("|") && lines[i + 1]?.match(/^\|[\s:|\-]+\|$/)) {
        flush(); const wrap = document.createElement("div"); wrap.className = "lesson-table";
        const table = document.createElement("table");
        const row = (content, header) => {
          const tr = document.createElement("tr");
          for (const value of content.replace(/^\||\|$/g, "").split("|")) {
            const cell = document.createElement(header ? "th" : "td"); inline(cell, value.trim(), base); tr.append(cell);
          }
          table.append(tr);
        };
        row(line, true); i++;
        while (lines[i + 1]?.startsWith("|")) row(lines[++i], false);
        wrap.append(table); parent().append(wrap); continue;
      }
      const heading = line.match(/^(#{1,6})\s+(.+)$/);
      if (heading) { flush(); const node = document.createElement(`h${heading[1].length}`); inline(node, heading[2], base); parent().append(node); continue; }
      const list = line.match(/^(?:([-*]) |(\d+)\. )(.+)$/);
      if (list) {
        flush(); const ordered = Boolean(list[2]); const node = document.createElement(ordered ? "ol" : "ul");
        if (ordered) node.start = Number(list[2]);
        while (true) {
          const item = document.createElement("li"); inline(item, lines[i].replace(/^(?:[-*] |\d+\. )/, ""), base); node.append(item);
          const next = lines[i + 1] ?? "";
          if (ordered ? !/^\d+\. /.test(next) : !/^[-*] /.test(next)) break;
          i++;
        }
        parent().append(node); continue;
      }
      if (!line.trim()) { flush(); continue; }
      paragraph.push(line);
    }
    flush(); return root;
  }
  return { render };
})();
