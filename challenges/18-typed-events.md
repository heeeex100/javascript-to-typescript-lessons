# 18 · 做一个事件名与载荷严格对应的通知器

**做出来的效果：订阅任务事件、发送通知、取消订阅；错误的事件名或载荷在编译时被拦住。**

建议预备知识：第 11、17 关，理解 keyof、泛型和函数回调。建议拆成 2～3 次完成，每次 25～35 分钟；卡住时先缩小输入，不必一次写完。

<!-- foundations:start -->
## 一步一步看懂，再拆开练

一次只看一小步。先运行具体代码、逐行看值怎样变化，做几个小练习后再组合成主挑战。

### 保存发生后，怎样通知关心它的人

保存逻辑不一定要知道页面、日志、提示框分别怎么工作。它可以发出“已保存”这个消息，让订阅这个消息的函数各自响应。先把事件名和消息内容连起来。

#### 1 · 先看这一个例子

先猜输出，再点运行。看不懂的行留到下一步逐行解释，不需要边看边查一串术语。

```ts
interface Signals {
  saved: { id: number };
  failed: { message: string };
}
function describe<K extends keyof Signals>(event: K, payload: Signals[K]): void {
  console.log(event, payload);
}
describe("saved", { id: 7 });
describe("failed", { message: "离线" });
// describe("saved", { message: "离线" }); // 取消注释看类型错误
```

原例可在终端运行：`npm run concept -- 18`。

#### 2 · 一行一行看它做了什么

Signals 是一张“事件名→内容形状”的表。saved 后面的内容必须带数字 id；failed 后面的内容必须带文字 message。

`keyof Signals` 可以先读作“这张表允许的名字”，这里只有 saved 和 failed。K 保存本次选择的事件名类型。

`Signals[K]` 可以先读作“查这次事件名对应的内容要求”。所以 describe("saved", {id:7}) 合法；saved 配 {message:"离线"} 就不符合表里的对应关系。

describe 在这里只打印，还不是完整事件通知器。完整题目才需要 on 存下回调、emit 逐个调用、off 移除对应注册。

#### 3 · 改一点，再看一次

先做事件名小题，只允许表中两个名字。再做载荷小题，单独读懂 Events["saved"] 是什么类型。不要一开始就硬读整个泛型方法签名。

接着练取消函数：调用后把“是否启用”从 true 改成 false，再调用一次也安全。

最后画通知过程：本轮开始时有 A、B 两人；通知 A 的过程中取消 B，本关仍通知本轮快照中的 B，下一轮才不再通知它。要先复制这一轮的名单，才能让中途改名单不扰乱当前过程。

如果要保留自己的实验，先运行 `npm run concept -- 18 --prepare`，修改创建的文件，再用 `npm run concept -- 18 --local` 运行。HTML 保存后刷新浏览器。重复准备会保留你已有的文件。

#### 4 · 分开练，先不做整道题

1. **先限定合法事件名**：给 event 补上 keyof Events，允许 saved 和 failed。
2. **再取这个事件对应的数据类型**：给 saved 事件的载荷补类型 Events["saved"]，并读取 id。
3. **最后体验取消订阅**：off 调用后，把 active 改成 false；再调一次也保持 false。

网页下方有对应的小练习。每次只做一题：先运行起点 → 修改 → 检查 → 说清变化。做对以后换下一题，不需要先把整个主挑战写完。TS 小练习显示本地文件和命令，由真实编译器检查。

#### 5 · 做过之后，再认识这些名字

登记一个回调等消息叫**订阅**，发布消息并调用回调叫**派发**。payload 是消息附带的数据，通常叫**载荷**。

keyof 和类型中的方括号用于描述“事件名与消息数据对应”的约定。先读会具体 saved 例子，再把 saved 替换为类型参数 K。

做完小练习后，回主挑战把这些动作组合起来。若某一步仍说不清，就回到对应小题换一个数字再试；此时读更长的术语表帮助不大。
## 本关小步练习

### 18-01 · 先限定合法事件名

给 event 补上 keyof Events，允许 saved 和 failed。

```ts
interface Events {saved:{id:number};failed:{message:string}}
function nameOf(event): keyof Events { return event; }
```

在实验台选择这道小题，或运行 `npm run drill -- 18-01 --prepare` 后编辑 `practice/steps/18-01.ts`，再运行 `npm run drill -- 18-01 --check`。

<details>
<summary>一点提示</summary>

keyof Events 可以用在参数类型的位置。

</details>

<details>
<summary>试过后再看解释</summary>

```ts
interface Events {saved:{id:number};failed:{message:string}}
function nameOf(event: keyof Events): keyof Events { return event; }
```

事件名也可以受到类型限制，避免拼错还照常运行。

</details>

### 18-02 · 再取这个事件对应的数据类型

