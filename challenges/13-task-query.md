# 13 · 数据查询：组合筛选、排序和分页

本关按“讲解一段 → 就地小练习”学习，最后完成综合大练习。

<!-- foundations:start -->
## 边看边练

### 先筛选，再排序，最后只取一页

把任务查询想成整理一摞卡片：先留下符合条件的卡，再按顺序排好，最后拿出某一页。筛选、排序、分页各产生一份结果，打印中间数组就能看到哪一步处理错了。

#### 1 · 先把数字排对

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

durations 起初是 [12,3,25,8]。filter 留下 >=8 的数，所以 matched 是 [12,25,8]，一共 3 个。

`[...matched]` 先做一个新数组，sort 在它上面排序。比较函数 a-b 让数字按从小到大排，所以 ordered 是 [8,12,25]。

每页 size=2，第 1 页拿位置 0、1，第 2 页从位置 2 开始，所以结果只有 [25]。slice 的结束位置不包括在内。

matched.length 是筛选后的全部条数 3，不能因为当前页只有一个就说全部只有一个。原输入 durations 也应保持原顺序。


sort 接收的比较函数返回负数表示 a 应在 b 前，正数表示 a 应在 b 后，0 表示本次比较看作相等；不是返回 true 才保留元素。`(a,b) => a-b` 因此适用于数字升序，`b-a` 是降序。

sort 会修改调用它的数组；slice 返回另一份数组，不会删掉原元素。`slice(start,end)` 的第二个数字是结束下标且不包含它，不是“取多少个”。本关先复制再排序，是为了保留调用者的数据，不是排序语法必须多写一对方括号。

##### 就地小练习 13-01 · 先把数字排对

返回数字升序，保留输入顺序。

```js
function sorted(values) { return values.sort(); }
```

网页中在这一段下面直接练习。本地运行 `npm run drill -- 13-01 --prepare`，编辑 `practice/steps/13-01.js`，再运行 `npm run drill -- 13-01 --check`。

<details>
<summary>一点提示</summary>

先 [...values]，再 .sort((a,b)=>a-b)。

</details>

<details>
<summary>参考答案与解释</summary>

```js
function sorted(values) { return [...values].sort((a,b)=>a-b); }
```

排序规则和是否改原数据是两件要分别决定的事。

</details>

#### 2 · 再只取一页

先用排好序的数据，只观察分页这一件事：

```js
const items = [1, 2, 3, 4, 5];
const page = 2;
const size = 2;
const start = (page - 1) * size;
console.log(items.slice(start, start + size));
```

输出 [3,4]。把 page 改为 3，得到 [5]；改为 4，得到 []。size 改为 1 后，再逐页观察。

手算 page=3、size=2 的起点：(3-1)×2=4，对应本段 items 中的数字 5。分页的结束位置不包含在结果中，所以 slice(4,6) 最多取下标 4、5 的元素。

最后才组合关键词、完成状态、排序、分页，并用一个非常小的输入逐步打印每个中间结果。


##### 就地小练习 13-02 · 再只取一页

page 从 1 开始。实现第 2 页、每页 2 条时取 [3,4]。

```js
function pageOf(items,page,size) { return items.slice(page,size); }
```

网页中在这一段下面直接练习。本地运行 `npm run drill -- 13-02 --prepare`，编辑 `practice/steps/13-02.js`，再运行 `npm run drill -- 13-02 --check`。

<details>
<summary>一点提示</summary>

slice 的第二个参数是结束位置，不是取几条。

</details>

<details>
<summary>参考答案与解释</summary>

```js
function pageOf(items,page,size) { return items.slice((page-1)*size,page*size); }
```

页码从 1 开始，数组位置从 0 开始，所以需要减 1。

</details>

#### 3 · 总条数要在分页前数

总条数和本页条数要从不同位置读取：

```js
const matched = [1, 2, 3, 4, 5];
const items = matched.slice(0, 2);
console.log({ total: matched.length, items });
```

