# 在 Windows 上继续学 JavaScript / TypeScript

这份压缩包包含完整课程、动手实验台、本地练习、参考答案和检查脚本。你不需要在 Windows 上重新创建课程，也不需要安装 Git、Python 或全局 TypeScript。

## 1. 把压缩包传过去并解压

通过 U 盘、自己的网盘或文件传输工具，把新版 `typescript-windows-latest.zip`（旧包名为 `typescript-windows.zip` 或 `typescript-windows-advanced.zip`）传到 Windows。右键选择“全部解压”，例如解压到 `C:\Learning`，最终目录为：

```text
C:\Learning\typescript-course\
  README.md
  Windows使用说明.md
  start-workshop.cmd
  setup-typescript.cmd
  package.json
  workshop\
  practice\
  lessons\
  ...
```

必须先解压整个文件夹，不要从压缩包窗口直接运行脚本。目录不必与示例相同，启动脚本会自动定位到它所在的文件夹。后续更新课程时建议解压到新文件夹，先保留旧的 practice、exercises 和自己的其他代码，避免覆盖学习成果。

## 2. 检查或安装 Node.js

打开 Windows 的“命令提示符”（开始菜单搜索 `cmd`），运行：

```bat
node --version
npm.cmd --version
```

如果已有受支持的 Node.js LTS 版本且两条命令都成功，可以先使用现有环境。若没有安装或版本过旧，从 [Node.js 官方下载页](https://nodejs.org/en/download) 选择 **LTS、Windows、安装程序 .msi**。本说明查询时（2026-10-16）官网推荐 LTS 为 24.x。

架构可以在 Windows“设置 → 系统 → 系统信息”的系统类型中查看：常见 Intel / AMD 电脑选 x64；ARM 电脑选 ARM64。安装时保留 npm 和加入 PATH 的默认选项，完成后关闭并重新打开命令提示符，再检查版本。不需要额外安装编译工具链。

## 3. 先开始 JS 动手实验

双击解压目录中的 **start-workshop.cmd**，保持打开的终端窗口运行。在浏览器打开：

[打开本机动手实验台](http://127.0.0.1:8766/workshop/#01)

选择 01 关，先读页面上方默认展开的“动手前先认识”，展开小例子预测输出，再点击挑战的“运行代码”，尝试修好 20 + 5 得到 205 的问题。JS 网页实验无需先安装课程依赖；Node 安装好后就能启动，运行过程不需要外网。

00–18 每关都有概念解释、独立小实验和折叠自测答案；完整内容也在本地讲义中，可从 [概念导航](reference/概念导航.md) 查找。用 `npm.cmd run concept -- 08` 编译并运行概念原例（TS 先安装课程依赖）；用 `npm.cmd run concept -- 08 --prepare` 创建独立的 practice/concepts/08.ts，修改后用 `npm.cmd run concept -- 08 --local` 运行自己的版本。JS 也使用相同命令；07 准备 HTML 后用浏览器打开。重复准备不会覆盖自己的实验文件。

`127.0.0.1` 始终指当前这台电脑。在 Windows 打开这个地址前，必须先在 Windows 启动教程服务；它不会连接 Mac。Mac 上的预览窗口也不需要一直开着。

停止服务：在启动窗口按 Ctrl+C；若出现终止批处理的提示，输入 Y。再次学习时重新双击启动脚本。如果提示端口已被占用，先看看是不是已经开过一个教程窗口；不要重复启动多个。

也可以手动运行。先在文件资源管理器进入含 package.json 的课程目录，在地址栏输入 `cmd` 并回车，然后执行：

```bat
npm.cmd run workshop
```

## 4. 学到 TypeScript 时再安装依赖

联网后双击 **setup-typescript.cmd**。它会在当前课程目录执行 `npm.cmd ci --ignore-scripts`，安装锁定版本的 TypeScript 及 Windows 平台包，然后检查本机能否运行所有参考关卡。首次需要从 npm 下载文件，成功后日常练习可离线运行。

也可以在课程目录的命令提示符中手动执行：

```bat
npm.cmd ci --ignore-scripts
npm.cmd run verify:labs
```

不要从 Mac 复制 node_modules。压缩包已经排除了该目录，Windows 安装时会按自己的平台选择依赖。也不要用 `--omit=optional` 跳过本课程编译器所需的平台包。

## 5. 在 Windows 改自己的代码

新版还包含第 13～18 关进阶挑战：启动实验台后点击“进阶 13–18”。建议从搜索分页开始，再做撤销重做和异步任务；完整安排见 [进阶路线](challenges/README.md)。更新教程时解压到新目录，先保留旧目录中的练习文件。

使用现有代码编辑器打开整个 `typescript-course` 文件夹即可；如需安装编辑器，可从 [VS Code 官方页面](https://code.visualstudio.com/download) 下载 Windows 版本。JS 00～06 关也可以全程在网页编辑。

TS 关卡编辑本地文件，例如 `practice\08.ts`。保存后，在课程目录终端运行：

```bat
npm.cmd run lab -- 08
npm.cmd run lab -- 08 --check
```

第一条先做真实类型检查，再执行；第二条增加挑战验收。初始代码故意存在问题，第一次出现类型错误是正常教学步骤。其他尚未完成的关卡不会影响当前关卡。

第 07 关编辑 `practice\07-dom\app.js`，在浏览器打开下面的页面，保存代码后刷新：

[第 07 关任务页面](http://127.0.0.1:8766/practice/07-dom/index.html)

## 6. 学习进度怎么搬

| 内容 | 是否随这个压缩包搬走 |
| --- | --- |
| 课程正文、示例、答案 | 是 |
| 打包时已保存的 practice / exercises 本地代码 | 是 |
| Mac 浏览器代码框里的草稿和通关标记 | 课程包不包含，可另用学习备份迁移 |
| Mac 的 Node、node_modules、临时文件 | 否 |

新版实验台支持直接迁移网页进度：

1. 在 Mac 的实验台展开左侧“备份与迁移”，点击“导出学习备份”。
2. 把生成的 `js-ts-learning-backup.json` 与课程压缩包一起传到 Windows。
3. Windows 打开新版实验台后点击“导入学习备份”，查看冲突摘要，再确认。默认保留 Windows 上已有的不同草稿，明确勾选才会替换。

备份包含网页 JS 草稿和可对应到代码/验收的通关记录，不包含 TS / DOM 本地文件。旧版 true/false 通关记录需重验，草稿保留。若要把网页代码用于终端练习，点击“下载代码”，再手动保存到对应 practice 文件；也可继续复制代码。

当前课程压缩包是制作时的文件快照；之后新改的本地代码需要再次传输。更新实验台后先导出备份，再切换新版本，可降低误覆盖自己练习的可能。

在 Windows 网页中输入的代码仍然只保存在那个浏览器中，不能自动成为本地 practice 文件。网页练习和终端练习可以选一种为主；切换时通过复制代码衔接。同一电脑不同浏览器，以及 localhost 与 127.0.0.1，也可能使用不同的浏览器存储；建议固定使用本文的地址。

## 遇到问题时

- **找不到 node / npm**：安装 Node 后重新打开终端；确认 `node --version` 和 `npm.cmd --version` 都成功。
- **PowerShell 提示无法加载 npm.ps1**：把教程命令中的 `npm` 改成 `npm.cmd`，或使用命令提示符。无需为本教程修改执行策略。
- **网页打不开**：确认 start-workshop.cmd 的窗口仍在运行、地址是 `http://127.0.0.1:8766/workshop/`。把启动窗口的错误发来即可。
- **找不到 TypeScript 编译器**：先在当前课程目录运行 setup-typescript.cmd，安装完成再做第 08 关。
- **安装失败**：保留错误信息，检查能否访问 npm；不要先删除自己的练习或随意替换依赖版本。
- **找不到 package.json**：终端不在课程根目录；进入含该文件的文件夹再运行。

本包已在 macOS 上重新解压并验证 Node / TypeScript 教学脚本；Windows 启动脚本按 cmd 语法编写，但尚未在你的 Windows 电脑上实机验证。完成第 2～4 步后，`verify:labs` 可以确认当地环境能运行课程。
