# 07 · DOM 与事件：让数据改变页面

本关按“讲解一段 → 就地小练习”学习，最后完成综合大练习。

<!-- foundations:start -->
## 边看边练

### 数据变了，为什么页面上的字还没变

先把页面想成一张展示板。变量 clicks 是你在程序里记的数字，页面上的文字是另一次写出去的结果；修改数字后，要再写一次展示板。

#### 1 · 先练页面上要显示的那句话

```html
<button id="add">加一次</button>
<p id="count"></p>
<script>
  let clicks = 0;
  const label = document.querySelector("#count");
  function render() { label.textContent = `点击 ${clicks} 次`; }
  document.querySelector("#add").addEventListener("click", () => {
    clicks += 1;
    render();
  });
  render();
</script>
```

这个 HTML 例子需要浏览器页面。先运行 `npm run concept -- 07 --prepare`，生成 `practice/concepts/07.html`，再在本机课程地址下打开 [/practice/concepts/07.html](../practice/concepts/07.html)。若文件已存在，准备命令会保留你的改动。

HTML 的 button 创建按钮，p 创建放文字的区域；id 是让脚本找到它们的名字。这里脚本写在元素后面，因此运行时元素已经存在。

`document.querySelector("#count")` 在页面里找到 id=count 的那一块。先把找到的对象记为 label，后面就能更新它。

`label.textContent = ...` 把文字写进这一块。render() 每次读最新的 clicks，重新算出“点击 N 次”，再写出去。

addEventListener 注册一段“发生点击时再执行”的函数。注册时不先加 1；你点击后，才先 clicks+=1，然后 render() 更新文字。最后那句 render() 则负责页面刚打开时显示 0。


<details>
<summary>补充：HTML 的括号不是 JS 的比较符号</summary>

`<button id="add">加一次</button>` 中，尖括号包住 HTML 标签，id 是属性，等号后引号里的 add 是属性值；结束标签多一个 /。script 标签里面才是 JS。JS 中的 `"#count"` 是传给选择器的字符串，# 表示按 id 查找，不能漏掉后还期待它查到同一个元素。

`.addEventListener("click", () => { ... })` 的第一个参数是事件名，第二个参数是一个函数，逗号分隔两者。注册写完后看到的 `});` 依次关闭函数体、方法调用，最后结束语句。不是多写了几个无用符号。若写成 `addEventListener("click", render())`，render 会在注册时立即执行，传给监听器的是结果，点击时不会按原意再调用它。

querySelector 找不到元素时得到 null；此时直接写 label.textContent 会报 TypeError。要检查选择器、HTML 的 id 和脚本执行时机，不是改成任何变量名都能继续操作页面。

</details>

##### 就地小练习 07-01 · 先练页面上要显示的那句话

输入剩余数量，返回“剩余 N 项”。这题只练字符串，真实 DOM 在下面主挑战操作。

```js
function remainingText(count) { return "剩余 0 项"; }
```

网页中在这一段下面直接练习。本地运行 `npm run drill -- 07-01 --prepare`，编辑 `practice/steps/07-01.js`，再运行 `npm run drill -- 07-01 --check`。

<details>
<summary>一点提示</summary>

模板字符串里的 ${count} 读本次传入的数。

</details>

<details>
<summary>参考答案与解释</summary>

```js
function remainingText(count) { return `剩余 ${count} 项`; }
```

先把要显示的文字算对，下一步才写进页面。

</details>

#### 2 · 再练统计未完成数量

这一段先在网页里练数据计算，不需要 document：

```js
const tasks = [{ title: "JS", done: false }, { title: "TS", done: true }];
const remaining = tasks.filter(task => !task.done).length;
console.log(`剩余 ${remaining} 项`);
```

输出“剩余 1 项”。把第一项 done 改为 true，再运行，应变成“剩余 0 项”。下面小题把统计动作写成函数，真正更新页面留到综合题。

第一轮保留示例输入，确认剩余 1 项。第二轮把两项 done 都改成 false，应该剩余 2 项。第三轮把 tasks 改成空数组 []，结果应该是 0。每次运行都会从当前代码重新开始。

后续将这句结果显示到页面时，使用 textContent 写入文字；不要为了显示一个标题就改用 innerHTML。

本页新增的小练习先让你算对文字和剩余数量；综合大练习再把它接到真实 DOM。


