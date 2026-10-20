// 独立 Worker 中执行；把学习代码与页面状态管理分开。
globalThis.WorkshopRunner = {
  program: `(${function workerMain() {
    const format = value => {
      if (typeof value === "string") return value;
      if (value instanceof Error) return `${value.name}: ${value.message}`;
      if (typeof value !== "object" || value === null) return String(value);
      try {
        const visited = new WeakSet();
        return JSON.stringify(value, (_key, item) => {
          if (typeof item === "bigint") return `${item}n`;
          if (typeof item === "number" && !Number.isFinite(item)) return String(item);
          if (typeof item === "object" && item !== null) {
            if (visited.has(item)) return "[重复或循环引用]";
            visited.add(item);
          }
          return item;
        });
      } catch { return "[无法显示的值]"; }
    };
    self.onmessage = async ({ data }) => {
      let lines = 0;
      const log = (...values) => {
        if (++lines > 150) throw new Error("输出超过 150 行，请检查循环条件");
        self.postMessage({ type: "log", text: values.map(format).join(" ").slice(0, 5000) });
      };
      const check = (condition, message) => { if (!condition) throw new Error("挑战提示：" + message); };
      try {
        let finished = false;
        const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
        const source = '"use strict";\n' + data.source + "\n" + data.checks + "\nfinishLab();";
        await new AsyncFunction("console", "check", "finishLab", source)(
          { log, error: log, warn: log, info: log, table: log }, check, () => { finished = true; },
        );
        if (!finished) throw new Error("代码提前结束，未完成验收；请检查是否在最外层写了 return");
        self.postMessage({ type: "done" });
      } catch (error) {
        self.postMessage({ type: "error", text: format(error) });
      }
    };
  }.toString()})()`,
};
