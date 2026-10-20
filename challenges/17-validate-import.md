# 17 · 导入脏数据时一次列出所有错误

**做出来的效果：把外部 unknown 校验成 Task[]；同时告诉用户每个错误在哪个字段。**

建议预备知识：第 09～11 关，理解 unknown 和判别联合。建议拆成 2～3 次完成，每次 25～35 分钟；卡住时先缩小输入，不必一次写完。

<!-- foundations:start -->
## 动手前先认识

先读下面几个概念，再展开小例子预测输出。看完即可回到本关练习，不必先背术语。

### 运行时校验、类型守卫与错误路径

**信任边界**是数据从文件、接口或用户输入进入程序的位置。TS 类型不会随外部 JSON 一起被验证；需要在运行时检查后，才能把 unknown 当作 Task 使用。

- **类型守卫**用真实条件提供证据；普通对象检查至少要排除 null，也要按需求排除数组。`typeof value === "object"` 单独使用不够。
- **分层校验**：先外层是否数组，再每项是否对象，再字段类型和取值，再检查重复 id 等跨项规则。不要把一层通过误认为全部通过。
- **规范化与校验**：trim 可以清理标题两侧空白；字符串 "false" 不能直接当布尔 false，Boolean("false") 实际为 true。是否转换必须由合同明确。
- **错误集合**记录每个问题的路径和原因，例如 `[2].title` 表示第三项的 title。累积问题能让用户一次修正多处。
- **断言与证据**：`input as Task[]` 只改变编译器看法；类型谓词也要由正确的函数实现支撑，不会自动验证函数体承诺的结构。

<details>
<summary>读例子 → 改一个地方 → 检查理解</summary>

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

**逐步理解**：输出“JS”和“string true”。对象守卫只证明能按键读取 unknown 字段，不能证明 done 符合 boolean；仍需逐字段检查。

**动手试一试**：把 input 改为 null、[]、{ title: 123 }，观察保护分支。再写下 done 错误应对应什么路径。

这是独立的概念小实验，不计入本关验收。先在项目根目录运行 `npm run concept -- 17` 查看原例输出（TS 关卡先运行 `npm ci` 安装编译器）。运行 `npm run concept -- 17 --prepare` 创建 `practice/concepts/17.ts`，修改后用 `npm run concept -- 17 --local` 体验自己的版本。重复准备会保留你的修改，挑战代码不受影响。

**先回答，再展开**：为什么校验函数最好构造干净的新任务，而不是直接返回带断言的原始对象？

<details>
<summary>查看解释</summary>

构造新值可以明确保留已验证字段和规范化结果，减少共享输入被修改或未校验字段混入的风险；断言本身没有检查作用。

</details>

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
