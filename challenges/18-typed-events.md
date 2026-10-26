# 18 · 类型安全事件：连接消息与数据

本关按“讲解一段 → 就地小练习”学习，最后完成综合大练习。

<!-- foundations:start -->
## 边看边练

### 保存发生后，怎样通知关心它的人

保存逻辑不一定要知道页面、日志、提示框分别怎么工作。它可以发出“已保存”这个消息，让订阅这个消息的函数各自响应。先把事件名和消息内容连起来。

#### 1 · 先限定合法事件名

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

Signals 是一张“事件名→内容形状”的表。saved 后面的内容必须带数字 id；failed 后面的内容必须带文字 message。

`keyof Signals` 可以先读作“这张表允许的名字”，这里只有 saved 和 failed。K 保存本次选择的事件名类型。

`Signals[K]` 可以先读作“查这次事件名对应的内容要求”。所以 describe("saved", {id:7}) 合法；saved 配 {message:"离线"} 就不符合表里的对应关系。

describe 在这里只打印，还不是完整事件通知器。完整题目才需要 on 存下回调、emit 逐个调用、off 移除对应注册。


##### 就地小练习 18-01 · 先限定合法事件名

给 event 补上 keyof Events，允许 saved 和 failed。

```ts
interface Events {saved:{id:number};failed:{message:string}}
function nameOf(event): keyof Events { return event; }
```

本题在本地文件中完成，网页提供起点预览。本地运行 `npm run drill -- 18-01 --prepare`，编辑 `practice/steps/18-01.ts`，再运行 `npm run drill -- 18-01 --check`。

<details>
<summary>一点提示</summary>

keyof Events 可以用在参数类型的位置。

</details>

<details>
<summary>参考答案与解释</summary>

```ts
interface Events {saved:{id:number};failed:{message:string}}
function nameOf(event: keyof Events): keyof Events { return event; }
```

事件名也可以受到类型限制，避免拼错还照常运行。

</details>

#### 2 · 再取这个事件对应的数据类型

把事件表也放在当前段，才能看清方括号在查哪个类型：

```ts
interface Events {
  saved: { id: number };
  failed: { message: string };
}
const payload: Events["saved"] = { id: 7 };
console.log(payload.id);
// const wrong: Events["saved"] = { message: "离线" };
```

输出 7。取消最后一行注释后，message 不能代替 saved 要求的 id。

Events["saved"] 对应 saved 后面写的数据类型，例如 { id: number }；把事件名换成 failed，对应的就是另一份内容要求。

接着练取消函数：调用后把“是否启用”从 true 改成 false，再调用一次也安全。

最后画通知过程：本轮开始时有 A、B 两人；通知 A 的过程中取消 B，本关仍通知本轮快照中的 B，下一轮才不再通知它。要先复制这一轮的名单，才能让中途改名单不扰乱当前过程。


`listener: (payload: Events[K]) => void` 中，箭头写在类型位置，描述“接收一份载荷的函数”，没有创建或执行函数。运行时的 `payload => console.log(payload)` 才是一个函数值。void 在这种回调类型里表示调用者不应依赖其返回值；并不是 JS 中的一个返回数据。

on 方法最后的 `: () => void` 则说明它返回另一个不接收参数的函数。`const off = bus.on(...)` 保存这份返回值；以后调用 off() 才取消。写 `_event` 的下划线只是普通名字的一部分，常用来表示暂时没用到的参数，不是省略参数的特殊语法。

##### 就地小练习 18-02 · 再取这个事件对应的数据类型

给 saved 事件的载荷补类型 Events["saved"]，并读取 id。

```ts
interface Events {saved:{id:number};failed:{message:string}}
function savedId(payload): number { return payload.id; }
```

本题在本地文件中完成，网页提供起点预览。本地运行 `npm run drill -- 18-02 --prepare`，编辑 `practice/steps/18-02.ts`，再运行 `npm run drill -- 18-02 --check`。

<details>
<summary>一点提示</summary>

方括号在类型中表示取某个字段对应的类型。

</details>

<details>
<summary>参考答案与解释</summary>

```ts
interface Events {saved:{id:number};failed:{message:string}}
function savedId(payload: Events["saved"]): number { return payload.id; }
```

Events["saved"] 读的是类型表中的载荷形状，不是运行时数组。

</details>

#### 3 · 最后体验取消订阅

先用一个布尔变量观察取消动作，不急着实现完整事件总线：

