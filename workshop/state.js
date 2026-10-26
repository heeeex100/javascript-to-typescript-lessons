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
    const reading = {};
    const smallDrafts = {};
    for (const lab of labs) {
      const position = isRecord(raw.reading) ? raw.reading[lab.id] : null;
      if (isRecord(position) && Number.isInteger(position.step) && position.step >= 0 && position.step < 200) {
        reading[lab.id] = { step: position.step, section: position.section === "final" ? "final" : "lesson" };
      }
    }
    for (const item of globalThis.learningDrills ?? []) {
      if (item.lang !== "js" || item.local) continue;
      const value = isRecord(raw.smallDrafts) && own(raw.smallDrafts, item.id) ? raw.smallDrafts[item.id] : null;
      if (typeof value === "string" && value.length <= MAX_SOURCE) smallDrafts[item.id] = value;
    }
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
    return { drafts, passed, lastLesson, reading, smallDrafts };
  }

  function isPassed(state, lab) {
    const record = state.passed[lab.id];
    return Boolean(record && record.source === (state.drafts[lab.id] ?? lab.starter) && record.checks === lab.checks);
  }

  function exportBackup(labs, state, date = new Date()) {
    const text = JSON.stringify({
      kind: "js-ts-workshop-backup", version: 2, exportedAt: date.toISOString(),
      state: normalize(labs, state),
    }, null, 2);
    if (new TextEncoder().encode(text).length > MAX_BACKUP) throw new Error("备份超过 2 MB，请先分别下载较大的练习代码，精简草稿后重试。");
    return text;
  }

  function parseBackup(labs, text) {
    if (text.length > MAX_BACKUP) throw new Error("备份超过 2 MB，请选择实验台导出的 JSON 文件。");
    let raw;
    try { raw = JSON.parse(text); } catch { throw new Error("文件不是有效的 JSON 备份。"); }
    if (!isRecord(raw) || raw.kind !== "js-ts-workshop-backup" || ![1, 2].includes(raw.version)
      || !isRecord(raw.state) || !isRecord(raw.state.drafts) || !isRecord(raw.state.passed)) {
      throw new Error("这不是受支持的实验台备份，当前草稿未改变。");
    }
    for (const lab of labs.filter(lab => lab.lang === "js")) {
      if (own(raw.state.drafts, lab.id) && (typeof raw.state.drafts[lab.id] !== "string" || raw.state.drafts[lab.id].length > MAX_SOURCE)) {
        throw new Error(`第 ${lab.id} 关草稿无效或过大，当前草稿未改变。`);
      }
    }
    if (raw.state.smallDrafts !== undefined && !isRecord(raw.state.smallDrafts)) throw new Error("小练习草稿格式无效，当前草稿未改变。");
    for (const item of globalThis.learningDrills ?? []) {
      if (isRecord(raw.state.smallDrafts) && own(raw.state.smallDrafts, item.id)
        && (typeof raw.state.smallDrafts[item.id] !== "string" || raw.state.smallDrafts[item.id].length > MAX_SOURCE)) {
        throw new Error(`小练习 ${item.id} 草稿无效或过大，当前草稿未改变。`);
      }
    }
    return normalize(labs, raw.state);
  }

  function planImport(labs, current, incoming, overwrite = false) {
    const next = normalize(labs, current);
    const counts = { added: 0, conflicts: 0, unchanged: 0, replaced: 0 };
    const smallCounts = { added: 0, conflicts: 0, unchanged: 0, replaced: 0 };
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
    for (const [id, source] of Object.entries(incoming.smallDrafts ?? {})) {
      const exists = own(next.smallDrafts, id);
      const conflict = exists && next.smallDrafts[id] !== source;
      if (conflict) smallCounts.conflicts++;
      if (conflict && !overwrite) continue;
      if (!exists) smallCounts.added++;
      else if (conflict) smallCounts.replaced++;
      else smallCounts.unchanged++;
      next.smallDrafts[id] = source;
    }
    for (const lab of labs) {
      if (incoming.reading?.[lab.id] && (!next.reading[lab.id] || overwrite)) next.reading[lab.id] = incoming.reading[lab.id];
    }
    return { state: normalize(labs, next), counts, smallCounts };
  }
  return { normalize, isPassed, exportBackup, parseBackup, planImport, MAX_BACKUP };
})();
