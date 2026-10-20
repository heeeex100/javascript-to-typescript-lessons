function first<T>(items: readonly T[]): T | undefined {
  return items[0];
}
function findById<T extends { id: number }>(items: readonly T[], id: number): T | undefined {
  return items.find(item => item.id === id);
}
function getProperty<T, K extends keyof T>(value: T, key: K): T[K] {
  return value[key];
}
const tasks = [{ id: 1, title: "练习泛型", done: false }];
console.log("首项：", first([10, 20]));
console.log("空列表：", first<number>([]));
console.log("保留标题类型：", findById(tasks, 1)?.title);
console.log("取属性：", getProperty({ title: "JS" }, "title"));
export {};
