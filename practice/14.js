function createHistory(initial) {
  let value = initial;
  return {
    get: () => value,
    set(next) { value = next; },
    undo() { return value; },
    redo() { return value; },
  };
}
const history = createHistory("草稿");
history.set("版本 A");
history.set("版本 B");
console.log("撤销一次：", history.undo());
console.log("再撤销：", history.undo());
console.log("重做：", history.redo());
