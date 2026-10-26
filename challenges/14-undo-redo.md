# 14 · 闭包与历史：实现撤销和重做

本关按“讲解一段 → 就地小练习”学习，最后完成综合大练习。

<!-- foundations:start -->
## 边看边练

### 先让函数记住上次，再谈撤销

撤销需要记得上一份内容。计数器需要记住上一次的数字，撤销工具需要记住上一个版本，两者都要在多次调用之间保留数据。

#### 1 · 先让函数记住上次的数

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

createCounter 每调用一次，会创建自己那份 value=0，并返回一个小函数。之后调用 a()，调用的是这份返回的小函数。

a 第一次把自己的 value 改为 1，第二次在原来的 1 上加，得到 2。b 来自另外一次 createCounter，它有自己独立的 value，所以第一次仍为 1。

这里外层函数结束后，返回的小函数还可以读写那份 value。并不是每次调用 a 都重新从 0 开始。

history 的最后一项是“草稿 B”，pop() 把最后加入的一项拿出来，并从数组里删掉。取完后只剩一项。最近加入的先拿出，适合“先撤销最近的一次”。


##### 就地小练习 14-01 · 先让函数记住上次的数

调用同一个计数器，依次得到 1、2；新计数器仍从 1 开始。

```js
function createCounter() { return () => { let value=0; value+=1; return value; }; }
```

网页中在这一段下面直接练习。本地运行 `npm run drill -- 14-01 --prepare`，编辑 `practice/steps/14-01.js`，再运行 `npm run drill -- 14-01 --check`。

<details>
<summary>一点提示</summary>

把 let value=0 移到返回函数的外面，仍放在 createCounter 里面。

</details>

<details>
<summary>参考答案与解释</summary>

```js
function createCounter() { let value=0; return () => { value+=1; return value; }; }
```

返回的函数记得外层那份 value，这个现象叫闭包。

</details>

#### 2 · 再拿最近的一份历史

同一份历史，分别观察“读取”和“取出”的区别：

```js
const history = ["A", "B", "C"];
console.log(history.at(-1), history.length);
console.log(history.pop(), history.length);
```

两次都拿到 C，但长度依次是 3、2。下面小题要求不改原数组，因此只读取，不用 pop 删除。

把 history 改成空数组 []，at(-1) 和 pop() 都会返回 undefined；不要把“没历史”误当成最近的内容。

接着在纸上写 A→B→C。撤销一次回 B：C 放进可重做列表；再修改成 D，路线变成 A→B→D，旧路线 C 就应清掉。

最后想一个问题：如果三份历史其实都指着同一个可变数组，改一份会不会把过去也改了？回看第 12 关的复制实验。


小题中的 history.at(-1) 读取最后一项，不会删除它；history.pop() 既读取又删除，二者对历史列表的影响不同。at(-2) 是倒数第二项，空数组 at(-1) 得到 undefined。不要把它写成 history[-1]，普通方括号中的 -1 是属性名，不会按“倒数第一项”来读取数组元素。

##### 就地小练习 14-02 · 再拿最近的一份历史

不改原数组，返回最近一次历史值 C。

```js
function latest(history) { return history[0]; }
```

网页中在这一段下面直接练习。本地运行 `npm run drill -- 14-02 --prepare`，编辑 `practice/steps/14-02.js`，再运行 `npm run drill -- 14-02 --check`。

<details>
<summary>一点提示</summary>

最后一项可用 at(-1)。

</details>

<details>
<summary>参考答案与解释</summary>

```js
function latest(history) { return history.at(-1); }
```

后加入的先取出，符合最近一次操作先撤销的顺序。

</details>

#### 3 · 做新修改就放弃旧未来

撤销后再改成 D，旧的可重做路线 C 就应清空：

```js
let present = "B";
const future = ["C"];
present = "D";
future.length = 0;
console.log(present, future);
```

输出 D 和 []。如果不清空 future，之后的重做就可能误回到已经放弃的 C。

返回的函数仍能使用定义它时的外部变量，这个现象叫**闭包**。后放入、先取出的历史集合叫**栈**。

past、present、future 只是过去、现在、可重做三份状态的命名。先把每次操作前后这三份内容写清楚，再动手实现。


综合题返回对象里的 `set(next) { ... }` 是方法简写，大致可以展开为 `set: function(next) { ... }`；`get: () => value` 则是字段名 get 后面放一个箭头函数。这里的 get 是普通方法名，调用 history.get() 才拿到值，不是 JS 的 getter 声明。

past.push(value) 往末尾放一项，past.pop() 取出并删除最后一项；空数组 pop() 返回 undefined。`future.length = 0` 是实际清空这个数组，不是创建新数组。参考解法里的 Object.is 用于判断两次值是否相同：与 === 很接近，但 Object.is(NaN,NaN) 为 true，且它区分 0 与 -0。

##### 就地小练习 14-03 · 做新修改就放弃旧未来

旧 future 有 [C]。在修改为 D 时，让 future 清空。

```js
function edit(state,value) { return {past:[...state.past,state.present],present:value,future:state.future}; }
```

网页中在这一段下面直接练习。本地运行 `npm run drill -- 14-03 --prepare`，编辑 `practice/steps/14-03.js`，再运行 `npm run drill -- 14-03 --check`。

<details>
<summary>一点提示</summary>

新建结果里的 future 改为 []。

</details>

<details>
<summary>参考答案与解释</summary>

```js
function edit(state,value) { return {past:[...state.past,state.present],present:value,future:[]}; }
```

B→D 是新路线，旧路线里的 C 不能作为 D 的下一步重做。

</details>
<!-- foundations:end -->

## 综合大练习：给编辑器加撤销和重做

**连续修改、撤销、重做；撤销后重新编辑时，旧的重做分支失效。**

### 完成要求

- 支持 get()、set(next)、undo()、redo()。undo / redo 返回操作后的当前值。
- 值使用 Object.is 比较；set 相同值不新增历史，也不破坏重做分支。
- 撤销到底、重做到头时保持当前值；允许 0、空字符串、undefined 等值。
- 撤销后 set 不同值必须清空 future；不同 createHistory 实例互不影响。
- 本关按值保存版本；如果使用对象，调用方必须传新对象且不得再修改已保存版本。不要求自动深拷贝。

### 在哪里写、怎么验收

编辑 [practice/14.js](../practice/14.js)，在项目根目录执行：

```sh
npm run lab -- 14
npm run lab -- 14 --check
```

起点只提供数据或函数外壳，需要自己把本关学过的动作组合起来。已有的旧版 practice 文件仍保留，新的基础综合题使用 practice/finals 目录。网页草稿与本地文件独立。

<details>
<summary>卡住时，再看解题思路</summary>

1. 先运行，观察撤销两次为什么完全没有效果。
2. 在纸上写 past / present / future 三列，手动演算 A → B → undo。
3. 实现 undo 与 redo，再处理撤销后 set 新内容。
4. 试两次 set 相同值、以及初始值 0 和 undefined。

保存过去、现在、未来三份状态；数组可以当栈，用 push / pop。

</details>

<details>
<summary>相关知识</summary>

闭包让多个方法访问同一份私有状态。撤销是状态转移而非简单“减一”；新编辑会产生新的历史分支。明确 Object.is 和对象引用约定可以避免暗含的深拷贝期待。

</details>

### 完成后再加一个需求

给历史加 maxDepth 限制；再把字符串版本换成不可变任务数组，实现添加任务后的撤销和重做。

扩展不计入本关基础验收。

<details>
<summary>参考答案</summary>

[综合大练习参考](../answers/practice/14.js)

</details>

[返回教学目录](../README.md)。
