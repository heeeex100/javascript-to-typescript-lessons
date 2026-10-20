# 08 · 从 JS 进入 TS：先体验它帮你发现什么

目标：写类型、编译为 JS、比较类型检查和实际执行。

## 1. 先看到 JS 中的问题

```js
function add(a, b) {
  return a + b;
}
console.log(add("20", 5)); // "205"
```

这段代码可以运行，但可能不符合“求和”的意图。TS 允许声明函数只接受数字：

```ts
function add(a: number, b: number): number {
  return a + b;
}
console.log(add(20, 5));
// add("20", 5); // 取消注释后，类型检查会报错
```

参数后 `: number` 表达约束，返回类型告诉调用方能得到什么。写了 number 不会自动把字符串转换成数字，转换仍然需要 `Number(...)` 等 JS 操作。

## 2. 运行步骤

```sh
npm ci
npm run check
npm run build
node dist/examples/ts/08-basics.js
```

已有 node_modules 时通常可以跳过 npm ci。`npm run` 执行 package.json 的同名脚本，它能找到项目内安装的 tsc，不需要全局 tsc 命令。

打开 `examples/ts/08-basics.ts`，取消错误调用的注释，再运行 `npm run check`，阅读“string 不能赋给 number”附近的报错。恢复注释后再编译。

然后比较源文件与 `dist/examples/ts/08-basics.js`：类型标注不见了，函数与计算保留。不要直接修改 dist，它是可重新生成的输出。

部分运行环境支持直接处理一部分 TS 语法，但直接执行不代表完成类型检查。本教程统一走 tsc → JS，便于看清这两个步骤。

## 3. 类型推断减少重复书写

```ts
const name = "小杨";
let minutes = 20;
const tags: string[] = ["JS", "TS"];
```

编译器可从初始值推断类型，无需给每个变量都手写标注。`minutes = "20"` 会报错；数组的 `string[]` 表示每个元素是字符串。变量推断的细节会受 const、let 和上下文影响，先观察编辑器提示。

与 Java 不同，TS 常通过对象具有什么属性来判断类型兼容，不一定要求显式继承某个类或 implements 某个接口。

## 4. 本项目的 tsconfig

| 选项 | 这套教程为什么使用 |
| --- | --- |
| `strict: true` | 启用严格类型检查，包含空值检查等 |
| `noUncheckedIndexedAccess: true` | 数组按下标读取等场合要考虑 undefined |
| `noEmitOnError: true` | 有类型错误时不生成新的 JS |
| `module: "NodeNext"` | 按 Node 模块规则处理导入与输出 |
| `target: "ES2022"` | 指定生成 JS 的语法目标，不是浏览器兼容性保证 |
| `outDir: "dist"` | 生成结果集中放入 dist |

还有 `rootDir` 指定源文件的共同根目录，`include` 指定哪些 TS 文件参加检查。不要在项目里随意改用 `tsc 某文件.ts`：直接指定文件时不会按通常方式读取项目配置。本教程统一用 npm 脚本。

## 练习与验收

把第 03 课的 square 改为 `square(value: number): number`，加入本课示例文件并编译。故意传字符串，观察错误，然后修正。能解释 `.ts`、`.js`、类型检查和执行各自的作用。

下一课：[对象类型和接口](09-对象类型和接口.md)。