给 saved 事件的载荷补类型 Events["saved"]，并读取 id。

```ts
interface Events {saved:{id:number};failed:{message:string}}
function savedId(payload): number { return payload.id; }
```

在实验台选择这道小题，或运行 `npm run drill -- 18-02 --prepare` 后编辑 `practice/steps/18-02.ts`，再运行 `npm run drill -- 18-02 --check`。

<details>
<summary>一点提示</summary>

方括号在类型中表示取某个字段对应的类型。

</details>

<details>
<summary>试过后再看解释</summary>

```ts
interface Events {saved:{id:number};failed:{message:string}}
function savedId(payload: Events["saved"]): number { return payload.id; }
```

Events["saved"] 读的是类型表中的载荷形状，不是运行时数组。

</details>

### 18-03 · 最后体验取消订阅

off 调用后，把 active 改成 false；再调一次也保持 false。

```ts
let active=true;
function off(): void { /* 补上取消动作 */ }
```

在实验台选择这道小题，或运行 `npm run drill -- 18-03 --prepare` 后编辑 `practice/steps/18-03.ts`，再运行 `npm run drill -- 18-03 --check`。

<details>
<summary>一点提示</summary>

这里先用一个布尔值练习，完整题目再移除对应监听器。

</details>

<details>
<summary>试过后再看解释</summary>

```ts
let active=true;
function off(): void { active=false; }
```

取消函数也是普通函数：调用它会执行你写下的取消动作。

</details>

<!-- foundations:end -->

## 先复现一个真实问题

1. 运行，注意本该打印一次的“保存了”完全没有出现。
2. 先存储监听器并实现 emit，再加取消订阅。
3. 让监听器在派发中取消另一个订阅、同时加一个新订阅，预测本轮与下轮的区别。
4. 跑 --check；除了行为，检查还会确认错误的事件名和载荷确实被 TS 拦住。

## 本关需求就是你的验收合同

- createEmitter<Events>() 提供 on(event,listener) 和 emit(event,payload)。事件名与载荷由 Events 的键和值对应。
- on 返回取消函数；可重复取消，不影响其他订阅。同一回调注册两次视为两份独立订阅。
- emit 同步按注册顺序派发；每次开始时复制订阅快照。本轮新增下轮生效，本轮删除不影响本轮快照。
- 没有订阅者时不抛错；不同实例彼此隔离。
- 基础合同假定监听器不会抛错、不递归 emit；监听器异常隔离作为扩展。
- 测试需要错误事件名、错误载荷在编译时失败，不能将公开参数退化为 any。本关事件名使用 saved / failed / tick 等普通自有键。

## 在哪里写、怎么检查

请编辑本地 TS 文件，用真正的编译器检查；网页展示起始代码和操作说明。

- [实验台第 18 关](http://127.0.0.1:8766/workshop/#18)（先启动 `npm run workshop`）。
- [本地练习](../practice/18.ts)。

```sh
npm run lab -- 18
npm run lab -- 18 --check
```

Windows PowerShell 中也可写 `npm.cmd run lab -- 18 --check`。初始代码故意没有满足合同。检查反馈会指出第一个不符合要求的行为；修正后重复检查。

## 先画执行过程，再写代码

在纸上或注释里写出每一步的输入、保存的状态、输出。异步挑战尤其要写明谁先开始、谁先结束，避免仅凭“这次看起来正常”判断正确。

<details>
<summary>提示 1：先自己尝试，再展开</summary>

K extends keyof Events 绑定合法事件名；Events[K] 表示对应事件的载荷。

</details>

<details>
<summary>提示 2：先自己尝试，再展开</summary>

可用映射类型保存每个键的 Set<监听器>；派发前 [...bucket] 拷贝快照。

</details>

<details>
<summary>提示 3：先自己尝试，再展开</summary>

同一个回调重复注册时，需要用各自的包装函数保存独立订阅；取消时只删自己的包装函数。

</details>

## 做完之后再给概念命名

泛型在这里表达了事件名和数据之间的联系。映射类型把不同键对应到不同监听器类型。运行时的快照又决定了注册表变更何时生效。@ts-expect-error 用于负向类型验收：预期错误若没有发生，检查反而失败。

## 再加一个你自己的需求

监听器抛错时继续通知其余人，返回错误列表；再把 saved 事件接到任务管理项目的新增操作和日志输出。

扩展不计入本关基础验收，需要你自己补例子验证。

## 复盘

记录一个起始代码会出错的具体输入、你选择的数据结构或控制方式、一个还未覆盖的场景。然后尝试把核心实现重新写一遍，不照着答案复制。

<details>
<summary>最后再看参考解法</summary>

[查看本关参考代码](../answers/practice/18.ts)。允许使用不同实现，只要满足上面的合同。不要覆盖其他已完成的练习。

</details>

[返回进阶路线](README.md)。
