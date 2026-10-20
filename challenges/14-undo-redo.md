# 14 · 给编辑器加撤销和重做

**做出来的效果：连续修改、撤销、重做；撤销后重新编辑时，旧的重做分支失效。**

建议预备知识：第 03、04 关，理解闭包和数组。建议拆成 2～3 次完成，每次 25～35 分钟；卡住时先缩小输入，不必一次写完。

<!-- foundations:start -->
## 一步一步看懂，再拆开练

一次只看一小步。先运行具体代码、逐行看值怎样变化，做几个小练习后再组合成主挑战。

### 先让函数记住上次，再谈撤销

撤销需要记得上一份内容。先别直接写完整历史系统，先看返回的函数为什么还能记得自己的数字，再看最近的历史放在哪里。

#### 1 · 先看这一个例子

先猜输出，再点运行。看不懂的行留到下一步逐行解释，不需要边看边查一串术语。

```js
function createCounter() {
  let value = 0;
  return () => { value += 1; return value; };
}
const a = createCounter();
const b = createCounter();
console.log(a(), a(), b());
const history = ["草稿 A", "草稿 B"];
console.log(history.pop(), history.length);
```

原例可在终端运行：`npm run concept -- 14`。

#### 2 · 一行一行看它做了什么

createCounter 每调用一次，会创建自己那份 value=0，并返回一个小函数。之后调用 a()，调用的是这份返回的小函数。

a 第一次把自己的 value 改为 1，第二次在原来的 1 上加，得到 2。b 来自另外一次 createCounter，它有自己独立的 value，所以第一次仍为 1。

这里外层函数结束后，返回的小函数还可以读写那份 value。并不是每次调用 a 都重新从 0 开始。

history 的最后一项是“草稿 B”，pop() 把最后加入的一项拿出来，并从数组里删掉。取完后只剩一项。最近加入的先拿出，适合“先撤销最近的一次”。

#### 3 · 改一点，再看一次

先把 value=0 移进返回的小函数，观察 a 两次都变成 1。再移回原处，恢复 1、2。这一轮只理解“在哪里创建、什么时候创建”。

接着在纸上写 A→B→C。撤销一次回 B：C 放进可重做列表；再修改成 D，路线变成 A→B→D，旧路线 C 就应清掉。

最后想一个问题：如果三份历史其实都指着同一个可变数组，改一份会不会把过去也改了？回看第 12 关的复制实验。

如果要保留自己的实验，先运行 `npm run concept -- 14 --prepare`，修改创建的文件，再用 `npm run concept -- 14 --local` 运行。HTML 保存后刷新浏览器。重复准备会保留你已有的文件。

#### 4 · 分开练，先不做整道题

1. **先让函数记住上次的数**：调用同一个计数器，依次得到 1、2；新计数器仍从 1 开始。
2. **再拿最近的一份历史**：不改原数组，返回最近一次历史值 C。
3. **做新修改就放弃旧未来**：旧 future 有 [C]。在修改为 D 时，让 future 清空。

网页下方有对应的小练习。每次只做一题：先运行起点 → 修改 → 检查 → 说清变化。做对以后换下一题，不需要先把整个主挑战写完。TS 小练习显示本地文件和命令，由真实编译器检查。

#### 5 · 做过之后，再认识这些名字

返回的函数仍能使用定义它时的外部变量，这个现象叫**闭包**。后放入、先取出的历史集合叫**栈**。

past、present、future 只是过去、现在、可重做三份状态的命名。先把每次操作前后这三份内容写清楚，再动手实现。

做完小练习后，回主挑战把这些动作组合起来。若某一步仍说不清，就回到对应小题换一个数字再试；此时读更长的术语表帮助不大。
## 本关小步练习

### 14-01 · 先让函数记住上次的数

调用同一个计数器，依次得到 1、2；新计数器仍从 1 开始。

```js
function createCounter() { return () => { let value=0; value+=1; return value; }; }
```

在实验台选择这道小题，或运行 `npm run drill -- 14-01 --prepare` 后编辑 `practice/steps/14-01.js`，再运行 `npm run drill -- 14-01 --check`。

<details>
<summary>一点提示</summary>

把 let value=0 移到返回函数的外面，仍放在 createCounter 里面。

</details>

<details>
<summary>试过后再看解释</summary>

```js
function createCounter() { let value=0; return () => { value+=1; return value; }; }
```

返回的函数记得外层那份 value，这个现象叫闭包。

