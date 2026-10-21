# 15 · 请求竞态：让最新搜索结果生效

本关按“讲解一段 → 就地小练习”学习，最后完成综合大练习。

<!-- foundations:start -->
## 边看边练

### 你后搜了 JS，为什么最后却显示 J

先搜索 J，再搜索 JS。用户想看 JS，但 J 的请求可能更慢，反而最后返回。如果每次返回都改页面，旧的 J 就会盖掉新结果。

#### 1 · 先看两次调用如何编号

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

oldRequest 是一份暂时不交结果的 Promise。我们把“让它完成”的动作保存成 finishOld，稍后自己决定什么时候调用。

newView 先拿到“新结果”并输出。await newView 之后，我们才调用 finishOld("旧结果")，所以输出顺序必然是新结果→旧结果。

如果 console.log 换成同一个页面的 render，最后留下的就是旧内容。整个过程即使一次只执行一个回调，仍会出错，因为完成先后不代表用户意图的新旧。

解决线索是给每次发起分配序号。比如旧请求为 1，新请求为 2。完成时问“我还是最新的 2 吗”，不是就不改页面。


`let finishOld;` 允许先声明而不赋值，此刻是 undefined。new Promise 中的函数会在创建时立即执行，把本次的 resolve 保存给 finishOld；只有之后调用 finishOld 才让这个 Promise 成功。若在保存前就试图调用这个变量，会因它不是函数而失败。

`.then(value => ...)` 注册成功时的回调，方法本身返回另一个 Promise。这里 oldView 等待的是日志回调完成后的结果；只写 .then 而不加调用括号，不会注册回调。`++latest` 和 `latest++` 都会加 1，但前者交回新值，后者交回旧值，赋给 requestId 时要看清楚差别。

##### 就地小练习 15-01 · 先看两次调用如何编号

同一工厂每次 next 得到 1、2；第二个工厂独立。

```js
function createIds() { return () => { let id=0; return ++id; }; }
```

网页中在这一段下面直接练习。本地运行 `npm run drill -- 15-01 --prepare`，编辑 `practice/steps/15-01.js`，再运行 `npm run drill -- 15-01 --check`。

<details>
<summary>一点提示</summary>

参照第 14 关：要记住的状态放在外层。

</details>

<details>
<summary>参考答案与解释</summary>

```js
function createIds() { let id=0; return () => ++id; }
```

编号表示一次调用的身份，比关键词更能区分重复请求。

</details>

#### 2 · 再判断结果是否过期

先练序号每次递增，不碰网络。再练 mayRender(1,2) 返回 false，mayRender(2,2) 返回 true。

然后把同样判断放到失败分支：旧请求报错也不该盖掉新请求的成功页面。

最后把两个关键词写成一样，仍用不同序号区分。仅比较关键词会把两次不同的请求混在一起。


综合题用 new Map() 保存“关键词 → 对应的完成函数”。pending.set(query,resolve) 放进去，pending.get(query) 按关键词取出；找不到键时返回 undefined。Map 是运行时的数据容器，和数组的 .map 转换方法不是同一个东西。

`pending.get("JS")(["结果"])` 可以拆成 `const finish = pending.get("JS"); finish(["结果"]);`：第一对括号调用 get，第二对括号调用取出的函数。若关键词拼错，get 拿到 undefined，第二次调用就会失败。这个示例为每个关键词只保留一份完成函数；完整搜索是否过期，仍要按请求序号判断。

##### 就地小练习 15-02 · 再判断结果是否过期

requestId 与 latestId 相同才允许显示。

```js
function mayRender(requestId,latestId) { return true; }
```

网页中在这一段下面直接练习。本地运行 `npm run drill -- 15-02 --prepare`，编辑 `practice/steps/15-02.js`，再运行 `npm run drill -- 15-02 --check`。

<details>
<summary>一点提示</summary>

问的是是不是最新发起的那一次。

</details>

<details>
<summary>参考答案与解释</summary>

```js
function mayRender(requestId,latestId) { return requestId === latestId; }
```

完成得晚不代表内容更新，要看发起时的身份。

</details>

#### 3 · 失败也要检查身份

结果依赖操作完成先后的问题叫**竞态条件**。序号是一次请求的**身份**。

忽略旧结果并不意味着已经取消网络请求。防抖可以减少发起次数，但不能保证已经发出去的请求按顺序完成。


catch 收到的不一定是 Error，JS 也允许 throw 一个字符串或其他值。参考写法 error instanceof Error ? error.message : String(error) 检查是否为 Error 或其子类的实例：是就取 message，否则转成可显示文字。instanceof 是运行时运算符，不是 TS 的类型断言；写 typeof error === "object" 不能代替它，因为 null 等其他值也会得到 object。

##### 就地小练习 15-03 · 失败也要检查身份

失败处理也遵守同一规则：旧失败返回 null，最新失败返回错误文字。

```js
function errorText(requestId,latestId) { return "请求失败"; }
```

网页中在这一段下面直接练习。本地运行 `npm run drill -- 15-03 --prepare`，编辑 `practice/steps/15-03.js`，再运行 `npm run drill -- 15-03 --check`。

<details>
<summary>一点提示</summary>

把上一题的相等判断用到失败分支。

</details>

<details>
<summary>参考答案与解释</summary>

```js
function errorText(requestId,latestId) { return requestId===latestId ? "请求失败" : null; }
```

最新请求规则要同时应用到成功和失败结果。

</details>
<!-- foundations:end -->

## 综合大练习：修复搜索结果被旧请求覆盖

**先搜 J，再搜 JS；即使 J 最后返回，页面仍保留 JS 的结果。**

### 完成要求

- 每次调用 search(query) 立即 render({status:"loading",query})。
- 仅最后发起的请求允许渲染终态；旧的成功和失败都应被忽略。
- 成功渲染 {status:"success",query,items}；失败渲染 {status:"error",query,error:string}。
- fetcher 同步抛错和 Promise 拒绝都要接住；search 的正常失败不向调用方继续抛出。
- 相同关键词的多次请求也要区分；不同工厂实例的序号独立。
- 本关忽略旧响应，不要求取消底层网络请求；render 视为不会抛错。

### 在哪里写、怎么验收

编辑 [practice/15.js](../practice/15.js)，在项目根目录执行：

```sh
npm run lab -- 15
npm run lab -- 15 --check
```

起点只提供数据或函数外壳，需要自己把本关学过的动作组合起来。已有的旧版 practice 文件仍保留，新的基础综合题使用 practice/finals 目录。网页草稿与本地文件独立。

<details>
<summary>卡住时，再看解题思路</summary>

1. 运行手动控制的两次请求：观察新结果之后又出现了旧结果。
2. 先实现每次调用都打印 loading，再给请求编号。
3. 让每个请求保存发起时的编号，完成时和最新编号比较。
4. 试旧请求失败、新请求成功；再试最新请求直接抛错。

给每个实例保存递增计数器；调用开始时先 ++，然后再 await。

</details>

<details>
<summary>相关知识</summary>

await 只保证单条异步流程内部的先后，不会保证多次调用的完成顺序。这是竞态条件。请求序号把“最后发起的用户意图”与“最后完成的请求”区分开，错误分支也必须遵守相同约定。

</details>

### 完成后再加一个需求

把控制器接到第 07 关的搜索框；再增加防抖。写出防抖为什么不能单独解决已发出请求的乱序问题。

扩展不计入本关基础验收。

<details>
<summary>参考答案</summary>

[综合大练习参考](../answers/practice/15.js)

</details>

[返回教学目录](../README.md)。
