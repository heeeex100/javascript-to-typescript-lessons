# 07 · 让页面显示剩余任务数

今天做出来的效果：**添加或完成任务时，“剩余 N 项”都要同步变化。**

<!-- foundations:start -->
## 动手前先认识

先读下面几个概念，再展开小例子预测输出。看完即可回到本关练习，不必先背术语。

### DOM、事件、状态与渲染

**DOM（文档对象模型）**是浏览器对 HTML 页面建立的对象树。JS 通过这些对象读写页面；普通 Node.js 脚本没有浏览器的 document。

- **查询元素**：`document.querySelector("#count")` 查找 id 为 count 的元素；找不到会返回 null。脚本要在相关元素创建后执行，例如使用 defer 或放在元素后面。
- **事件与监听器**：addEventListener 注册回调；注册时不执行回调，用户点击等事件发生时才调用。回调可以更新数据，再更新页面。
- **状态与渲染**：状态是程序当前的数据；render 把状态反映到页面。数组变化不会自动改变原生 DOM，必须调用相应更新代码。
- **文本与 HTML**：textContent 将内容作为文字显示，适合用户输入；innerHTML 会解析 HTML。这里始终使用 textContent 展示任务文本。
- **表单默认行为**：提交表单可能触发页面导航；需要留在当前页面处理时，在 submit 事件里使用 event.preventDefault()。

<details>
<summary>读例子 → 改一个地方 → 检查理解</summary>

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

**逐步理解**：这是完整 HTML 片段，可单独保存为 concept-dom.html 后用浏览器打开。初始显示 0 次，每点击一次增加 1。脚本在元素后面，所以查询时元素已存在。

**动手试一试**：暂时删除回调里的 render()，点击两次后观察文字为什么没变。不要覆盖本关已有页面；另建实验文件即可。

这是独立的概念小实验，不计入本关验收。运行 `npm run concept -- 07 --prepare` 创建 `practice/concepts/07.html`，用浏览器打开并修改；重新准备不会覆盖已有文件。

**先回答，再展开**：clicks 已经变成 2，页面为什么仍可能显示 0？

<details>
<summary>查看解释</summary>

变量与 DOM 是两份不同的状态表示。这里只更新变量不会自动渲染；调用 render 才会把最新值写入 textContent。

</details>

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
