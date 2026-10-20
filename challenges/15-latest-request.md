# 15 · 修复搜索结果被旧请求覆盖

**做出来的效果：先搜 J，再搜 JS；即使 J 最后返回，页面仍保留 JS 的结果。**

建议预备知识：第 06 关，能独立写 async / await 和 try / catch。建议拆成 2～3 次完成，每次 25～35 分钟；卡住时先缩小输入，不必一次写完。

<!-- foundations:start -->
## 一步一步看懂，再拆开练

一次只看一小步。先运行具体代码、逐行看值怎样变化，做几个小练习后再组合成主挑战。

### 你后搜了 JS，为什么最后却显示 J

先搜索 J，再搜索 JS。用户想看 JS，但 J 的请求可能更慢，反而最后返回。如果每次返回都改页面，旧的 J 就会盖掉新结果。

#### 1 · 先看这一个例子

先猜输出，再点运行。看不懂的行留到下一步逐行解释，不需要边看边查一串术语。

```js
let finishOld;
const oldRequest = new Promise(resolve => { finishOld = resolve; });
const oldView = oldRequest.then(value => console.log(value));
const newView = Promise.resolve("新结果").then(value => console.log(value));
await newView;
finishOld("旧结果");
await oldView;
```

原例可在终端运行：`npm run concept -- 15`。

#### 2 · 一行一行看它做了什么

oldRequest 是一份暂时不交结果的 Promise。我们把“让它完成”的动作保存成 finishOld，稍后自己决定什么时候调用。

newView 先拿到“新结果”并输出。await newView 之后，我们才调用 finishOld("旧结果")，所以输出顺序必然是新结果→旧结果。

如果 console.log 换成同一个页面的 render，最后留下的就是旧内容。整个过程即使一次只执行一个回调，仍会出错，因为完成先后不代表用户意图的新旧。

解决线索是给每次发起分配序号。比如旧请求为 1，新请求为 2。完成时问“我还是最新的 2 吗”，不是就不改页面。

#### 3 · 改一点，再看一次

先练序号每次递增，不碰网络。再练 mayRender(1,2) 返回 false，mayRender(2,2) 返回 true。

然后把同样判断放到失败分支：旧请求报错也不该盖掉新请求的成功页面。

最后把两个关键词写成一样，仍用不同序号区分。仅比较关键词会把两次不同的请求混在一起。

如果要保留自己的实验，先运行 `npm run concept -- 15 --prepare`，修改创建的文件，再用 `npm run concept -- 15 --local` 运行。HTML 保存后刷新浏览器。重复准备会保留你已有的文件。

#### 4 · 分开练，先不做整道题

1. **先看两次调用如何编号**：同一工厂每次 next 得到 1、2；第二个工厂独立。
2. **再判断结果是否过期**：requestId 与 latestId 相同才允许显示。
3. **失败也要检查身份**：失败处理也遵守同一规则：旧失败返回 null，最新失败返回错误文字。

网页下方有对应的小练习。每次只做一题：先运行起点 → 修改 → 检查 → 说清变化。做对以后换下一题，不需要先把整个主挑战写完。TS 小练习显示本地文件和命令，由真实编译器检查。

#### 5 · 做过之后，再认识这些名字

结果依赖操作完成先后的问题叫**竞态条件**。序号是一次请求的**身份**。

忽略旧结果并不意味着已经取消网络请求。防抖可以减少发起次数，但不能保证已经发出去的请求按顺序完成。

做完小练习后，回主挑战把这些动作组合起来。若某一步仍说不清，就回到对应小题换一个数字再试；此时读更长的术语表帮助不大。
## 本关小步练习

### 15-01 · 先看两次调用如何编号

同一工厂每次 next 得到 1、2；第二个工厂独立。

```js
function createIds() { return () => { let id=0; return ++id; }; }
```

在实验台选择这道小题，或运行 `npm run drill -- 15-01 --prepare` 后编辑 `practice/steps/15-01.js`，再运行 `npm run drill -- 15-01 --check`。

<details>
<summary>一点提示</summary>

参照第 14 关：要记住的状态放在外层。

</details>

<details>
<summary>试过后再看解释</summary>

```js
function createIds() { let id=0; return () => ++id; }
```

编号表示一次调用的身份，比关键词更能区分重复请求。

</details>

### 15-02 · 再判断结果是否过期

