# 07 · 让页面显示剩余任务数

今天做出来的效果：**添加或完成任务时，“剩余 N 项”都要同步变化。**

<!-- foundations:start -->
## 一步一步看懂，再拆开练

一次只看一小步。先运行具体代码、逐行看值怎样变化，做几个小练习后再组合成主挑战。

### 数据变了，为什么页面上的字还没变

先把页面想成一张展示板。变量 clicks 是你在程序里记的数字，页面上的文字是另一次写出去的结果；修改数字后，要再写一次展示板。

#### 1 · 先看这一个例子

先猜输出，再点运行。看不懂的行留到下一步逐行解释，不需要边看边查一串术语。

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

用浏览器打开本关 HTML。

#### 2 · 一行一行看它做了什么

HTML 的 button 创建按钮，p 创建放文字的区域；id 是让脚本找到它们的名字。这里脚本写在元素后面，因此运行时元素已经存在。

`document.querySelector("#count")` 在页面里找到 id=count 的那一块。先把找到的对象记为 label，后面就能更新它。

`label.textContent = ...` 把文字写进这一块。render() 每次读最新的 clicks，重新算出“点击 N 次”，再写出去。

addEventListener 注册一段“发生点击时再执行”的函数。注册时不先加 1；你点击后，才先 clicks+=1，然后 render() 更新文字。最后那句 render() 则负责页面刚打开时显示 0。

#### 3 · 改一点，再看一次

第一轮：打开 HTML，连续点击两次，应该从 0 变成 1、再变成 2。

第二轮：暂时删掉点击函数里的 render()，刷新后再点两次。程序里的 clicks 已改变，但显示还停在 0，因为没人把最新数字再写到页面。

第三轮：恢复 render()，把显示文字换成“我点了 N 下”。用 textContent 显示用户文字，页面就把它作为文字处理；不要为了显示一个标题就改用 innerHTML。

本页新增的小练习先让你算对文字和剩余数量；主挑战再把它接到真实 DOM。

如果要保留自己的实验，先运行 `npm run concept -- 07 --prepare`，修改创建的文件，再用 `npm run concept -- 07 --local` 运行。HTML 保存后刷新浏览器。重复准备会保留你已有的文件。

#### 4 · 分开练，先不做整道题

1. **先练页面上要显示的那句话**：输入剩余数量，返回“剩余 N 项”。这题只练字符串，真实 DOM 在下面主挑战操作。
2. **再练统计未完成数量**：传入任务数组，返回未完成数量。
3. **最后练数据变化后的重新计算**：任务已经完成。让 label 根据新数据重新得到“剩余 0 项”。

网页下方有对应的小练习。每次只做一题：先运行起点 → 修改 → 检查 → 说清变化。做对以后换下一题，不需要先把整个主挑战写完。TS 小练习显示本地文件和命令，由真实编译器检查。

#### 5 · 做过之后，再认识这些名字

浏览器把 HTML 变成可操作的元素对象，这套对象叫 **DOM**。点击等发生的事情叫**事件**，收到事件后执行的函数叫**监听器**。

这里 render 只是我们给“重新把数据写到页面”这段函数起的名字，不是 JavaScript 自带的神奇刷新开关。普通 Node.js 脚本没有浏览器的 document，HTML 实验应在浏览器里打开。

做完小练习后，回主挑战把这些动作组合起来。若某一步仍说不清，就回到对应小题换一个数字再试；此时读更长的术语表帮助不大。
## 本关小步练习

### 07-01 · 先练页面上要显示的那句话

输入剩余数量，返回“剩余 N 项”。这题只练字符串，真实 DOM 在下面主挑战操作。

```js
function remainingText(count) { return "剩余 0 项"; }
```

在实验台选择这道小题，或运行 `npm run drill -- 07-01 --prepare` 后编辑 `practice/steps/07-01.js`，再运行 `npm run drill -- 07-01 --check`。

<details>
<summary>一点提示</summary>

模板字符串里的 ${count} 读本次传入的数。

</details>

<details>
<summary>试过后再看解释</summary>

```js
function remainingText(count) { return `剩余 ${count} 项`; }
```

先把要显示的文字算对，下一步才写进页面。

</details>

### 07-02 · 再练统计未完成数量

传入任务数组，返回未完成数量。

```js
function remainingCount(tasks) { return tasks.length; }
```

在实验台选择这道小题，或运行 `npm run drill -- 07-02 --prepare` 后编辑 `practice/steps/07-02.js`，再运行 `npm run drill -- 07-02 --check`。

<details>
<summary>一点提示</summary>

回想第 04 关 filter 的判断。

</details>

<details>
<summary>试过后再看解释</summary>

```js
function remainingCount(tasks) { return tasks.filter(task => !task.done).length; }
```

总任务数和未完成数量是不同的值，页面需要的是后者。

</details>

### 07-03 · 最后练数据变化后的重新计算

任务已经完成。让 label 根据新数据重新得到“剩余 0 项”。

```js
const task = { done: false };
let label = "剩余 1 项";
task.done = true;
// 在这里重新计算 label
```

在实验台选择这道小题，或运行 `npm run drill -- 07-03 --prepare` 后编辑 `practice/steps/07-03.js`，再运行 `npm run drill -- 07-03 --check`。

<details>
<summary>一点提示</summary>

?: 可以按条件选择两个值；也可以写 if/else。

</details>

<details>
<summary>试过后再看解释</summary>

```js
const task = { done: false };
let label = "剩余 1 项";
task.done = true;
label = `剩余 ${task.done ? 0 : 1} 项`;
```

字符串不会追踪对象变化，DOM 的文字同样需要主动更新。

</details>

<!-- foundations:end -->

## 先打开，再运行

用浏览器打开 [任务页面](../practice/07-dom/index.html)，同时在编辑器打开 [app.js](../practice/07-dom/app.js)。保存代码后刷新页面。此关通过实际操作验收，不在网页代码框里运行 DOM。

## 每次只改一点

1. 打开 practice/07-dom/index.html，先添加、完成一个任务。
2. 看到“剩余 0 项”一直不动，打开同目录的 app.js。
3. 在 render() 开头，给 remaining.textContent 赋值，显示未完成任务数。
4. 刷新后重复添加、完成，检查提示是否一直正确。

## 刚才发生了什么

页面上的字不会自动知道数组变了。每次状态更新后调用 render，让 DOM 重新反映任务数据。事件回调是把“用户点击”接到“更新数据”的地方。

## 卡住时，只看这个提示

<details>
<summary>展开提示</summary>

统计可用 tasks.filter(task => !task.done).length；把它放进模板字符串。

</details>

## 再做一个自己的版本

给每项任务增加“删除”按钮；删除后更新 tasks 并 render。用纯文本展示输入，不用 innerHTML。

## 验收与复盘

基础挑战以“添加或完成任务时，“剩余 N 项”都要同步变化。”为目标。JS / TS 关卡使用 `--check` 或网页“检查挑战”；第 07 关实际操作添加、完成后核对数量。扩展挑战自行观察和验证，不计入基础检查。

写下三句话：我改了哪一行；修改前后输出有什么差别；我换过哪些输入。不要只记住“通过”两个字。

<details>
<summary>已经试过，再看参考</summary>

放在 render 内：

```js
remaining.textContent = `剩余 ${tasks.filter(task => !task.done).length} 项`;
```

完整参考：[任务页面](../answers/practice/07-dom/index.html) · [代码](../answers/practice/07-dom/app.js)。

</details>

需要查语法时再看：[本课概念资料](../reference/07-浏览器和DOM.md)。下一关从 [教学总目录](../README.md) 进入。
