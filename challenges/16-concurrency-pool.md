# 16 · 做一个最多同时执行两项的任务池

**做出来的效果：五项任务只同时运行两项，某项失败不影响其他项，结果仍按输入顺序返回。**

建议预备知识：第 15 关，理解 Promise 与独立异步流程。建议拆成 2～3 次完成，每次 25～35 分钟；卡住时先缩小输入，不必一次写完。

<!-- foundations:start -->
## 动手前先认识

先读下面几个概念，再展开小例子预测输出。看完即可回到本关练习，不必先背术语。

### 任务工厂、并发上限与结果顺序

**并发**指多项操作的等待区间互相重叠；不等于多段 JS 计算一定在多核上同时运行。网络请求并发等待很常见，CPU 密集工作则是另一类问题。

- **任务工厂**是 `() => Promise` 这样的函数。调用才发起工作；已经创建的 Promise 往往代表工作已经启动，排队保存 Promise 不能推迟它的开始。
- **并发上限**限制同时进行的任务数。一个任务结束后释放位置，再领取下一项；不是每隔固定时间才启动下一批。
- **结果顺序**：启动顺序、完成顺序和返回数组顺序是三回事。给任务分配原始下标，把完成结果写回对应位置，可保留输入顺序。
- **settled 结果**把成功和失败都表示为数据。某项失败时仍要释放位置并继续其他项；同步 throw 与异步 reject 都要处理。
- **Promise.all / allSettled**负责聚合已给出的任务结果，本身不提供本关要求的并发数量限制。

<details>
<summary>读例子 → 改一个地方 → 检查理解</summary>

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

**逐步理解**：第一次输出 0，说明仅创建函数还没启动任务；调用 start 后才记录开始。结果 [0, 10] 保留输入顺序，这个示例没有限制并发数。

**动手试一试**：把创建 factories 时的 async 箭头函数立即调用，观察第一次输出是否还为 0。画出上限 2、任务耗时各不相同时谁应最先补位。

这是独立的概念小实验，不计入本关验收。先在项目根目录运行 `npm run concept -- 16` 查看原例输出（TS 关卡先运行 `npm ci` 安装编译器）。运行 `npm run concept -- 16 --prepare` 创建 `practice/concepts/16.mjs`，修改后用 `npm run concept -- 16 --local` 体验自己的版本。重复准备会保留你的修改，挑战代码不受影响。

**先回答，再展开**：为什么把 100 个已经发出的 fetch Promise 放进数组，再每次取两个 await，不能控制只有两个请求在进行？

<details>
<summary>查看解释</summary>

fetch 调用已经发起请求，await 只是等待。必须把发起动作延迟到领取任务时，也就是排队保存可调用的任务工厂。

</details>

</details>
<!-- foundations:end -->

## 先复现一个真实问题

1. 运行，观察明明 limit=2，active 为什么超过 2。
2. 先做 limit=1 的顺序版本，保证失败也能继续。
3. 改成有限数量 worker，每个循环领取下一份工作。
4. 使用原输入下标写 results，再测试后发任务先完成。

## 本关需求就是你的验收合同

- jobs 是尚未执行的函数数组，每个函数无参数，可同步返回值、返回 Promise 或抛错。
- limit 必须是正安全整数；即使 jobs 为空也先校验 limit。
- 同时运行数量不超过 limit；有空位就启动下一项，取任务按输入顺序。
- 单项结果为 {status:"fulfilled",value} 或 {status:"rejected",reason}；保留原始拒绝原因。
- 单项失败不打断其他项；所有项都结束后返回，结果顺序与输入一致。
- 本关不要求取消、重试或动态增加任务。jobs、日志回调之外无网络依赖。

## 在哪里写、怎么检查

可以在实验台直接改代码运行，也可以编辑下面的本地文件。两处草稿独立保存。

- [实验台第 16 关](http://127.0.0.1:8766/workshop/#16)（先启动 `npm run workshop`）。
- [本地练习](../practice/16.js)。

```sh
npm run lab -- 16
npm run lab -- 16 --check
```

Windows PowerShell 中也可写 `npm.cmd run lab -- 16 --check`。初始代码故意没有满足合同。检查反馈会指出第一个不符合要求的行为；修正后重复检查。

## 先画执行过程，再写代码

在纸上或注释里写出每一步的输入、保存的状态、输出。异步挑战尤其要写明谁先开始、谁先结束，避免仅凭“这次看起来正常”判断正确。

<details>
<summary>提示 1：先自己尝试，再展开</summary>

jobs 必须是函数数组。如果先把所有 job() 调完，之后就无法限制启动数量。

</details>

<details>
<summary>提示 2：先自己尝试，再展开</summary>

共享一个 next 索引；每个 worker 在 await 前领取索引并递增。

</details>

<details>
<summary>提示 3：先自己尝试，再展开</summary>

每项单独 try / catch，再继续循环；最后 Promise.all 等待所有 worker 结束。

</details>

## 做完之后再给概念命名

Promise.allSettled 汇总每项成功或失败的结果；并发限制还需要控制任务何时启动。索引保存输入顺序，worker 控制活跃数量，逐项 catch 保证失败隔离。本关检查用手动释放的 Promise 控制顺序，不靠精确毫秒计时。

## 再加一个你自己的需求

加入重试上限，只对指定错误重试；写明重试是否继续占用名额，以及结果记录几次尝试。

扩展不计入本关基础验收，需要你自己补例子验证。

## 复盘

记录一个起始代码会出错的具体输入、你选择的数据结构或控制方式、一个还未覆盖的场景。然后尝试把核心实现重新写一遍，不照着答案复制。

<details>
<summary>最后再看参考解法</summary>

[查看本关参考代码](../answers/practice/16.js)。允许使用不同实现，只要满足上面的合同。不要覆盖其他已完成的练习。

</details>

[返回进阶路线](README.md)。
