# 16 · 并发控制：安排异步任务

本关按“讲解一段 → 就地小练习”学习，最后完成综合大练习。

<!-- foundations:start -->
## 边看边练

### 先控制什么时候启动，再限制同时做几件

想一次最多做两项任务，第一件事不是学复杂 Promise API，而是确认：工作有没有在你排队之前就开始。先把“动作”和“动作的结果”分开。

#### 1 · 先把启动动作推迟

先猜输出，再点运行。看不懂的行留到下一步逐行解释，不需要边看边查一串术语。

```js
const events = [];
const factories = [0, 1].map(id => async () => {
  events.push(`开始 ${id}`);
  return id * 10;
});
console.log(events.length);
const results = await Promise.all(factories.map(start => start()));
console.log(events, results);
```

原例可在终端运行：`npm run concept -- 16`。

factories 里放的是函数。创建函数时，函数体还没执行，所以第一次 events.length 输出 0。

map(start => start()) 这一步才依次调用它们，每个函数开始时往 events 记录一条“开始”。因此第二次输出能看到两次启动，以及结果 [0,10]。

这个例子没有做并发限制，它只证明“保存函数可以推迟启动”。如果创建数组时就调用 async 函数，拿到的 Promise 往往表示工作已经开始，晚点 await 也不能把启动时间倒回去。

完整并发池要保留原始下标：第 2 项先结束，也把它写回结果[1]，不要因为完成早就放在结果[0]。


##### 就地小练习 16-01 · 先把启动动作推迟

tasks 里应存函数。第一次调用前 started 为 0，调用第一项后变成 1。

```js
let started=0;
const tasks=[(() => { started+=1; return Promise.resolve(1); })()];
```

网页中在这一段下面直接练习。本地运行 `npm run drill -- 16-01 --prepare`，编辑 `practice/steps/16-01.js`，再运行 `npm run drill -- 16-01 --check`。

<details>
<summary>一点提示</summary>

移除把函数立即执行的那对末尾括号。

</details>

<details>
<summary>试过后再看解释</summary>

```js
let started=0;
const tasks=[() => { started+=1; return Promise.resolve(1); }];
```

排队要保存还没做的动作，不能保存已经启动的结果凭证。

</details>

#### 2 · 再把失败变成可保存的结果

先做任务工厂小题，确认未调用时 started=0。再做失败结果小题，让同步 throw 和异步 reject 都变成可以保存的结果。

最后做顺序小题：先记录 B 到位置 1，再记录 A 到位置 0，最终仍得到 [A,B]。

在纸上画上限 2：A、B 先开始；B 先结束就立刻让 C 补位，不用等 A。这和每两个一批、全部结束后再开下一批不同。

如果要保留自己的实验，先运行 `npm run concept -- 16 --prepare`，修改创建的文件，再用 `npm run concept -- 16 --local` 运行。HTML 保存后刷新浏览器。重复准备会保留你已有的文件。


##### 就地小练习 16-02 · 再把失败变成可保存的结果

settle(task) 成功返回 fulfilled，失败返回 rejected，不继续抛出。

```js
async function settle(task) { return {status:"fulfilled",value:await task()}; }
```

网页中在这一段下面直接练习。本地运行 `npm run drill -- 16-02 --prepare`，编辑 `practice/steps/16-02.js`，再运行 `npm run drill -- 16-02 --check`。

<details>
<summary>一点提示</summary>

try 同时包住调用 task 和 await 等待。

</details>

<details>
<summary>试过后再看解释</summary>

```js
async function settle(task) { try { return {status:"fulfilled",value:await task()}; } catch(reason) { return {status:"rejected",reason}; } }
```

某项失败被记录为数据后，调度器才有机会继续其他项。

</details>

#### 3 · 完成顺序不同也能按原顺序放

多项操作的等待区间相互重叠叫**并发**，并不表示 JS 算术一定在多核上同时做。

这里的任务工厂就是“调用才开始工作”的函数。Promise.all / allSettled 帮你收集结果，本身不替你控制启动数量。

做完小练习后，回综合大练习把这些动作组合起来。若某一步仍说不清，就回到对应小题换一个数字再试；此时读更长的术语表帮助不大。


##### 就地小练习 16-03 · 完成顺序不同也能按原顺序放

任务下标 1 先完成，再完成下标 0；最终仍应 [A,B]。

```js
const results=[];
function record(index,value) { results.push(value); }
record(1,"B");
record(0,"A");
```

网页中在这一段下面直接练习。本地运行 `npm run drill -- 16-03 --prepare`，编辑 `practice/steps/16-03.js`，再运行 `npm run drill -- 16-03 --check`。

<details>
<summary>一点提示</summary>

index 已经记录了这项在输入中的位置。

</details>

<details>
<summary>试过后再看解释</summary>

```js
const results=[];
function record(index,value) { results[index]=value; }
record(1,"B");
record(0,"A");
```

保存下标，可以把完成顺序与返回顺序分开。

</details>
<!-- foundations:end -->

## 综合大练习：做一个最多同时执行两项的任务池

**五项任务只同时运行两项，某项失败不影响其他项，结果仍按输入顺序返回。**

### 完成要求

- jobs 是尚未执行的函数数组，每个函数无参数，可同步返回值、返回 Promise 或抛错。
- limit 必须是正安全整数；即使 jobs 为空也先校验 limit。
- 同时运行数量不超过 limit；有空位就启动下一项，取任务按输入顺序。
- 单项结果为 {status:"fulfilled",value} 或 {status:"rejected",reason}；保留原始拒绝原因。
- 单项失败不打断其他项；所有项都结束后返回，结果顺序与输入一致。
- 本关不要求取消、重试或动态增加任务。jobs、日志回调之外无网络依赖。

### 在哪里写、怎么验收

编辑 [practice/16.js](../practice/16.js)，在项目根目录执行：

```sh
npm run lab -- 16
npm run lab -- 16 --check
```

起点只提供数据或函数外壳，需要自己把本关学过的动作组合起来。已有的旧版 practice 文件仍保留，新的基础综合题使用 practice/finals 目录。网页草稿与本地文件独立。

<details>
<summary>卡住时，再看解题思路</summary>

1. 运行，观察明明 limit=2，active 为什么超过 2。
2. 先做 limit=1 的顺序版本，保证失败也能继续。
3. 改成有限数量 worker，每个循环领取下一份工作。
4. 使用原输入下标写 results，再测试后发任务先完成。

jobs 必须是函数数组。如果先把所有 job() 调完，之后就无法限制启动数量。

</details>

<details>
<summary>完成后复盘：这道题用到了什么</summary>

Promise.allSettled 汇总每项成功或失败的结果；并发限制还需要控制任务何时启动。索引保存输入顺序，worker 控制活跃数量，逐项 catch 保证失败隔离。本关检查用手动释放的 Promise 控制顺序，不靠精确毫秒计时。

</details>

### 完成后再加一个需求

加入重试上限，只对指定错误重试；写明重试是否继续占用名额，以及结果记录几次尝试。

扩展不计入本关基础验收。

<details>
<summary>已经独立尝试，再看完整参考</summary>

[综合大练习参考](../answers/practice/16.js)

</details>

[返回教学目录](../README.md)。
