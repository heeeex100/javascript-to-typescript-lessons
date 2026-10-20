function createHistory(initial) {
  let present = initial;
  const past = [];
  const future = [];
  return {
    get: () => present,
    set(next) {
      if (Object.is(next, present)) return;
      past.push(present);
      present = next;
      future.length = 0;
    },
    undo() {
      if (past.length === 0) return present;
      future.push(present);
      present = past.pop();
      return present;
    },
    redo() {
      if (future.length === 0) return present;
      past.push(present);
      present = future.pop();
      return present;
    },
  };
}
const history = createHistory("草稿");
history.set("版本 A");
history.set("版本 B");
console.log("撤销一次：", history.undo());
console.log("再撤销：", history.undo());
console.log("重做：", history.redo());
