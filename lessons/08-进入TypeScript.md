# 08 · 综合大练习：有类型约束的分钟输入工具

本关按“讲解一段 → 就地小练习”学习，最后完成综合大练习。

<!-- foundations:start -->
## 边看边练

### 在运行前，就提醒你传错了东西

第 01 关你见过文字与数字混算。现在我们给函数写一句更明确的要求：“这个位置只接收数字”。先看约定如何被检查，再看真正的转换发生在哪。

#### 1 · 先读懂参数类型

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

`function twice(value: number): number` 中，第一个 number 跟在 value 后面，说“输入 value 必须是数字”；最后的 number 说“这个函数交回的结果也是数字”。

text 存的是带引号的 "6"。`Number(text)` 这一步才真正把文字读成数字 6，numeric 保存这个结果。twice(numeric) 接收 6，返回 12。

类型注解不会执行 Number。你写 `value: number`，只是给检查器看的一条要求，不会让传入的字符串自己变成数字。

最后的 `//` 表示这一行是注释，目前不执行。取消注释后，twice(text) 把文字传到要求数字的位置，编译器就会指出错误。


##### 就地小练习 08-01 · 先读懂参数类型

add 只收数字。在调用处转换 text，保留函数参数的 number。

```ts
function add(a: number, b: number): number { return a + b; }
const text = "6";
const result = add(text, 2);
```

网页中在这一段下面直接练习。本地运行 `npm run drill -- 08-01 --prepare`，编辑 `practice/steps/08-01.ts`，再运行 `npm run drill -- 08-01 --check`。

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

#### 2 · 再给函数写清输入输出

先保持原样运行，看到 12。然后取消最后一行注释，重新检查，看报错指向哪里。

接着保留错误调用，把类型改为 any，虽然可能不报错，但你也失去这条保护。恢复 number，在调用位置做 Number(text)，让数据本身满足要求。

本课程的命令依次做：检查 .ts → 生成 .js → Node.js 运行 .js。检查失败就先停下来，修好后再执行。不需要初学时自己管理临时编译目录。

如果要保留自己的实验，先运行 `npm run concept -- 08 --prepare`，修改创建的文件，再用 `npm run concept -- 08 --local` 运行。HTML 保存后刷新浏览器。重复准备会保留你已有的文件。


##### 就地小练习 08-02 · 再给函数写清输入输出

把 value 的类型写为 number，返回类型也为 number，保留乘法。

```ts
function twice(value): number { return value * 2; }
```

网页中在这一段下面直接练习。本地运行 `npm run drill -- 08-02 --prepare`，编辑 `practice/steps/08-02.ts`，再运行 `npm run drill -- 08-02 --check`。

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

#### 3 · 返回值也要真的符合类型

这种运行前的检查叫**静态类型检查**。TS 是在 JS 上增加类型写法和检查的语言。

类型描述会在生成 JS 时被去掉，不能替你验证网络或文件里来的真实内容。`as` 也不会转换值；需要转换就写实际转换，需要拒绝非法输入就写实际判断。

做完小练习后，回综合大练习把这些动作组合起来。若某一步仍说不清，就回到对应小题换一个数字再试；此时读更长的术语表帮助不大。


##### 就地小练习 08-03 · 返回值也要真的符合类型

read 的返回类型是 number，但现在返回文字。修好实现。

```ts
function read(text: string): number { return text; }
```

网页中在这一段下面直接练习。本地运行 `npm run drill -- 08-03 --prepare`，编辑 `practice/steps/08-03.ts`，再运行 `npm run drill -- 08-03 --check`。

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

## 本关综合大练习

**将文字校验和数字计算接到 TS 参数约定上，返回真实数字。**

### 完成要求

- 实现 planMinutes(text:string, bonus:number):number，不使用 any 或断言绕过检查。
- text 必须是非空、可转成有限非负数字的文字。bonus 为有限非负数字。
- 合法时返回转换后的分钟数加 bonus；非法输入抛出 Error。

### 输入与预期结果

("20",5) → 25；("0",0) → 0；空文本、abc、负数分钟或负数奖励 → 抛错。

### 在哪里写、怎么验收

编辑 [practice/finals/08.ts](../practice/finals/08.ts)，在项目根目录执行：

```sh
npm run lab -- 08
npm run lab -- 08 --check
```

起点只提供数据或函数外壳，需要自己把本关学过的动作组合起来。已有的旧版 practice 文件仍保留，新的基础综合题使用 practice/finals 目录。网页草稿与本地文件独立。

<details>
<summary>卡住时，再看解题思路</summary>

1. 先检查空文本和 Number(text) 的结果。
2. 验证数字范围与 bonus。
3. 合法时返回实际加法结果，不修改函数类型来躲过错误。

先检查空文本和 Number(text) 的结果。

</details>

<details>
<summary>完成后复盘：这道题用到了什么</summary>

第 01 课的拼接问题，这次在执行前被发现。: number 是类型约束，不是转换动作。命令先用真实 tsc 检查并生成 JS，成功后才执行。

</details>

### 完成后再加一个需求

新增 square(value: number)，故意传字符串看看编译器在哪一行阻止你。

扩展不计入本关基础验收。

<details>
<summary>已经独立尝试，再看完整参考</summary>

[综合大练习参考](../answers/finals/08.ts)

</details>

[返回教学目录](../README.md)。
