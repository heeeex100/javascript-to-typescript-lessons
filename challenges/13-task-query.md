# 13 · 做一个能搜索、排序、翻页的任务列表

**做出来的效果：搜索 JS，只看未完成任务，按优先级排列，再取指定页；原列表不变。**

建议预备知识：第 02～04 关，能独立使用 filter / map。建议拆成 2～3 次完成，每次 25～35 分钟；卡住时先缩小输入，不必一次写完。

<!-- foundations:start -->
## 一步一步看懂，再拆开练

一次只看一小步。先运行具体代码、逐行看值怎样变化，做几个小练习后再组合成主挑战。

### 先筛选，再排序，最后只取一页

把任务查询想成整理一摞卡片：先留下符合条件的卡，再按顺序排好，最后拿出某一页。先不把所有功能写进一条长表达式。

#### 1 · 先看这一个例子

先猜输出，再点运行。看不懂的行留到下一步逐行解释，不需要边看边查一串术语。

```js
const durations = [12, 3, 25, 8];
const matched = durations.filter(value => value >= 8);
const ordered = [...matched].sort((a, b) => a - b);
const page = 2;
const size = 2;
console.log(ordered.slice((page - 1) * size, page * size));
console.log(matched.length, durations);
```

原例可在终端运行：`npm run concept -- 13`。

#### 2 · 一行一行看它做了什么

durations 起初是 [12,3,25,8]。filter 留下 >=8 的数，所以 matched 是 [12,25,8]，一共 3 个。

`[...matched]` 先做一个新数组，sort 在它上面排序。比较函数 a-b 让数字按从小到大排，所以 ordered 是 [8,12,25]。

每页 size=2，第 1 页拿位置 0、1，第 2 页从位置 2 开始，所以结果只有 [25]。slice 的结束位置不包括在内。

matched.length 是筛选后的全部条数 3，不能因为当前页只有一个就说全部只有一个。原输入 durations 也应保持原顺序。

#### 3 · 改一点，再看一次

先只跑排序小题，确认 [12,3,25] 变成 [3,12,25]。如果直接 sort() 不写比较函数，数字会按文本方式排，12 可能排在 3 前。

再手算 page=3、size=2 的起点：(3-1)×2=4。把 size 改为 1，列出前三页各有什么。

最后才组合关键词、完成状态、排序、分页，并用一个非常小的输入逐步打印每个中间结果。

如果要保留自己的实验，先运行 `npm run concept -- 13 --prepare`，修改创建的文件，再用 `npm run concept -- 13 --local` 运行。HTML 保存后刷新浏览器。重复准备会保留你已有的文件。

#### 4 · 分开练，先不做整道题

1. **先把数字排对**：返回数字升序，保留输入顺序。
2. **再只取一页**：page 从 1 开始。实现第 2 页、每页 2 条时取 [3,4]。
3. **总条数要在分页前数**：有 5 个结果，每页只显示 2 个；total 应为 5。

网页下方有对应的小练习。每次只做一题：先运行起点 → 修改 → 检查 → 说清变化。做对以后换下一题，不需要先把整个主挑战写完。TS 小练习显示本地文件和命令，由真实编译器检查。

#### 5 · 做过之后，再认识这些名字

这种把输入依次交给几个步骤处理的写法，常叫**管道**。sort 回调的负数/正数回答谁排前面，叫**比较器**。

先知道每步产生哪份数组，再决定边界值和总数，避免只看最后一页来猜哪一步出错。

做完小练习后，回主挑战把这些动作组合起来。若某一步仍说不清，就回到对应小题换一个数字再试；此时读更长的术语表帮助不大。
## 本关小步练习

### 13-01 · 先把数字排对

返回数字升序，保留输入顺序。

```js
function sorted(values) { return values.sort(); }
```

在实验台选择这道小题，或运行 `npm run drill -- 13-01 --prepare` 后编辑 `practice/steps/13-01.js`，再运行 `npm run drill -- 13-01 --check`。

<details>
<summary>一点提示</summary>

先 [...values]，再 .sort((a,b)=>a-b)。

</details>

<details>
<summary>试过后再看解释</summary>

```js
function sorted(values) { return [...values].sort((a,b)=>a-b); }
```

排序规则和是否改原数据是两件要分别决定的事。

</details>

### 13-02 · 再只取一页

page 从 1 开始。实现第 2 页、每页 2 条时取 [3,4]。

