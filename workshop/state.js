// 学习状态与备份格式共用这里的规则，网页和 Node 检查使用同一份实现。
globalThis.WorkshopState = (() => {
  const isRecord = value => value !== null && typeof value === "object" && !Array.isArray(value);
  const own = (object, key) => Object.hasOwn(object, key);
  const MAX_SOURCE = 100_000;
  const MAX_BACKUP = 2_000_000;

  function normalize(labs, input) {
    const raw = isRecord(input) ? input : {};
    const drafts = {};
    const passed = {};
    const sourceDrafts = isRecord(raw.drafts) ? raw.drafts : {};
    const sourcePassed = isRecord(raw.passed) ? raw.passed : {};
    for (const lab of labs) {
      if (lab.lang !== "js") continue;
      if (own(sourceDrafts, lab.id) && typeof sourceDrafts[lab.id] === "string" && sourceDrafts[lab.id].length <= MAX_SOURCE) {
        drafts[lab.id] = sourceDrafts[lab.id];
      }
      const record = own(sourcePassed, lab.id) ? sourcePassed[lab.id] : null;
      const code = drafts[lab.id] ?? lab.starter;
      // 旧版只保存 true，不能证明对应哪一版代码/验收；保留草稿，等待重验。
      if (isRecord(record) && record.source === code && record.checks === lab.checks) {
        passed[lab.id] = { source: code, checks: lab.checks };
      }
    }
    const lastLesson = labs.some(lab => lab.id === raw.lastLesson) ? raw.lastLesson : labs[0].id;
    return { drafts, passed, lastLesson };
  }

  function isPassed(state, lab) {
    const record = state.passed[lab.id];
    return Boolean(record && record.source === (state.drafts[lab.id] ?? lab.starter) && record.checks === lab.checks);
  }

  function exportBackup(labs, state, date = new Date()) {
    return JSON.stringify({
      kind: "js-ts-workshop-backup", version: 1, exportedAt: date.toISOString(),
      state: normalize(labs, state),
    }, null, 2);
  }

  function parseBackup(labs, text) {
    if (text.length > MAX_BACKUP) throw new Error("备份超过 2 MB，请选择实验台导出的 JSON 文件。");
    let raw;
    try { raw = JSON.parse(text); } catch { throw new Error("文件不是有效的 JSON 备份。"); }
    if (!isRecord(raw) || raw.kind !== "js-ts-workshop-backup" || raw.version !== 1
      || !isRecord(raw.state) || !isRecord(raw.state.drafts) || !isRecord(raw.state.passed)) {
      throw new Error("这不是受支持的实验台备份，当前草稿未改变。");
    }
    for (const lab of labs.filter(lab => lab.lang === "js")) {
      if (own(raw.state.drafts, lab.id) && (typeof raw.state.drafts[lab.id] !== "string" || raw.state.drafts[lab.id].length > MAX_SOURCE)) {
        throw new Error(`第 ${lab.id} 关草稿无效或过大，当前草稿未改变。`);
      }
    }
    return normalize(labs, raw.state);
  }

  function planImport(labs, current, incoming, overwrite = false) {
    const next = normalize(labs, current);
    const counts = { added: 0, conflicts: 0, unchanged: 0, replaced: 0 };
    for (const lab of labs.filter(lab => lab.lang === "js")) {
      if (!own(incoming.drafts, lab.id)) continue;
      const exists = own(next.drafts, lab.id);
      const conflict = exists && next.drafts[lab.id] !== incoming.drafts[lab.id];
      if (conflict) counts.conflicts++;
      if (conflict && !overwrite) continue;
      if (!exists) counts.added++;
      else if (conflict) counts.replaced++;
      else counts.unchanged++;
      next.drafts[lab.id] = incoming.drafts[lab.id];
      if (conflict) delete next.passed[lab.id];
      if (isPassed(incoming, lab)) next.passed[lab.id] = incoming.passed[lab.id];
    }
    return { state: normalize(labs, next), counts };
  }
  return { normalize, isPassed, exportBackup, parseBackup, planImport, MAX_BACKUP };
})();