requestId 与 latestId 相同才允许显示。

```js
function mayRender(requestId,latestId) { return true; }
```

在实验台选择这道小题，或运行 `npm run drill -- 15-02 --prepare` 后编辑 `practice/steps/15-02.js`，再运行 `npm run drill -- 15-02 --check`。

<details>
<summary>一点提示</summary>

问的是是不是最新发起的那一次。

</details>

<details>
<summary>试过后再看解释</summary>

```js
function mayRender(requestId,latestId) { return requestId === latestId; }
```

完成得晚不代表内容更新，要看发起时的身份。

</details>

### 15-03 · 失败也要检查身份

失败处理也遵守同一规则：旧失败返回 null，最新失败返回错误文字。

```js
function errorText(requestId,latestId) { return "请求失败"; }
```

在实验台选择这道小题，或运行 `npm run drill -- 15-03 --prepare` 后编辑 `practice/steps/15-03.js`，再运行 `npm run drill -- 15-03 --check`。

<details>
<summary>一点提示</summary>

把上一题的相等判断用到失败分支。

</details>

<details>
<summary>试过后再看解释</summary>

```js
function errorText(requestId,latestId) { return requestId===latestId ? "请求失败" : null; }
```

最新请求规则要同时应用到成功和失败结果。

</details>

<!-- foundations:end -->

## 先复现一个真实问题

1. 运行手动控制的两次请求：观察新结果之后又出现了旧结果。
2. 先实现每次调用都打印 loading，再给请求编号。
3. 让每个请求保存发起时的编号，完成时和最新编号比较。
4. 试旧请求失败、新请求成功；再试最新请求直接抛错。

## 本关需求就是你的验收合同

- 每次调用 search(query) 立即 render({status:"loading",query})。
- 仅最后发起的请求允许渲染终态；旧的成功和失败都应被忽略。
- 成功渲染 {status:"success",query,items}；失败渲染 {status:"error",query,error:string}。
- fetcher 同步抛错和 Promise 拒绝都要接住；search 的正常失败不向调用方继续抛出。
- 相同关键词的多次请求也要区分；不同工厂实例的序号独立。
- 本关忽略旧响应，不要求取消底层网络请求；render 视为不会抛错。

## 在哪里写、怎么检查

可以在实验台直接改代码运行，也可以编辑下面的本地文件。两处草稿独立保存。

- [实验台第 15 关](http://127.0.0.1:8766/workshop/#15)（先启动 `npm run workshop`）。
- [本地练习](../practice/15.js)。

```sh
npm run lab -- 15
npm run lab -- 15 --check
```

Windows PowerShell 中也可写 `npm.cmd run lab -- 15 --check`。初始代码故意没有满足合同。检查反馈会指出第一个不符合要求的行为；修正后重复检查。

## 先画执行过程，再写代码

在纸上或注释里写出每一步的输入、保存的状态、输出。异步挑战尤其要写明谁先开始、谁先结束，避免仅凭“这次看起来正常”判断正确。

<details>
<summary>提示 1：先自己尝试，再展开</summary>

给每个实例保存递增计数器；调用开始时先 ++，然后再 await。

</details>

<details>
<summary>提示 2：先自己尝试，再展开</summary>

不要只比较 query，相同关键词可能重复请求。需要比较本次序号与最新序号。

</details>

<details>
<summary>提示 3：先自己尝试，再展开</summary>

try 包住 fetcher(query) 和 await；catch 里同样先确认请求仍是最新的。

</details>

## 做完之后再给概念命名

await 只保证单条异步流程内部的先后，不会保证多次调用的完成顺序。这是竞态条件。请求序号把“最后发起的用户意图”与“最后完成的请求”区分开，错误分支也必须遵守相同约定。

## 再加一个你自己的需求

把控制器接到第 07 关的搜索框；再增加防抖。写出防抖为什么不能单独解决已发出请求的乱序问题。

扩展不计入本关基础验收，需要你自己补例子验证。

## 复盘

记录一个起始代码会出错的具体输入、你选择的数据结构或控制方式、一个还未覆盖的场景。然后尝试把核心实现重新写一遍，不照着答案复制。

<details>
<summary>最后再看参考解法</summary>

[查看本关参考代码](../answers/practice/15.js)。允许使用不同实现，只要满足上面的合同。不要覆盖其他已完成的练习。

</details>

[返回进阶路线](README.md)。