综合任务监听的是表单的 submit 事件。回调里的 event 是浏览器传入的事件对象，event.preventDefault() 阻止表单默认提交时的页面导航或刷新，方便我们用 JS 更新列表。这里只读取 input.value 得到字符串，再用 trim() 处理；HTML 中看起来是数字的输入，也不能因此假定 .value 已是 JS 数字。

##### 就地小练习 07-02 · 再练统计未完成数量

传入任务数组，返回未完成数量。

```js
function remainingCount(tasks) { return tasks.length; }
```

网页中在这一段下面直接练习。本地运行 `npm run drill -- 07-02 --prepare`，编辑 `practice/steps/07-02.js`，再运行 `npm run drill -- 07-02 --check`。

<details>
<summary>一点提示</summary>

回想第 04 关 filter 的判断。

</details>

<details>
<summary>参考答案与解释</summary>

```js
function remainingCount(tasks) { return tasks.filter(task => !task.done).length; }
```

总任务数和未完成数量是不同的值，页面需要的是后者。

</details>

#### 3 · 最后练数据变化后的重新计算

数据变了，之前已经算好的文字不会自动重算：

```js
const tasks = [{ title: "JS", done: false }];
let label = `剩余 ${tasks.filter(task => !task.done).length} 项`;
tasks[0].done = true;
console.log(label);
label = `剩余 ${tasks.filter(task => !task.done).length} 项`;
console.log(label);
```

依次输出“剩余 1 项”和“剩余 0 项”。这就是 render 要重新读取数据再生成文字的原因。

浏览器把 HTML 变成可操作的元素对象，这套对象叫 **DOM**。点击等发生的事情叫**事件**，收到事件后执行的函数叫**监听器**。

这里 render 只是我们给“重新把数据写到页面”这段函数起的名字，不是 JavaScript 自带的神奇刷新开关。普通 Node.js 脚本没有浏览器的 document，HTML 实验应在浏览器里打开。


##### 就地小练习 07-03 · 最后练数据变化后的重新计算

任务已经完成。让 label 根据新数据重新得到“剩余 0 项”。

```js
const task = { done: false };
let label = "剩余 1 项";
task.done = true;
// 在这里重新计算 label
```

网页中在这一段下面直接练习。本地运行 `npm run drill -- 07-03 --prepare`，编辑 `practice/steps/07-03.js`，再运行 `npm run drill -- 07-03 --check`。

<details>
<summary>一点提示</summary>

?: 可以按条件选择两个值；也可以写 if/else。

</details>

<details>
<summary>参考答案与解释</summary>

```js
const task = { done: false };
let label = "剩余 1 项";
task.done = true;
label = `剩余 ${task.done ? 0 : 1} 项`;
```

字符串不会追踪对象变化，DOM 的文字同样需要主动更新。

</details>
<!-- foundations:end -->

## 综合大练习：让任务页面能添加、完成和删除任务

**将任务数据、点击事件和重新渲染组合成可操作的页面。**

### 题目要求

- 输入非空标题可以添加任务；空白标题不能添加，要显示提示。
- 任务可以完成或删除，每次操作后显示正确的未完成数量。
- 用户输入作为文字显示；刷新页面恢复初始数据，不要求保存。

### 输入与预期结果

输入“读书”并添加：剩余数加 1；完成它：剩余数减 1；删除它：列表中不再显示。

### 在哪里写、怎么验收

编辑 [practice/finals/07-dom/app.js](../practice/finals/07-dom/app.js)，在浏览器打开 [综合任务页面](../practice/finals/07-dom/index.html)，保存后刷新。

起点只提供数据或函数外壳，需要自己把本关学过的动作组合起来。已有的旧版 practice 文件仍保留，新的基础综合题使用 practice/finals 目录。网页草稿与本地文件独立。

<details>
<summary>卡住时，再看解题思路</summary>

1. 完成提交回调里的新增任务。
2. 完成每项按钮回调里的完成和删除。
3. render 中按最新数据重新计算未完成数量。

完成提交回调里的新增任务。

</details>

<details>
<summary>相关知识</summary>

页面上的字不会自动知道数组变了。每次状态更新后调用 render，让 DOM 重新反映任务数据。事件回调是把“用户点击”接到“更新数据”的地方。

</details>

### 完成后再加一个需求

增加一个“全部完成”按钮，点击后所有任务完成且剩余数量变为 0。

扩展不计入本关基础验收。

<details>
<summary>参考答案</summary>

[综合大练习参考](../answers/finals/07-dom/app.js) · [参考页面](../answers/finals/07-dom/index.html)

</details>

[返回教学目录](../README.md)。
