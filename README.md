# 动手学 JavaScript → TypeScript

一套中文编程课程，从第一行 JavaScript 写到带类型约束的任务管理工具，再练习撤销重做、请求竞态和并发控制。

目前包含 **19 关、82 道小练习和 19 个综合任务**。每段讲解下面有对应的练习，网页可以运行 JavaScript 并检查结果；TypeScript 使用本地编译器检查。支持 Windows、macOS 和 Linux，需要 **Node.js 24 或更高版本**。

[从第 00 关阅读](lessons/00-开始之前.md) · [完整学习路线](reference/概念导航.md) · [基础语法说明位置](reference/基础语法检查.md) · [Windows 使用说明](Windows使用说明.md)

## 下载与启动

先安装 [Node.js](https://nodejs.org/en/download)，在终端运行 `node --version` 确认版本不低于 24。

**使用 Git 下载：**

```sh
git clone https://github.com/heeeex100/javascript-to-typescript-lessons.git
cd javascript-to-typescript-lessons
npm run workshop
```

**不使用 Git：** 点击仓库的 **Code → Download ZIP**，完整解压。在包含 `package.json` 的课程目录中打开终端，运行：

```sh
npm run workshop
```

打开终端显示的网址，默认是 **http://127.0.0.1:8766/workshop/**。页面只供本机访问。保持这个终端窗口开着；停止时在同一个窗口按 **Ctrl+C**。

Windows 也可以双击课程根目录的 [`start-workshop.cmd`](start-workshop.cmd)。PowerShell 若阻止执行 `npm.ps1`，把命令中的 `npm` 换成 `npm.cmd`。

JavaScript 网页练习不需要先安装 npm 依赖。学到 TypeScript 时，在课程目录执行一次：

```sh
npm ci
```

Windows 也可双击 [`setup-typescript.cmd`](setup-typescript.cmd) 安装并检查。无需全局安装 TypeScript，也不要从另一台电脑复制 `node_modules`。

GitHub 上可以直接阅读讲义；交互实验台需要下载后在本机启动，不是一个已部署的在线网站。

## 课程里怎么练

例如第 02 关从 `total = total + 3` 开始，解释等号两边分别在做什么，再写循环、加入条件，最后完成专注记录统计器。第 03 关练参数、返回值、回调和闭包，最后写一个能记录订单数的结账工具。

基础语法也有具体对照：分号省略后什么时候仍能运行，`return` 后换行为什么会得到 `undefined`，箭头函数加上花括号后为什么需要 `return`，以及 TS 中 `?`、`?.`、`??` 和后置 `!` 的区别。说明分散在对应章节，索引见 [基础语法检查](reference/基础语法检查.md)。

网页一次显示一段讲解和它的小题，点击“继续下一段讲解”前进。最后是综合任务，列出完成要求和输入输出；提示与参考答案可按需展开。普通 JS 小题和网页综合题使用真实代码运行，不预设输出。TS 练习由本地编译器产生类型错误，不在网页里模拟。

起始代码中的错误或未完成部分是题目的一部分，第一次检查失败是正常现象。可以在输出区看到失败原因，修改后重新检查。

## 学习路线

### JavaScript 基础 · 00～07

| 关卡 | 内容 | 综合任务 |
| --- | --- | --- |
| [00](lessons/00-开始之前.md) | 变量、文字、输出、分号与基本标点 | 做一张完整学习卡 |
| [01](lessons/01-变量和值.md) | 文字与数字、转换、赋值、算术顺序 | 做学习时长计算面板 |
| [02](lessons/02-条件和循环.md) | 条件、循环、逻辑运算、边界值 | 专注记录统计器 |
| [03](lessons/03-函数和作用域.md) | 参数、返回值、回调、作用域与闭包 | 会记订单数的结账工具 |
| [04](lessons/04-数组和对象.md) | 属性、筛选、转换、解构与复制 | 保留原列表的任务编辑器 |
| [05](lessons/05-模块和错误.md) | 模块、JSON、异常、错误定位与断点 | 跨文件的任务存档工具 |
| [06](lessons/06-异步编程.md) | Promise、async/await、成功与失败 | 带成功与失败反馈的加载器 |
| [07](lessons/07-浏览器和DOM.md) | DOM、表单、事件、数据与页面更新 | 可添加、完成、删除的任务面板 |

### TypeScript 基础与实战 · 08～12

| 关卡 | 内容 | 综合任务 |
| --- | --- | --- |
| [08](lessons/08-进入TypeScript.md) | 类型注解、推断、编译检查与真实数据 | 有类型约束的分钟输入工具 |
| [09](lessons/09-对象类型和接口.md) | 接口、可选属性、可选链与默认值 | 格式化完整任务卡 |
| [10](lessons/10-联合类型和收窄.md) | unknown、联合类型、收窄与结果分支 | 标题输入与结果展示 |
| [11](lessons/11-泛型.md) | 泛型、约束、输入输出类型关系 | 保留输入类型的查找工具箱 |
| [12](lessons/12-综合项目.md) | 类型与数据操作、不修改输入、失败结果 | 支持删除和重命名的任务服务 |

### 进阶挑战 · 13～18

| 关卡 | 内容 | 综合任务 |
| --- | --- | --- |
| [13](challenges/13-task-query.md) | 筛选、排序、关键词搜索与分页 | 能搜索、排序、翻页的任务列表 |
| [14](challenges/14-undo-redo.md) | 闭包、独立状态与历史记录 | 给编辑器加撤销和重做 |
| [15](challenges/15-latest-request.md) | 请求身份、完成顺序与过期结果 | 修复搜索结果被旧请求覆盖 |
| [16](challenges/16-concurrency-pool.md) | 延迟启动、并发上限与结果顺序 | 最多同时执行两项的任务池 |
| [17](challenges/17-validate-import.md) | 外部输入、逐字段校验与错误路径 | 导入脏数据时一次列出所有错误 |
| [18](challenges/18-typed-events.md) | 事件名、载荷类型、订阅与取消 | 事件名与载荷对应的通知器 |

进阶题的完整要求见 [进阶挑战目录](challenges/README.md)，网页左侧也可以切换到“进阶 13～18”。

## 网页练习与本地练习

下表区分的是综合任务的完成方式。第 05 关的模块小题 `05-04`、`05-05` 和断点小题 `05-08` 也需要本地文件；其余普通 JS 小题可以在网页完成。

| 任务 | 在哪里完成 |
| --- | --- |
| 00～04、06、13～16 | 网页编辑、运行和检查，也可编辑本地文件 |
| 05 | 在本地编辑 `storage.js` 和 `main.js`，用 Node.js 检查 |
| 07 | 编辑实际 HTML/JS 页面，在浏览器中操作并观察 |
| 08～12、17～18 | 编辑本地 `.ts` 文件，用 TypeScript 编译器检查 |

### 准备一道小练习

```sh
npm run drill -- 05-04 --prepare
# 编辑 practice/steps/05-04/main.js，同目录有配套的 minutes.js。
npm run drill -- 05-04 --check
```

TS 小题的用法相同，例如 `npm run drill -- 08-01 --prepare`。`--prepare` 会创建对应文件；重复执行会保留已有修改，包括模块小题的配套文件。

### 完成综合任务

```sh
npm run lab -- 03
npm run lab -- 03 --check
```

第 03 关读取 [`practice/finals/03-checkout.js`](practice/finals/03-checkout.js)。第 05 关在 [`practice/finals/05-storage/storage.js`](practice/finals/05-storage/storage.js) 中实现保存与读取，入口是同目录的 `main.js`；使用 `npm run lab -- 05 --check` 验收。其他关卡的实际文件路径见页面或讲义。

原来的 `practice/00.js` 等基础练习仍保留，当前基础综合任务使用 `practice/finals/`；进阶任务使用 `practice/13.js`～`18.ts`。旧版网页自定义草稿也保留，要换用当前起点时先保存旧代码，再点击“加载大练习起点”。

### 单独运行讲解中的原例

```sh
npm run concept -- 08
npm run concept -- 08 --prepare
# 编辑 practice/concepts/08.ts。
npm run concept -- 08 --local
```

不加选项时运行本关第一个概念例子；`--prepare` 创建独立实验文件，`--local` 运行修改后的版本。JS 文件使用 `.mjs`，07 的 HTML 实验在浏览器中运行。TS 示例需要先执行 `npm ci`。

## 保存进度与换电脑

**网页草稿与本地文件是两份独立数据，不会自动同步。**

- 网页综合题的 JS 草稿和对应验收记录可通过左侧“备份与迁移”导出、导入。导入时默认保留本机有冲突的草稿。
- 网页小练习的草稿单独保存在浏览器中，**不包含在上述备份中**，需要另外复制保存。
- `.ts`、DOM、模块等本地练习文件需要单独备份。网页的导入操作不会写入这些文件。
- `practice/steps/` 和 `practice/concepts/` 不提交到 Git，也不收进维护者生成的课程 ZIP。

网页综合题支持下载代码；快捷键为 `Ctrl / ⌘ + Enter` 运行，加 Shift 检查。修改代码或验收规则后，旧的通过记录需要重新检查。

Windows 的安装、迁移与启动步骤见 [Windows 使用说明](Windows使用说明.md)。

## 文件目录

| 路径 | 用途 |
| --- | --- |
| `workshop/` | 本地网页实验台 |
| `lessons/`、`challenges/` | 包含讲解、小题和综合要求的完整讲义 |
| `practice/finals/` | 当前基础综合任务的起始文件 |
| `practice/13.js`～`18.ts` | 进阶综合任务的起始文件 |
| `practice/steps/`、`practice/concepts/` | 命令创建的小题与独立实验文件 |
| `answers/finals/`、`answers/practice/` | 基础综合题与进阶题的参考实现；也保留旧版参考 |
| `reference/` | 概念索引、语法说明位置与补充参考 |
| `reference/foundations/`、`workshop/drills.js` | 讲解和小题的维护原稿 |
| `examples/`、`project/` | 可运行示例与任务管理参考项目 |
| `checks/`、`scripts/` | 验收、实验工具、预览服务和打包脚本 |

## 课程检查与维护

本地检查课程本身，而不是要求学习者的未完成代码全部通过：

```sh
npm ci --ignore-scripts
npm run verify
npm run verify:labs
npm run verify:drills
```

这些命令检查概念原例、TS 编译、示例与参考答案、工具行为，以及综合题和 82 道小题的起点与答案。真实 DOM 操作和调试器中的观察需要另行确认。GitHub Actions 在 Windows/Linux、Node.js 24/26 上执行以上检查。

修改概念原稿后运行 `npm run sync:concepts`，用 `npm run check:concepts` 核对网页与讲义是否一致。维护者可执行 `python3 scripts/package-windows.py` 生成本地课程 ZIP 和校验值；学习者运行课程不需要 Python。更多约定见 [CONTRIBUTING.md](CONTRIBUTING.md)，已做的验证见 [学习检查记录](学习检查记录.md)。

## 参考资料与范围

课程示例围绕具体任务编写，基础语法说明参考 [MDN JavaScript 指南](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide)、[现代 JavaScript 教程](https://javascript.info/) 和 [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)。逐项参考与说明位置见 [基础语法检查](reference/基础语法检查.md)。

目前的主线是 JS 基础、TS 类型与若干进阶应用。Map/Set 等内容在用到它们的题目中解释；类与 this 的完整机制、字符串专项、日期正则、真实网络请求以及 React/Vue 等尚未形成独立课程。

## 常见问题

**node 或 npm 找不到？** 安装 Node.js 后重新打开终端，确认 `node --version` 不低于 24。

**8766 端口已占用？** 先检查自己是否已有一个运行课程的终端。需要重启时在那个窗口按 Ctrl+C，再执行启动命令。

**TS 提示缺少编译器？** 在含 `package.json` 的目录执行 `npm ci`，不需要全局安装。

**网页改了代码，终端却还是旧结果？** 网页草稿不会写入本地文件。复制或下载到本关实际文件后，再用终端检查。

**参考答案在哪里？** 每道小题的折叠区有答案与解释，综合任务的讲义末尾有参考链接；源码也在 `answers/` 中。
