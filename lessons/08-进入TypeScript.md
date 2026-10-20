# 08 · 让编译器拦住错误的加法

今天做出来的效果：**先看真实类型错误，再把文本转成数字，得到 25。**

<!-- foundations:start -->
## 一步一步看懂，再拆开练

一次只看一小步。先运行具体代码、逐行看值怎样变化，做几个小练习后再组合成主挑战。

### 在运行前，就提醒你传错了东西

第 01 关你见过文字与数字混算。现在我们给函数写一句更明确的要求：“这个位置只接收数字”。先看约定如何被检查，再看真正的转换发生在哪。

#### 1 · 先看这一个例子

先猜输出，再点运行。看不懂的行留到下一步逐行解释，不需要边看边查一串术语。

```ts
function twice(value: number): number {
  return value * 2;
}
const text = "6";
const numeric = Number(text);
console.log(twice(numeric));
// twice(text); // 取消注释会产生类型错误
```

原例可在终端运行：`npm run concept -- 08`。

#### 2 · 一行一行看它做了什么

`function twice(value: number): number` 中，第一个 number 跟在 value 后面，说“输入 value 必须是数字”；最后的 number 说“这个函数交回的结果也是数字”。

text 存的是带引号的 "6"。`Number(text)` 这一步才真正把文字读成数字 6，numeric 保存这个结果。twice(numeric) 接收 6，返回 12。

类型注解不会执行 Number。你写 `value: number`，只是给检查器看的一条要求，不会让传入的字符串自己变成数字。

最后的 `//` 表示这一行是注释，目前不执行。取消注释后，twice(text) 把文字传到要求数字的位置，编译器就会指出错误。

#### 3 · 改一点，再看一次

先保持原样运行，看到 12。然后取消最后一行注释，重新检查，看报错指向哪里。

接着保留错误调用，把类型改为 any，虽然可能不报错，但你也失去这条保护。恢复 number，在调用位置做 Number(text)，让数据本身满足要求。

本课程的命令依次做：检查 .ts → 生成 .js → Node.js 运行 .js。检查失败就先停下来，修好后再执行。不需要初学时自己管理临时编译目录。

如果要保留自己的实验，先运行 `npm run concept -- 08 --prepare`，修改创建的文件，再用 `npm run concept -- 08 --local` 运行。HTML 保存后刷新浏览器。重复准备会保留你已有的文件。

#### 4 · 分开练，先不做整道题

1. **先读懂参数类型**：add 只收数字。在调用处转换 text，保留函数参数的 number。
2. **再给函数写清输入输出**：把 value 的类型写为 number，返回类型也为 number，保留乘法。
3. **返回值也要真的符合类型**：read 的返回类型是 number，但现在返回文字。修好实现。

网页下方有对应的小练习。每次只做一题：先运行起点 → 修改 → 检查 → 说清变化。做对以后换下一题，不需要先把整个主挑战写完。TS 小练习显示本地文件和命令，由真实编译器检查。

#### 5 · 做过之后，再认识这些名字

这种运行前的检查叫**静态类型检查**。TS 是在 JS 上增加类型写法和检查的语言。

类型描述会在生成 JS 时被去掉，不能替你验证网络或文件里来的真实内容。`as` 也不会转换值；需要转换就写实际转换，需要拒绝非法输入就写实际判断。

做完小练习后，回主挑战把这些动作组合起来。若某一步仍说不清，就回到对应小题换一个数字再试；此时读更长的术语表帮助不大。
## 本关小步练习

### 08-01 · 先读懂参数类型

add 只收数字。在调用处转换 text，保留函数参数的 number。

```ts
function add(a: number, b: number): number { return a + b; }
const text = "6";
const result = add(text, 2);
```

在实验台选择这道小题，或运行 `npm run drill -- 08-01 --prepare` 后编辑 `practice/steps/08-01.ts`，再运行 `npm run drill -- 08-01 --check`。

<details>
<summary>一点提示</summary>

类型注解不转换数据；Number(text) 才转换。

</details>

<details>
<summary>试过后再看解释</summary>

```ts
function add(a: number, b: number): number { return a + b; }
const text = "6";
const result = add(Number(text), 2);
```

编译器指出输入不合约定后，要修正实际值。

</details>

### 08-02 · 再给函数写清输入输出

把 value 的类型写为 number，返回类型也为 number，保留乘法。

```ts
function twice(value): number { return value * 2; }
```

在实验台选择这道小题，或运行 `npm run drill -- 08-02 --prepare` 后编辑 `practice/steps/08-02.ts`，再运行 `npm run drill -- 08-02 --check`。

<details>
<summary>一点提示</summary>

参数名后面写 : number。

</details>

<details>
<summary>试过后再看解释</summary>

```ts
function twice(value: number): number { return value * 2; }
```

参数类型约束调用者；返回类型约束函数交出的结果。

</details>

### 08-03 · 返回值也要真的符合类型

read 的返回类型是 number，但现在返回文字。修好实现。

```ts
function read(text: string): number { return text; }
```

在实验台选择这道小题，或运行 `npm run drill -- 08-03 --prepare` 后编辑 `practice/steps/08-03.ts`，再运行 `npm run drill -- 08-03 --check`。

<details>
<summary>一点提示</summary>

改函数体，不要把返回类型改成 any。

</details>

<details>
<summary>试过后再看解释</summary>

```ts
function read(text: string): number { return Number(text); }
```

注解说明承诺，函数体必须兑现承诺。

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