</details>

### 14-02 · 再拿最近的一份历史

不改原数组，返回最近一次历史值 C。

```js
function latest(history) { return history[0]; }
```

在实验台选择这道小题，或运行 `npm run drill -- 14-02 --prepare` 后编辑 `practice/steps/14-02.js`，再运行 `npm run drill -- 14-02 --check`。

<details>
<summary>一点提示</summary>

最后一项可用 at(-1)。

</details>

<details>
<summary>试过后再看解释</summary>

```js
function latest(history) { return history.at(-1); }
```

后加入的先取出，符合最近一次操作先撤销的顺序。

</details>

### 14-03 · 做新修改就放弃旧未来

旧 future 有 [C]。在修改为 D 时，让 future 清空。

```js
function edit(state,value) { return {past:[...state.past,state.present],present:value,future:state.future}; }
```

在实验台选择这道小题，或运行 `npm run drill -- 14-03 --prepare` 后编辑 `practice/steps/14-03.js`，再运行 `npm run drill -- 14-03 --check`。

<details>
<summary>一点提示</summary>

新建结果里的 future 改为 []。

</details>

<details>
<summary>试过后再看解释</summary>

```js
function edit(state,value) { return {past:[...state.past,state.present],present:value,future:[]}; }
```

B→D 是新路线，旧路线里的 C 不能作为 D 的下一步重做。

</details>

<!-- foundations:end -->

## 先复现一个真实问题

1. 先运行，观察撤销两次为什么完全没有效果。
2. 在纸上写 past / present / future 三列，手动演算 A → B → undo。
3. 实现 undo 与 redo，再处理撤销后 set 新内容。
4. 试两次 set 相同值、以及初始值 0 和 undefined。

## 本关需求就是你的验收合同

- 支持 get()、set(next)、undo()、redo()。undo / redo 返回操作后的当前值。
- 值使用 Object.is 比较；set 相同值不新增历史，也不破坏重做分支。
- 撤销到底、重做到头时保持当前值；允许 0、空字符串、undefined 等值。
- 撤销后 set 不同值必须清空 future；不同 createHistory 实例互不影响。
- 本关按值保存版本；如果使用对象，调用方必须传新对象且不得再修改已保存版本。不要求自动深拷贝。

## 在哪里写、怎么检查

可以在实验台直接改代码运行，也可以编辑下面的本地文件。两处草稿独立保存。

- [实验台第 14 关](http://127.0.0.1:8766/workshop/#14)（先启动 `npm run workshop`）。
- [本地练习](../practice/14.js)。

```sh
npm run lab -- 14
npm run lab -- 14 --check
```

Windows PowerShell 中也可写 `npm.cmd run lab -- 14 --check`。初始代码故意没有满足合同。检查反馈会指出第一个不符合要求的行为；修正后重复检查。

## 先画执行过程，再写代码

在纸上或注释里写出每一步的输入、保存的状态、输出。异步挑战尤其要写明谁先开始、谁先结束，避免仅凭“这次看起来正常”判断正确。

<details>
<summary>提示 1：先自己尝试，再展开</summary>

保存过去、现在、未来三份状态；数组可以当栈，用 push / pop。

</details>

<details>
<summary>提示 2：先自己尝试，再展开</summary>

undo：当前值压入 future，再从 past 弹出新当前值；redo 方向相反。

</details>

<details>
<summary>提示 3：先自己尝试，再展开</summary>

先判断栈长度，再 pop。不要写 if (past.at(-1))，因为 0 也是合法历史值。

</details>

## 做完之后再给概念命名

闭包让多个方法访问同一份私有状态。撤销是状态转移而非简单“减一”；新编辑会产生新的历史分支。明确 Object.is 和对象引用约定可以避免暗含的深拷贝期待。

## 再加一个你自己的需求

给历史加 maxDepth 限制；再把字符串版本换成不可变任务数组，实现添加任务后的撤销和重做。

扩展不计入本关基础验收，需要你自己补例子验证。

## 复盘

记录一个起始代码会出错的具体输入、你选择的数据结构或控制方式、一个还未覆盖的场景。然后尝试把核心实现重新写一遍，不照着答案复制。

<details>
<summary>最后再看参考解法</summary>

[查看本关参考代码](../answers/practice/14.js)。允许使用不同实现，只要满足上面的合同。不要覆盖其他已完成的练习。

</details>

[返回进阶路线](README.md)。
