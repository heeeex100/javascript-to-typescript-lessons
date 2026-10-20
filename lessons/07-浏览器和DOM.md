# 07 · 综合大练习：可添加、完成、删除的任务面板

本关按“讲解一段 → 就地小练习”学习，最后完成综合大练习。

<!-- foundations:start -->
## 边看边练

### 数据变了，为什么页面上的字还没变

先把页面想成一张展示板。变量 clicks 是你在程序里记的数字，页面上的文字是另一次写出去的结果；修改数字后，要再写一次展示板。

#### 1 · 先练页面上要显示的那句话

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

HTML 的 button 创建按钮，p 创建放文字的区域；id 是让脚本找到它们的名字。这里脚本写在元素后面，因此运行时元素已经存在。

`document.querySelector("#count")` 在页面里找到 id=count 的那一块。先把找到的对象记为 label，后面就能更新它。

`label.textContent = ...` 把文字写进这一块。render() 每次读最新的 clicks，重新算出“点击 N 次”，再写出去。

addEventListener 注册一段“发生点击时再执行”的函数。注册时不先加 1；你点击后，才先 clicks+=1，然后 render() 更新文字。最后那句 render() 则负责页面刚打开时显示 0。


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
<summary>试过后再看解释</summary>

```js
function remainingText(count) { return `剩余 ${count} 项`; }
```

先把要显示的文字算对，下一步才写进页面。

</details>

#### 2 · 再练统计未完成数量

第一轮：打开 HTML，连续点击两次，应该从 0 变成 1、再变成 2。

第二轮：暂时删掉点击函数里的 render()，刷新后再点两次。程序里的 clicks 已改变，但显示还停在 0，因为没人把最新数字再写到页面。

第三轮：恢复 render()，把显示文字换成“我点了 N 下”。用 textContent 显示用户文字，页面就把它作为文字处理；不要为了显示一个标题就改用 innerHTML。

本页新增的小练习先让你算对文字和剩余数量；综合大练习再把它接到真实 DOM。

如果要保留自己的实验，先运行 `npm run concept -- 07 --prepare`，修改创建的文件，再用 `npm run concept -- 07 --local` 运行。HTML 保存后刷新浏览器。重复准备会保留你已有的文件。


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
<summary>试过后再看解释</summary>

```js
function remainingCount(tasks) { return tasks.filter(task => !task.done).length; }
```

总任务数和未完成数量是不同的值，页面需要的是后者。

</details>

#### 3 · 最后练数据变化后的重新计算

浏览器把 HTML 变成可操作的元素对象，这套对象叫 **DOM**。点击等发生的事情叫**事件**，收到事件后执行的函数叫**监听器**。

这里 render 只是我们给“重新把数据写到页面”这段函数起的名字，不是 JavaScript 自带的神奇刷新开关。普通 Node.js 脚本没有浏览器的 document，HTML 实验应在浏览器里打开。

做完小练习后，回综合大练习把这些动作组合起来。若某一步仍说不清，就回到对应小题换一个数字再试；此时读更长的术语表帮助不大。


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

## 本关综合大练习

**将任务数据、点击事件和重新渲染组合成可操作的页面。**

### 完成要求

- 输入非空标题可添加任务，空白输入给出提示。
- 点击完成后更新该项 done；点击删除后移除该项。
- 每次增、改、删后重新显示未完成数量；完成任务不计入剩余数量。
- 用户输入用 textContent 显示；页面刷新恢复初始状态，不要求持久化。

### 输入与预期结果

初始剩余 1 → 添加后 2 → 完成一项后 1 → 删除另一项后 0；空白输入不增加任务。

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
<summary>完成后复盘：这道题用到了什么</summary>

页面上的字不会自动知道数组变了。每次状态更新后调用 render，让 DOM 重新反映任务数据。事件回调是把“用户点击”接到“更新数据”的地方。

</details>

### 完成后再加一个需求

增加一个“全部完成”按钮，点击后所有任务完成且剩余数量变为 0。

扩展不计入本关基础验收。

<details>
<summary>已经独立尝试，再看完整参考</summary>

[综合大练习参考](../answers/finals/07-dom/app.js) · [参考页面](../answers/finals/07-dom/index.html)

</details>

[返回教学目录](../README.md)。