```ts
let active = true;
const off = (): void => { active = false; };
console.log(active);
off();
console.log(active);
off();
console.log(active);
```

依次输出 true、false、false。第二次取消仍然安全，这个性质可以用于完整订阅器的取消函数。

登记一个回调等消息叫**订阅**，发布消息并调用回调叫**派发**。payload 是消息附带的数据，通常叫**载荷**。

keyof 和类型中的方括号用于描述“事件名与消息数据对应”的约定。先读会具体 saved 例子，再把 saved 替换为类型参数 K。


参考实现的 `{ [K in keyof Events]?: Set<...> }` 是映射类型：对 Events 的每个键 K，描述一个可选的集合字段。这段类型不会自己建立任何 Set；实际运行到 new Set() 才创建集合。`buckets[event]` 是运行时按事件名取集合，`Events[K]` 是类型里按事件名取载荷要求。

Set 的 .add 登记值，.delete 移除值，重复加入同一个函数只会留一份。所以参考实现为每次订阅创建独立的包装函数，让同一个监听器登记两次也能分别取消。`[...(buckets[event] ?? [])]` 先用 ?? 选择已有集合或空数组，再用展开生成本轮名单；括号确保默认值选择发生在展开之前。只有明确发出下一次消息，才会使用更新后的订阅集合。

##### 就地小练习 18-03 · 最后体验取消订阅

off 调用后，把 active 改成 false；再调一次也保持 false。

```ts
let active=true;
function off(): void { /* 补上取消动作 */ }
```

本题在本地文件中完成，网页提供起点预览。本地运行 `npm run drill -- 18-03 --prepare`，编辑 `practice/steps/18-03.ts`，再运行 `npm run drill -- 18-03 --check`。

<details>
<summary>一点提示</summary>

这里先用一个布尔值练习，完整题目再移除对应监听器。

</details>

<details>
<summary>参考答案与解释</summary>

```ts
let active=true;
function off(): void { active=false; }
```

取消函数也是普通函数：调用它会执行你写下的取消动作。

</details>
<!-- foundations:end -->

## 综合大练习：做一个事件名与载荷严格对应的通知器

**订阅任务事件、发送通知、取消订阅；错误的事件名或载荷在编译时被拦住。**

### 完成要求

- createEmitter<Events>() 提供 on(event,listener) 和 emit(event,payload)。事件名与载荷由 Events 的键和值对应。
- on 返回取消函数；可重复取消，不影响其他订阅。同一回调注册两次视为两份独立订阅。
- emit 同步按注册顺序派发；每次开始时复制订阅快照。本轮新增下轮生效，本轮删除不影响本轮快照。
- 没有订阅者时不抛错；不同实例彼此隔离。
- 基础合同假定监听器不会抛错、不递归 emit；监听器异常隔离作为扩展。
- 测试需要错误事件名、错误载荷在编译时失败，不能将公开参数退化为 any。本关事件名使用 saved / failed / tick 等普通自有键。

### 在哪里写、怎么验收

编辑 [practice/18.ts](../practice/18.ts)，在项目根目录执行：

```sh
npm run lab -- 18
npm run lab -- 18 --check
```

起点只提供数据或函数外壳，需要自己把本关学过的动作组合起来。已有的旧版 practice 文件仍保留，新的基础综合题使用 practice/finals 目录。网页草稿与本地文件独立。

<details>
<summary>卡住时，再看解题思路</summary>

1. 运行，注意本该打印一次的“保存了”完全没有出现。
2. 先存储监听器并实现 emit，再加取消订阅。
3. 让监听器在派发中取消另一个订阅、同时加一个新订阅，预测本轮与下轮的区别。
4. 跑 --check；除了行为，检查还会确认错误的事件名和载荷确实被 TS 拦住。

K extends keyof Events 绑定合法事件名；Events[K] 表示对应事件的载荷。

</details>

<details>
<summary>相关知识</summary>

泛型在这里表达了事件名和数据之间的联系。映射类型把不同键对应到不同监听器类型。运行时的快照又决定了注册表变更何时生效。@ts-expect-error 用于负向类型验收：预期错误若没有发生，检查反而失败。

</details>

### 完成后再加一个需求

监听器抛错时继续通知其余人，返回错误列表；再把 saved 事件接到任务管理项目的新增操作和日志输出。

扩展不计入本关基础验收。

<details>
<summary>参考答案</summary>

[综合大练习参考](../answers/practice/18.ts)

</details>

[返回教学目录](../README.md)。
