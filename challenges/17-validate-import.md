# 17 · 导入脏数据时一次列出所有错误

**做出来的效果：把外部 unknown 校验成 Task[]；同时告诉用户每个错误在哪个字段。**

建议预备知识：第 09～11 关，理解 unknown 和判别联合。建议拆成 2～3 次完成，每次 25～35 分钟；卡住时先缩小输入，不必一次写完。

<!-- foundations:start -->
## 一步一步看懂，再拆开练

一次只看一小步。先运行具体代码、逐行看值怎样变化，做几个小练习后再组合成主挑战。

### 外面传来的任务，先一层一层检查

拿到一个 JSON 数组，不能因为给它写上 Task[]，就断定里面每一项都正确。像收快递一样：先确认是包裹，再拆开看每个东西。

#### 1 · 先看这一个例子

先猜输出，再点运行。看不懂的行留到下一步逐行解释，不需要边看边查一串术语。

```ts
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
const input: unknown = { title: "  JS  ", done: "false" };
if (isRecord(input) && typeof input.title === "string") {
  console.log(input.title.trim());
  console.log(typeof input.done, Boolean(input.done));
}
```

原例可在终端运行：`npm run concept -- 17`。

#### 2 · 一行一行看它做了什么

isRecord 先问三个问题：是不是对象、不是 null、不是数组。这只证明能按字段名读取，还没证明 title 和 done 都正确。

例子接着用 typeof input.title === "string" 检查标题确实是文字，再 trim 去空格，得到 JS。

done 的值是带引号的 "false"，它是文字。Boolean("false") 却会得到 true，因为非空文字在这个转换中算真。不能拿它当成真正的布尔 false。

因此读取每个字段之后仍要问：它的类型对不对，值的范围对不对。不要用一个“看起来像转换”的动作代替明确检查。

#### 3 · 改一点，再看一次

按三个小题分开练：排除 null/数组 → 验证布尔字段 → 拼出清楚的错误路径。

然后按列表位置收集问题。例如第三项的标题为空，记录 [2].title；第三项的 done 类型错误，记录 [2].done。位置从 0 开始，所以第三项是 2。

最后处理重复 id：单看一项并不能发现它和前面某项相同，要另外记住已经出现的 id。先用只有两条重复记录的输入验证，再扩大列表。

如果要保留自己的实验，先运行 `npm run concept -- 17 --prepare`，修改创建的文件，再用 `npm run concept -- 17 --local` 运行。HTML 保存后刷新浏览器。重复准备会保留你已有的文件。

#### 4 · 分开练，先不做整道题

1. **先排除 null 和数组**：只让普通对象形状通过，不让 null 或 [] 通过。
2. **再问字段值是否真是布尔**：只允许 true 和 false，拒绝字符串 "false"。
3. **最后告诉用户哪一项错了**：输入下标 2 和字段 title，应返回 [2].title。

网页下方有对应的小练习。每次只做一题：先运行起点 → 修改 → 检查 → 说清变化。做对以后换下一题，不需要先把整个主挑战写完。TS 小练习显示本地文件和命令，由真实编译器检查。

#### 5 · 做过之后，再认识这些名字

数据从文件、接口、用户进入程序的地方叫**输入边界**。检查成功后才当成具体类型使用，叫**运行时校验**。

`as Task[]` 只是对编译器说“相信我”，不会执行检查。类型谓词也要靠函数体真的检查正确，才能支撑它的承诺。

做完小练习后，回主挑战把这些动作组合起来。若某一步仍说不清，就回到对应小题换一个数字再试；此时读更长的术语表帮助不大。
## 本关小步练习

### 17-01 · 先排除 null 和数组

只让普通对象形状通过，不让 null 或 [] 通过。

```ts
function isRecord(value: unknown): value is Record<string,unknown> { return typeof value === "object"; }
```

在实验台选择这道小题，或运行 `npm run drill -- 17-01 --prepare` 后编辑 `practice/steps/17-01.ts`，再运行 `npm run drill -- 17-01 --check`。

<details>
<summary>一点提示</summary>

把三个判断用 && 连起来。

</details>

<details>
<summary>试过后再看解释</summary>

```ts
function isRecord(value: unknown): value is Record<string,unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
```

第一层检查只证明能按键读值，不代表里面字段已经有效。

</details>

### 17-02 · 再问字段值是否真是布尔

只允许 true 和 false，拒绝字符串 "false"。

```ts
function isDone(value: unknown): value is boolean { return Boolean(value); }
```

