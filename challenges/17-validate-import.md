# 17 · 导入脏数据时一次列出所有错误

本关按“讲解一段 → 就地小练习”学习，最后完成综合大练习。

<!-- foundations:start -->
## 边看边练

### 外面传来的任务，先一层一层检查

拿到一个 JSON 数组，不能因为给它写上 Task[]，就断定里面每一项都正确。像收快递一样：先确认是包裹，再拆开看每个东西。

#### 1 · 先排除 null 和数组

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

isRecord 先问三个问题：是不是对象、不是 null、不是数组。这只证明能按字段名读取，还没证明 title 和 done 都正确。

例子接着用 typeof input.title === "string" 检查标题确实是文字，再 trim 去空格，得到 JS。

done 的值是带引号的 "false"，它是文字。Boolean("false") 却会得到 true，因为非空文字在这个转换中算真。不能拿它当成真正的布尔 false。

因此读取每个字段之后仍要问：它的类型对不对，值的范围对不对。不要用一个“看起来像转换”的动作代替明确检查。


##### 就地小练习 17-01 · 先排除 null 和数组

只让普通对象形状通过，不让 null 或 [] 通过。

```ts
function isRecord(value: unknown): value is Record<string,unknown> { return typeof value === "object"; }
```

网页中在这一段下面直接练习。本地运行 `npm run drill -- 17-01 --prepare`，编辑 `practice/steps/17-01.ts`，再运行 `npm run drill -- 17-01 --check`。

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

#### 2 · 再问字段值是否真是布尔

按三个小题分开练：排除 null/数组 → 验证布尔字段 → 拼出清楚的错误路径。

然后按列表位置收集问题。例如第三项的标题为空，记录 [2].title；第三项的 done 类型错误，记录 [2].done。位置从 0 开始，所以第三项是 2。

最后处理重复 id：单看一项并不能发现它和前面某项相同，要另外记住已经出现的 id。先用只有两条重复记录的输入验证，再扩大列表。

如果要保留自己的实验，先运行 `npm run concept -- 17 --prepare`，修改创建的文件，再用 `npm run concept -- 17 --local` 运行。HTML 保存后刷新浏览器。重复准备会保留你已有的文件。


##### 就地小练习 17-02 · 再问字段值是否真是布尔

只允许 true 和 false，拒绝字符串 "false"。

```ts
function isDone(value: unknown): value is boolean { return Boolean(value); }
```

网页中在这一段下面直接练习。本地运行 `npm run drill -- 17-02 --prepare`，编辑 `practice/steps/17-02.ts`，再运行 `npm run drill -- 17-02 --check`。

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

#### 3 · 最后告诉用户哪一项错了

数据从文件、接口、用户进入程序的地方叫**输入边界**。检查成功后才当成具体类型使用，叫**运行时校验**。

`as Task[]` 只是对编译器说“相信我”，不会执行检查。类型谓词也要靠函数体真的检查正确，才能支撑它的承诺。

做完小练习后，回综合大练习把这些动作组合起来。若某一步仍说不清，就回到对应小题换一个数字再试；此时读更长的术语表帮助不大。


##### 就地小练习 17-03 · 最后告诉用户哪一项错了

输入下标 2 和字段 title，应返回 [2].title。

```ts
function issuePath(index: number, field: string): string { return field; }
```

网页中在这一段下面直接练习。本地运行 `npm run drill -- 17-03 --prepare`，编辑 `practice/steps/17-03.ts`，再运行 `npm run drill -- 17-03 --check`。

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

## 本关综合大练习

**把外部 unknown 校验成 Task[]；同时告诉用户每个错误在哪个字段。**

### 完成要求

- 输入是 unknown，函数负责校验已解析的数据；此关不做 JSON 文本解析。
- 顶层必须是数组，错误路径 $；行必须是非 null、非数组对象，错误路径 $[i]。
- id 为正安全整数且全表唯一；遇到合法数字 id 就占位，即使该行其他字段错误。
- title 是 trim 后非空字符串；done 必须是 boolean，不能把字符串或数字强制转换。
- 收集全部问题，顺序为行顺序、同行 id → title → done。每个 Issue 包含 path 与非空 message。
- 只要有错就整体失败，不返回部分成功数据；成功返回新 Task 对象，剔除未知字段，不改输入。
- 不要求额外的属性描述符或原型安全处理；用普通 JSON 数据即可。

### 在哪里写、怎么验收

编辑 [practice/17.ts](../practice/17.ts)，在项目根目录执行：

```sh
npm run lab -- 17
npm run lab -- 17 --check
```

起点只提供数据或函数外壳，需要自己把本关学过的动作组合起来。已有的旧版 practice 文件仍保留，新的基础综合题使用 practice/finals 目录。网页草稿与本地文件独立。

<details>
<summary>卡住时，再看解题思路</summary>

1. 先运行，观察重复 id、空标题和字符串 done 为什么被当成成功。
2. 先做顶层数组、行对象检查，再逐字段校验。
3. 使用 issues 累积所有问题，别发现第一个就 return。
4. 最后检查 id 重复、输出规范化和原数据不变。

Array.isArray 后接成 unknown[]，继续逐行收窄。为每行保存 `$[${index}]` 路径。

</details>

<details>
<summary>完成后复盘：这道题用到了什么</summary>

这是边界校验与错误建模的组合。静态类型无法替你信任网络或文件内容。完整错误列表让用户一次修正多处数据；明确规范化、重复规则和整体失败策略可以避免业务歧义。

</details>

### 完成后再加一个需求

增加可选 dueDate 字段，明确日期格式；再写一个把 Issue[] 按行分组显示的函数。

扩展不计入本关基础验收。

<details>
<summary>已经独立尝试，再看完整参考</summary>

[综合大练习参考](../answers/practice/17.ts)

</details>

[返回教学目录](../README.md)。
