function add(a: number, b: number): number {
  return a + b;
}
console.log("数字求和：", add(20, 5));
// add("20", 5); // 取消注释后运行 npm run check，观察类型错误。

const tags: string[] = ["JS", "TS"];
const first = tags[0]; // string | undefined，数组可能为空。
if (first !== undefined) console.log("第一项：", first.toLowerCase());
export {};