在实验台选择这道小题，或运行 `npm run drill -- 17-02 --prepare` 后编辑 `practice/steps/17-02.ts`，再运行 `npm run drill -- 17-02 --check`。

<details>
<summary>一点提示</summary>

这题问类型，不是把值转换成真假。

</details>

<details>
<summary>试过后再看解释</summary>

```ts
function isDone(value: unknown): value is boolean { return typeof value === "boolean"; }
```

Boolean("false") 为 true，强制转换不能替代类型校验。

</details>

### 17-03 · 最后告诉用户哪一项错了

输入下标 2 和字段 title，应返回 [2].title。

```ts
function issuePath(index: number, field: string): string { return field; }
```

在实验台选择这道小题，或运行 `npm run drill -- 17-03 --prepare` 后编辑 `practice/steps/17-03.ts`，再运行 `npm run drill -- 17-03 --check`。

<details>
<summary>一点提示</summary>

把 index 放在方括号里，再用点连接 field。

</details>

<details>
<summary>试过后再看解释</summary>

```ts
function issuePath(index: number, field: string): string { return `[${index}].${field}`; }
```

一条清楚的错误路径能让用户定位到需要修正的数据。

</details>

<!-- foundations:end -->

## 先复现一个真实问题

1. 先运行，观察重复 id、空标题和字符串 done 为什么被当成成功。
2. 先做顶层数组、行对象检查，再逐字段校验。
3. 使用 issues 累积所有问题，别发现第一个就 return。
4. 最后检查 id 重复、输出规范化和原数据不变。

## 本关需求就是你的验收合同

- 输入是 unknown，函数负责校验已解析的数据；此关不做 JSON 文本解析。
- 顶层必须是数组，错误路径 $；行必须是非 null、非数组对象，错误路径 $[i]。
- id 为正安全整数且全表唯一；遇到合法数字 id 就占位，即使该行其他字段错误。
- title 是 trim 后非空字符串；done 必须是 boolean，不能把字符串或数字强制转换。
- 收集全部问题，顺序为行顺序、同行 id → title → done。每个 Issue 包含 path 与非空 message。
- 只要有错就整体失败，不返回部分成功数据；成功返回新 Task 对象，剔除未知字段，不改输入。
- 不要求额外的属性描述符或原型安全处理；用普通 JSON 数据即可。

## 在哪里写、怎么检查

请编辑本地 TS 文件，用真正的编译器检查；网页展示起始代码和操作说明。

- [实验台第 17 关](http://127.0.0.1:8766/workshop/#17)（先启动 `npm run workshop`）。
- [本地练习](../practice/17.ts)。

```sh
npm run lab -- 17
npm run lab -- 17 --check
```

Windows PowerShell 中也可写 `npm.cmd run lab -- 17 --check`。初始代码故意没有满足合同。检查反馈会指出第一个不符合要求的行为；修正后重复检查。

## 先画执行过程，再写代码

在纸上或注释里写出每一步的输入、保存的状态、输出。异步挑战尤其要写明谁先开始、谁先结束，避免仅凭“这次看起来正常”判断正确。

<details>
<summary>提示 1：先自己尝试，再展开</summary>

Array.isArray 后接成 unknown[]，继续逐行收窄。为每行保存 `$[${index}]` 路径。

</details>

<details>
<summary>提示 2：先自己尝试，再展开</summary>

用 Set<number> 记录已遇到的合法 id；先登记 id，再检查该行其他字段。

</details>

<details>
<summary>提示 3：先自己尝试，再展开</summary>

只在所有校验通过时输出新 Task；只要 issues 非空就返回失败分支。

</details>

## 做完之后再给概念命名

这是边界校验与错误建模的组合。静态类型无法替你信任网络或文件内容。完整错误列表让用户一次修正多处数据；明确规范化、重复规则和整体失败策略可以避免业务歧义。

## 再加一个你自己的需求

增加可选 dueDate 字段，明确日期格式；再写一个把 Issue[] 按行分组显示的函数。

扩展不计入本关基础验收，需要你自己补例子验证。

## 复盘

记录一个起始代码会出错的具体输入、你选择的数据结构或控制方式、一个还未覆盖的场景。然后尝试把核心实现重新写一遍，不照着答案复制。

<details>
<summary>最后再看参考解法</summary>

[查看本关参考代码](../answers/practice/17.ts)。允许使用不同实现，只要满足上面的合同。不要覆盖其他已完成的练习。

</details>

[返回进阶路线](README.md)。