输出 total=5、items=[1,2]。把 total 写成 items.length 会错误地得到 2。

这种把输入依次交给几个步骤处理的写法，常叫**管道**。sort 回调的负数/正数回答谁排前面，叫**比较器**。

先知道每步产生哪份数组，再决定边界值和总数，避免只看最后一页来猜哪一步出错。


参考排序规则 b.priority - a.priority || a.id - b.id 使用了第 02 关的短路规则：优先级不同，第一个差值不是 0，就用它；优先级相同时差值为 0，才用 id 差值作为第二条规则。可以展开成 if 判断，得到同样的排序，不是把两个比较结果做加法。

字符串的 .toLowerCase() 返回小写版本，.includes(keyword) 检查是否包含子串；数组的 .includes(value) 检查是否包含某个元素，是同名的不同方法。标题搜索先统一大小写再判断，才不会把 JS 与 js 当作不同关键词。

##### 就地小练习 13-03 · 总条数要在分页前数

有 5 个结果，每页只显示 2 个；total 应为 5。

```js
function result(items) { const page=items.slice(0,2); return {items:page,total:page.length}; }
```

网页中在这一段下面直接练习。本地运行 `npm run drill -- 13-03 --prepare`，编辑 `practice/steps/13-03.js`，再运行 `npm run drill -- 13-03 --check`。

<details>
<summary>一点提示</summary>

分页前的 items 才包含全部匹配结果。

</details>

<details>
<summary>参考答案与解释</summary>

```js
function result(items) { const page=items.slice(0,2); return {items:page,total:items.length}; }
```

两个长度回答两个不同问题：这一页有多少，全部有多少。

</details>
<!-- foundations:end -->

## 综合大练习：给任务列表加搜索、排序和分页

**搜索 JS，只看未完成任务，按优先级排列，再取指定页；原列表不变。**

### 题目要求

- 数据已满足 {id,title,done,priority} 结构；priority 越大越靠前。
- 关键词 trim 后忽略大小写，按标题包含匹配；空关键词匹配全部。
- status 仅允许 all / pending / done。排序先按 priority 降序，同分按 id 升序。
- page 从 1 开始；page、pageSize 必须为正安全整数，否则抛错。
- 返回 {total,items}；total 是筛选后分页前的数量。超出末页返回空 items。
- 不得修改输入数组、对象或 options。

### 输入与预期结果

用起点里的数据搜索 js、每页 1 条：第 1 页应是 id=2，第 2 页是 id=1；两页的 total 都是 2。

### 在哪里写、怎么验收

编辑 [practice/13.js](../practice/13.js)，在项目根目录执行：

```sh
npm run lab -- 13
npm run lab -- 13 --check
```

起点只提供数据或函数外壳，需要自己把本关学过的动作组合起来。已有的旧版 practice 文件仍保留，新的基础综合题使用 practice/finals 目录。网页草稿与本地文件独立。

<details>
<summary>卡住时，再看解题思路</summary>

1. 先运行：搜索 js、每页 1 项，为什么第一项不是优先级更高的任务？
2. 先只做搜索和状态筛选，打印中间列表。
3. 加入排序，再分页；用 page 2、page 99 试边界。
4. 跑检查，最后确认原数组顺序没有改变。

先按“筛选 → 排序 → 计算 total → slice”拆成四段。

</details>

<details>
<summary>相关知识</summary>

这是一个数据查询管道：把小步骤组合成业务行为。分页不该影响总数；排序要有明确的同分规则；不可变更新使原数据能继续给其他视图使用。

</details>

### 完成后再加一个需求

增加“按标题升序”的排序选项，给同名任务指定 id 兜底规则；再写出页码变化时的 3 个验收例子。

扩展不计入本关基础验收。

<details>
<summary>参考答案</summary>

[综合大练习参考](../answers/practice/13.js)

</details>

[返回教学目录](../README.md)。
