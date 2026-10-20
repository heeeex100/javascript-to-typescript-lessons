# 07 · 浏览器和 DOM：把代码接到页面上

目标：输入标题、添加任务、点击完成，理解事件如何改变页面。

用浏览器打开 `examples/browser/index.html`，无需安装依赖或启动服务。这里使用带 defer 的普通脚本，方便直接打开本地文件；第 05 课的模块形式在网页里通常搭配本地 HTTP 服务使用。

## 1. 最少量的 HTML

```html
<form id="task-form">
  <input id="title" placeholder="输入任务">
  <button>添加</button>
</form>
<ul id="tasks"></ul>
```

form 是表单，input 是输入框，button 是按钮，ul 是列表。`id` 是这个页面内用于定位元素的标识。CSS 负责样式；JS 负责响应事件、处理数据。完整示例已包含可访问的 label。

浏览器把页面解析成对象树，叫 DOM。`document.querySelector("#title")` 根据选择器找元素，找不到返回 null。

## 2. 注册事件，不是立刻执行

```js
form.addEventListener("submit", event => {
  event.preventDefault();
  const title = input.value.trim();
  // 接下来校验输入并更新数组
});
```

addEventListener 保存回调，等提交事件出现时调用。preventDefault 阻止表单默认导航行为。输入框 value 是字符串，trim 去除两侧空白。

脚本用 defer 加载，因此会在 HTML 解析完成后执行，能够找到已声明的元素。把查询语句放到过早执行的脚本中可能拿到 null。

## 3. 数据 → 页面

阅读 `app.js` 时按顺序找：tasks 数组、render 函数、submit 回调。每次添加或完成任务后，更新 tasks，再调用 render 根据当前数据重建列表。

```text
用户提交 → 读取字符串 → 校验 → 更新 tasks → render → 页面变化
```

用户输入通过 textContent 显示，输入 `<b>你好</b>` 时会显示原样文本。innerHTML 会把字符串当 HTML 解析，不适合在这里直接放入用户输入。

这里的数据只存在当前页面内存中，刷新后恢复初始状态。学习持久化前，先理解状态与页面的对应关系。

## 练习

先完成手动验收：添加“学习 JS”；只输入空格应有提示；点击“完成”后文字有删除线；刷新后恢复初始任务。然后增加“只看未完成”复选框，在 render 中用 filter 筛选。

不要为了筛选直接删除 tasks 中的已完成项；显示条件与原始数据是两回事。参考思路在 `answers/逐课答案.md`。

## 验收

能找到“哪行保存数据”和“哪行创建元素”；解释为什么不能用 `node examples/browser/app.js` 运行这个网页脚本：Node 默认没有 document。

下一课：[进入 TypeScript](08-进入TypeScript.md)。
