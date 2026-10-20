# 维护与反馈

课程的目标是让初学者通过预测、运行、修改、观察和解释建立理解。修改教学时优先给出具体例子和实际反馈；保留学习者已有的草稿与练习。

## 本地验证

使用 Node.js 24 或更高版本，在项目根目录运行：

```sh
npm ci --ignore-scripts
npm run verify
npm run verify:labs
```

verify 包含概念同步检查、18 个概念例子的真实执行与预期输出核对、TS 编译、项目/示例行为检查及实验台自动化测试。verify:labs 使用内置起始代码及参考答案，检查起始问题确实被发现、正确解法确实通过；不读取学习者已完成的答案来判断起始题是否失败。

GitHub Actions 在 Windows/Linux、Node.js 24/26 上执行以上命令。浏览器 DOM 第 07 关和页面交互仍需人工或浏览器自动化确认，命令行通过不代表 UI 已验证。

## 修改概念与题目

- 概念原稿：reference/foundations/00.md 到 18.md。保留一个可独立执行的 js、ts 或 html 代码块；修改后运行 `npm run sync:concepts`，提交自动更新的讲义和 workshop/foundations.js。
- 如果示例的预期输出有意改变，同时更新 checks/concepts.mjs 中对应预期，并确认正文中的解释相符。
- 基础题目数据：workshop/labs.js；进阶题目：workshop/advanced-labs.js。调整验收时同步题目说明、起始文件与参考解法。
- 学习者的 `practice/concepts/` 是独立实验，不提交 Git，也不进入课程压缩包。不要为了让测试通过而替学习者填写 practice 或 exercises。
- `.cmd` 文件保持 CRLF，其他文本使用 LF；.gitattributes 会在检出时处理。

## 提交反馈

请提供关卡编号、操作步骤、实际输出、预期结果，以及 Node.js 版本和操作系统。可以粘贴最小复现代码；学习备份可能包含自己的草稿，分享前先检查内容。

## 打包

维护者运行 `python3 scripts/package-windows.py` 生成 Windows 课程 ZIP 和 SHA-256。学习者不需要 Python。压缩包不含 node_modules、Git 历史、环境配置和独立概念实验，Windows 端按说明安装编译器。
