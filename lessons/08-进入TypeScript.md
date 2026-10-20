# 08 · 让编译器拦住错误的加法

今天做出来的效果：**先看真实类型错误，再把文本转成数字，得到 25。**

<!-- foundations:start -->
## 动手前先认识

先读下面几个概念，再展开小例子预测输出。看完即可回到本关练习，不必先背术语。

### TypeScript、类型推断与编译

**TypeScript（TS）**在 JS 的基础上增加类型表达和静态检查。它帮助你在运行前发现某些错误，不会替你验证所有真实输入，也不保证业务逻辑正确。

- **类型注解**：参数后的 `: number` 声明允许的类型；函数参数列表后的 `: number` 声明返回类型。它不是把值转成数字的命令。
- **类型推断**：`const label = "学习"` 即使不写注解，编译器也能推断类型。常见类型包括 string、number、boolean 和数组类型 number[]。
- **本课程执行链**：编辑 .ts → tsc 检查并生成 .js → Node.js 执行 .js。这里的 lab 命令只在检查成功后继续运行；其他运行方式可能有不同策略。
- **类型擦除**：类型注解、interface 等不会成为运行时的数据检查器。外部输入还要用 JS 逻辑验证；`as number` 只是向编译器作断言，不会转换字符串。
- **与 Java 的联系**：都能在执行前检查部分类型错误；TS 的类型主要描述 JS 值的形状，interface 本身不会生成运行时类。

<details>
<summary>读例子 → 改一个地方 → 检查理解</summary>

```ts
function twice(value: number): number {
  return value * 2;
}
const text = "6";
const numeric = Number(text);
console.log(twice(numeric));
// twice(text); // 取消注释会产生类型错误
```

**逐步理解**：Number(text) 是运行时转换，类型注解是运行前检查，两者职责不同。正常输出 12；取消最后一行的注释，会指出 string 不符合 number 参数。

**动手试一试**：在独立 concept.ts 文件中试这个片段。可用 npx --no-install tsc --ignoreConfig --strict --noEmit concept.ts 只检查；运行仍按本关 practice 文件和 lab 命令进行。

这是独立的概念小实验，不计入本关验收。先在项目根目录运行 `npm run concept -- 08` 查看原例输出（TS 关卡先运行 `npm ci` 安装编译器）。运行 `npm run concept -- 08 --prepare` 创建 `practice/concepts/08.ts`，修改后用 `npm run concept -- 08 --local` 体验自己的版本。重复准备会保留你的修改，挑战代码不受影响。

**先回答，再展开**：把 text as number 强行传入函数，就真的变成数字了吗？为什么不应使用 any 来“修好”本关？

<details>
<summary>查看解释</summary>

断言不转换值，编译器还可能指出这两种类型缺乏重叠。any 会放弃相关检查，掩盖输入不符合约定的问题；应明确转换并按需求校验。

</details>

</details>
<!-- foundations:end -->

## 先打开，再运行

编辑 [practice/08.ts](../practice/08.ts)。在项目根目录运行（缺依赖时先 `npm ci`）：

```sh
npm run lab -- 08
npm run lab -- 08 --check
```

第一条先编译本关、成功后运行；第二条增加验收检查。每关独立编译，其他未完成关卡不会干扰这一关。初始代码故意带问题，第一次报错正是本课的起点。错误里的临时 main.ts 对应本关源码；在本地 practice 文件中修改。

## 每次只改一点

1. 运行 npm run lab -- 08，先阅读 string 不能传给 number 的错误。
2. 修改 practice/08.ts：转换 input，再运行同一命令。
3. 运行 npm run lab -- 08 --check，查看挑战结果。
4. 再次传入字符串体验编译错误，然后恢复。

## 刚才发生了什么

第 01 课的拼接问题，这次在执行前被发现。: number 是类型约束，不是转换动作。命令先用真实 tsc 检查并生成 JS，成功后才执行。

## 卡住时，只看这个提示

<details>
<summary>展开提示</summary>

保留 add 的 number 参数；在调用处使用 Number(input)。不要用 any 绕过检查。

</details>

## 再做一个自己的版本

新增 square(value: number)，故意传字符串看看编译器在哪一行阻止你。

## 验收与复盘

基础挑战以“先看真实类型错误，再把文本转成数字，得到 25。”为目标。JS / TS 关卡使用 `--check` 或网页“检查挑战”；第 07 关实际操作添加、完成后核对数量。扩展挑战自行观察和验证，不计入基础检查。

写下三句话：我改了哪一行；修改前后输出有什么差别；我换过哪些输入。不要只记住“通过”两个字。

<details>
<summary>已经试过，再看参考</summary>

[本关参考代码](../answers/practice/08.ts)

</details>

需要查语法时再看：[本课概念资料](../reference/08-进入TypeScript.md)。下一关从 [教学总目录](../README.md) 进入。