```js
function pageOf(items,page,size) { return items.slice(page,size); }
```

在实验台选择这道小题，或运行 `npm run drill -- 13-02 --prepare` 后编辑 `practice/steps/13-02.js`，再运行 `npm run drill -- 13-02 --check`。

<details>
<summary>一点提示</summary>

slice 的第二个参数是结束位置，不是取几条。

</details>

<details>
<summary>试过后再看解释</summary>

```js
function pageOf(items,page,size) { return items.slice((page-1)*size,page*size); }
```

页码从 1 开始，数组位置从 0 开始，所以需要减 1。

</details>

### 13-03 · 总条数要在分页前数

有 5 个结果，每页只显示 2 个；total 应为 5。

```js
function result(items) { const page=items.slice(0,2); return {items:page,total:page.length}; }
```

在实验台选择这道小题，或运行 `npm run drill -- 13-03 --prepare` 后编辑 `practice/steps/13-03.js`，再运行 `npm run drill -- 13-03 --check`。

<details>
<summary>一点提示</summary>

分页前的 items 才包含全部匹配结果。

</details>

<details>
<summary>试过后再看解释</summary>

```js
function result(items) { const page=items.slice(0,2); return {items:page,total:items.length}; }
```

两个长度回答两个不同问题：这一页有多少，全部有多少。

</details>

<!-- foundations:end -->

## 先复现一个真实问题

1. 先运行：搜索 js、每页 1 项，为什么第一项不是优先级更高的任务？
2. 先只做搜索和状态筛选，打印中间列表。
3. 加入排序，再分页；用 page 2、page 99 试边界。
4. 跑检查，最后确认原数组顺序没有改变。

## 本关需求就是你的验收合同

- 数据已满足 {id,title,done,priority} 结构；priority 越大越靠前。
- 关键词 trim 后忽略大小写，按标题包含匹配；空关键词匹配全部。
- status 仅允许 all / pending / done。排序先按 priority 降序，同分按 id 升序。
- page 从 1 开始；page、pageSize 必须为正安全整数，否则抛错。
- 返回 {total,items}；total 是筛选后分页前的数量。超出末页返回空 items。
- 不得修改输入数组、对象或 options。

## 在哪里写、怎么检查

可以在实验台直接改代码运行，也可以编辑下面的本地文件。两处草稿独立保存。

- [实验台第 13 关](http://127.0.0.1:8766/workshop/#13)（先启动 `npm run workshop`）。
- [本地练习](../practice/13.js)。

```sh
npm run lab -- 13
npm run lab -- 13 --check
```

Windows PowerShell 中也可写 `npm.cmd run lab -- 13 --check`。初始代码故意没有满足合同。检查反馈会指出第一个不符合要求的行为；修正后重复检查。

## 先画执行过程，再写代码

在纸上或注释里写出每一步的输入、保存的状态、输出。异步挑战尤其要写明谁先开始、谁先结束，避免仅凭“这次看起来正常”判断正确。

<details>
<summary>提示 1：先自己尝试，再展开</summary>

先按“筛选 → 排序 → 计算 total → slice”拆成四段。

</details>

<details>
<summary>提示 2：先自己尝试，再展开</summary>

sort 会修改调用它的数组；筛选得到新数组后再排序，或先用展开复制。

</details>

<details>
<summary>提示 3：先自己尝试，再展开</summary>

页起点是 (page - 1) * pageSize；排序比较函数可以用优先级差值，再用 id 差值兜底。

</details>

## 做完之后再给概念命名

这是一个数据查询管道：把小步骤组合成业务行为。分页不该影响总数；排序要有明确的同分规则；不可变更新使原数据能继续给其他视图使用。

## 再加一个你自己的需求

增加“按标题升序”的排序选项，给同名任务指定 id 兜底规则；再写出页码变化时的 3 个验收例子。

扩展不计入本关基础验收，需要你自己补例子验证。

## 复盘

记录一个起始代码会出错的具体输入、你选择的数据结构或控制方式、一个还未覆盖的场景。然后尝试把核心实现重新写一遍，不照着答案复制。

<details>
<summary>最后再看参考解法</summary>

[查看本关参考代码](../answers/practice/13.js)。允许使用不同实现，只要满足上面的合同。不要覆盖其他已完成的练习。

</details>

[返回进阶路线](README.md)。
