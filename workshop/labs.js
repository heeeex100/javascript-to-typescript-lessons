globalThis.learningLabs = [
  {
    "id": "00",
    "title": "给自己做一张学习卡",
    "goal": "让程序打印你的名字和今天要做的小事。",
    "starter": "const learner = \"你的名字\";\nconst topic = \"JavaScript\";\nconst message = `${learner}，今天动手学 ${topic}`;\nconsole.log(message);\n",
    "checks": "check(learner.trim().length > 0 && learner !== \"你的名字\", \"把 learner 改成自己的名字\");\ncheck(message.includes(learner) && message.includes(topic), \"学习卡中应包含名字与主题\");",
    "steps": [
      "直接运行，观察程序目前叫你什么。",
      "只改 learner 引号里面的文字，再运行。",
      "把 topic 改成“数组”，观察输出哪里变化。"
    ],
    "concept": "你刚才把名字存在 learner 中，这就是变量绑定；引号里的内容是字符串。console.log 把值显示出来。模板字符串里的 ${learner} 会取出这个值。",
    "hint": "只改双引号里的名字，保留引号；不要把 console.log 当作要输入的终端命令。",
    "extension": "增加 const minutes = 15，把学习卡改成“名字，今天学习主题 15 分钟”。",
    "lang": "js",
    "file": "practice/00.js",
    "lesson": "lessons/00-开始之前.md"
  },
  {
    "id": "01",
    "title": "修好学习时长计算器",
    "goal": "输入“20”，再学 5 分钟，结果应是数字 25。",
    "starter": "const input = \"20\";\nconst bonus = 5;\nconst total = input + bonus;\nconsole.log(\"输入类型：\", typeof input);\nconsole.log(\"累计分钟：\", total);\nconsole.log(\"结果类型：\", typeof total);\n",
    "checks": "check(typeof total === \"number\", \"结果还不是数字：试着先转换 input\");\ncheck(Number.isFinite(total) && total === Number(input) + bonus, \"总时长应是两个数字相加\");",
    "steps": [
      "先运行，看看为什么显示 205，而不是 25。",
      "只修改 total 这一行，把 input 转成数字后相加。",
      "把 input 改成“0”“30”，再运行与检查。",
      "最后试“abc”和空字符串，观察不同结果；这轮不要求通过检查。"
    ],
    "concept": "输入框和引号里的“20”是字符串。+ 在这里做了拼接。Number(input) 才产生可计算的数字。typeof 帮你看到区别。空文本转为 0、错误文本转为 NaN，所以转换与校验是两件事。",
    "hint": "先试 console.log(Number(input))，再把它接入 total 的计算。",
    "extension": "新增 let totalMinutes = 0，让它先增加 20，再增加 5，并打印每一步。",
    "lang": "js",
    "file": "practice/01.js",
    "lesson": "lessons/01-变量和值.md"
  },
  {
    "id": "02",
    "title": "找出漏掉的专注记录",
    "goal": "统计至少 25 分钟的记录：总时长 65，次数 2。",
    "starter": "const sessions = [10, 25, 40, 15];\nlet total = 0;\nlet count = 0;\nfor (const minutes of sessions) {\n  if (minutes > 25) {\n    total += minutes;\n    count += 1;\n  }\n  console.log(\"读到\", minutes, \"累计\", total, \"次数\", count);\n}\n",
    "checks": "const expected = sessions.filter(value => value >= 25);\ncheck(total === expected.reduce((sum, value) => sum + value, 0), \"是否漏掉了刚好 25 分钟的记录？\");\ncheck(count === expected.length, \"次数应等于所有达标记录的数量\");",
    "steps": [
      "先运行，找到“读到 25”的那行，累计值有没有改变？",
      "修改比较符号，让“至少 25”包含 25。",
      "在 sessions 最后增加 25，预期总时长 90、次数 3。",
      "把 sessions 改成 []，观察是否仍能得到两个 0。"
    ],
    "concept": "if 决定当前记录是否参与统计；for...of 逐条取记录。total 和 count 放在循环外，因此能累加。如果每轮都重新声明并置零，就无法记住上轮结果。",
    "hint": "“大于”和“大于或等于”差在哪里？只需改一个字符。",
    "extension": "增加 skipped 统计未达标次数，并在每轮打印出来。",
    "lang": "js",
    "file": "practice/02.js",
    "lesson": "lessons/02-条件和循环.md"
  },
  {
    "id": "03",
    "title": "修好咖啡结账函数",
    "goal": "买 2 杯单价 12 元的咖啡，调用方应拿到数字 24。",
    "starter": "function checkout(quantity, unitPrice = 12) {\n  const total = quantity * unitPrice;\n  console.log(\"店员说：\", total);\n}\nconst payment = checkout(2);\nconsole.log(\"付款系统拿到：\", payment);\n",
    "checks": "check(checkout(2) === 24, \"打印不等于返回，付款系统还没拿到 24\");\ncheck(checkout(3, 10) === 30, \"要按传入的单价计算，不能写死 24\");\ncheck(checkout(0) === 0, \"购买 0 杯应返回 0\");",
    "steps": [
      "运行，比较“店员说”和“付款系统拿到”的值。",
      "补一行代码，让 checkout 把结果交给调用方。",
      "试 checkout(3, 10) 与 checkout(0)，预测结果再检查。"
    ],
    "concept": "quantity、unitPrice 接收调用参数；默认单价只在未传或传 undefined 时使用。console.log 只显示，return 才交回结果。函数因此可以接到另一段计算中。",
    "hint": "在函数最后加入 return，返回刚算出的 total。",
    "extension": "再写一个 discount(total, coupon) 函数，让 checkout 的结果减去优惠券；结果不能小于 0。",
    "lang": "js",
    "file": "practice/03.js",
    "lesson": "lessons/03-函数和作用域.md"
  },
  {
    "id": "04",
    "title": "筛出真正还没完成的任务",
    "goal": "从列表中只拿出未完成任务的标题。",
    "starter": "const tasks = [\n  { id: 1, title: \"读 JS\", done: false },\n  { id: 2, title: \"喝水\", done: true },\n  { id: 3, title: \"写练习\", done: false },\n];\nfunction pendingTitles(items) {\n  return items.filter(task => task.done).map(task => task.title);\n}\nconsole.log(pendingTitles(tasks));\n",
    "checks": "check(JSON.stringify(pendingTitles([{title:\"A\",done:false},{title:\"B\",done:true}])) === '[\"A\"]', \"只保留 done 为 false 的标题\");\ncheck(JSON.stringify(pendingTitles([])) === '[]', \"空数组应返回空数组\");\ncheck(JSON.stringify(pendingTitles([{title:\"C\",done:true}])) === '[]', \"全部完成时不应有待办\");",
    "steps": [
      "先运行，看看为什么只显示了已经喝过的水。",
      "修改 filter 的判断，再运行。",
      "把第一项 done 改为 true，观察标题是否消失。",
      "增加一个自己的任务，让它出现在结果里。"
    ],
    "concept": "一个对象记录一项任务，数组放多项任务。filter 的回调决定保留谁；map 把保留的对象变成标题。!task.done 表示“还没完成”。",
    "hint": "完成标记是 true，但待办要保留 false；尝试 !。",
    "extension": "使用 map 把 id 为 1 的任务标为完成，要求原 tasks 不变：打印前后两个数组证明。",
    "lang": "js",
    "file": "practice/04.js",
    "lesson": "lessons/04-数组和对象.md"
  },
  {
    "id": "05",
    "title": "给坏掉的存档加一层保护",
    "goal": "读入 JSON 存档，遇到坏文本或非数组时返回空列表。",
    "starter": "function loadTasks(text) {\n  return JSON.parse(text);\n}\nconsole.log(\"正常存档：\", loadTasks('[{\"title\":\"学习\"}]'));\nconsole.log(\"坏存档：\", loadTasks('oops'));\n",
    "checks": "check(loadTasks('[{\"title\":\"学习\"}]')[0].title === \"学习\", \"正常 JSON 应保留内容\");\nfor (const bad of ['oops', 'null', '123', '{}']) {\n  check(JSON.stringify(loadTasks(bad)) === '[]', \"坏文本或非数组应返回 []：\" + bad);\n}",
    "steps": [
      "先运行，观察正常存档之后在哪一行中断。",
      "给 JSON.parse 加 try / catch；失败返回 []。",
      "试“null”和“123”，它们没有语法错误，但仍不是列表。",
      "增加 Array.isArray 检查，再运行检查。"
    ],
    "concept": "JSON 是文本，JSON.parse 把它变成 JS 值。try / catch 在解析抛错时接住失败；结构检查处理“能解析但不是数组”的情况。本实验选择回退到空列表，正式项目也可以明确返回失败。",
    "hint": "catch 只能处理抛出的错误；JSON.parse(\"null\") 不会抛错，因此还需要检查解析结果。",
    "extension": "在 examples/js/lib/tasks.js 加 countPending 导出，再在 05-modules.js 导入并打印待办数量，体验跨文件复用。",
    "lang": "js",
    "file": "practice/05.js",
    "lesson": "lessons/05-模块和错误.md"
  },
  {
    "id": "06",
    "title": "等到外卖到了再拆袋",
    "goal": "看到“准备 → 已下单 → 拿到 2 项”，并真正拿到数组。",
    "starter": "async function loadTasks() {\n  await new Promise(resolve => setTimeout(resolve, 60));\n  return [\"写代码\", \"喝水\"];\n}\nconsole.log(\"准备\");\nconst request = loadTasks();\nconsole.log(\"已下单\");\nconst tasks = request;\nconsole.log(\"拿到\", tasks.length, \"项\");\n",
    "checks": "check(Array.isArray(tasks), \"你拿到的还是 Promise，要等待结果\");\ncheck(tasks.length === 2, \"应拿到 2 个任务\");",
    "steps": [
      "先运行，观察“拿到”的数量为什么是 undefined。",
      "在接收 request 结果时增加 await，再运行。",
      "把延迟改为 500 毫秒，感受等待发生在哪两行之间。",
      "把 return 改成 throw new Error(\"配送失败\")，在调用处用 try / catch 处理；完成后恢复再检查。"
    ],
    "concept": "loadTasks 返回 Promise，相当于一张将来取结果的凭证。await 等它成功后拿到数组；失败则在等待处抛错。你看到的日志顺序来自真实执行，而不是预录动画。",
    "hint": "修改 const tasks = request，而不是在 .length 后加 await。",
    "extension": "连续加载两次，先顺序 await，再试 Promise.all；分别打印开始和结束，解释差别。",
    "lang": "js",
    "file": "practice/06.js",
    "lesson": "lessons/06-异步编程.md"
  },
  {
    "id": "07",
    "title": "让页面显示剩余任务数",
    "goal": "添加或完成任务时，“剩余 N 项”都要同步变化。",
    "starter": "// 本课直接编辑 practice/07-dom/app.js，并在浏览器刷新。\n",
    "checks": "",
    "steps": [
      "打开 practice/07-dom/index.html，先添加、完成一个任务。",
      "看到“剩余 0 项”一直不动，打开同目录的 app.js。",
      "在 render() 开头，给 remaining.textContent 赋值，显示未完成任务数。",
      "刷新后重复添加、完成，检查提示是否一直正确。"
    ],
    "concept": "页面上的字不会自动知道数组变了。每次状态更新后调用 render，让 DOM 重新反映任务数据。事件回调是把“用户点击”接到“更新数据”的地方。",
    "hint": "统计可用 tasks.filter(task => !task.done).length；把它放进模板字符串。",
    "extension": "给每项任务增加“删除”按钮；删除后更新 tasks 并 render。用纯文本展示输入，不用 innerHTML。",
    "lang": "dom",
    "file": "practice/07-dom/app.js",
    "lesson": "lessons/07-浏览器和DOM.md"
  },
  {
    "id": "08",
    "title": "让编译器拦住错误的加法",
    "goal": "先看真实类型错误，再把文本转成数字，得到 25。",
    "starter": "function add(a: number, b: number): number {\n  return a + b;\n}\nconst input = \"20\";\nconst total = add(input, 5);\nconsole.log(\"总时长：\", total);\n",
    "checks": "check(total === 25, \"默认输入应得到数字 25\");\ncheck(add(0, 5) === 5 && add(30, 5) === 35, \"不能把结果写死\");",
    "steps": [
      "运行 npm run lab -- 08，先阅读 string 不能传给 number 的错误。",
      "修改 practice/08.ts：转换 input，再运行同一命令。",
      "运行 npm run lab -- 08 --check，查看挑战结果。",
      "再次传入字符串体验编译错误，然后恢复。"
    ],
    "concept": "第 01 课的拼接问题，这次在执行前被发现。: number 是类型约束，不是转换动作。命令先用真实 tsc 检查并生成 JS，成功后才执行。",
    "hint": "保留 add 的 number 参数；在调用处使用 Number(input)。不要用 any 绕过检查。",
    "extension": "新增 square(value: number)，故意传字符串看看编译器在哪一行阻止你。",
    "lang": "ts",
    "file": "practice/08.ts",
    "lesson": "lessons/08-进入TypeScript.md"
  },
  {
    "id": "09",
    "title": "处理没有备注的任务卡",
    "goal": "有备注时显示备注，缺失或全空格时显示“无备注”。",
    "starter": "interface Task {\n  title: string;\n  note?: string;\n}\nfunction noteText(task: Task): string {\n  return task.note.trim();\n}\nconsole.log(noteText({ title: \"写练习\" }));\n",
    "checks": "check(noteText({title:\"A\"}) === \"无备注\", \"没有 note 时应显示默认值\");\ncheck(noteText({title:\"A\",note:\"  \"}) === \"无备注\", \"空白备注也应显示默认值\");\ncheck(noteText({title:\"A\",note:\" 复习 \"}) === \"复习\", \"有效备注需要去除两侧空白\");",
    "steps": [
      "运行第 09 关，看到 note 可能为 undefined 的提示。",
      "先加 ?.，观察为什么返回值仍可能不符合 string。",
      "加默认值，试缺失、空格、正常备注三组数据。",
      "运行 --check，解释为什么本题空字符串也需要默认值。"
    ],
    "concept": "? 表示 note 可以不提供；?. 允许它缺失时停止访问。|| 会给空字符串也提供默认值，本题正好需要这个行为；如果要保留空字符串，则应考虑 ??。",
    "hint": "先算 task.note?.trim()，再用 || \"无备注\" 处理空值和空文本。",
    "extension": "给 Task 加 readonly id，并尝试改 id；观察编译器报错后撤销该赋值。",
    "lang": "ts",
    "file": "practice/09.ts",
    "lesson": "lessons/09-对象类型和接口.md"
  },
  {
    "id": "10",
    "title": "拒绝乱填的任务标题",
    "goal": "真实检查输入，只接受非空字符串，返回成功或失败结果。",
    "starter": "type Result = { ok: true; value: string } | { ok: false; error: string };\nfunction parseTitle(input: unknown): Result {\n  return { ok: true, value: input.trim() };\n}\nconsole.log(parseTitle(\" 学习 \"));\nconsole.log(parseTitle(null));\n",
    "checks": "const good = parseTitle(\" JS \");\ncheck(good.ok && good.value === \"JS\", \"有效标题应去除两侧空白\");\nfor (const value of [null, 123, {}, \"\", \"  \"]) {\n  check(parseTitle(value).ok === false, \"必须拒绝无效标题：\" + String(value));\n}",
    "steps": [
      "先运行，看到 unknown 不能直接调用 trim。",
      "使用 typeof 检查是否为字符串，非字符串走失败结果。",
      "增加空白检查，再运行 null、123 和空格输入。",
      "用 if (result.ok) 分别打印成功标题和失败原因。"
    ],
    "concept": "unknown 迫使你先取得证据。typeof 的分支把类型缩小到 string，这叫收窄。ok 的固定 true / false 又让成功与失败携带不同字段。",
    "hint": "先排除 typeof input !== \"string\"，短路判断后才安全调用 trim。",
    "extension": "故意写 input as string，再传 null，观察断言为什么不能做运行时校验；之后恢复正确实现。",
    "lang": "ts",
    "file": "practice/10.ts",
    "lesson": "lessons/10-联合类型和收窄.md"
  },
  {
    "id": "11",
    "title": "让工具记住拿到的类型",
    "goal": "同一个 first 能处理数字和文字，并保留各自的类型。",
    "starter": "function first(items: any[]): any {\n  return items[0];\n}\nconst numberItem = first([10, 20]);\nconst textItem = first([\"JS\", \"TS\"]);\nconsole.log(numberItem, textItem, first([]));\n",
    "checks": "type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;\nconst numberTypeIsCorrect: Equal<typeof numberItem, number | undefined> = true;\nconst textTypeIsCorrect: Equal<typeof textItem, string | undefined> = true;\ncheck(numberTypeIsCorrect && textTypeIsCorrect, \"泛型要保留具体类型，并考虑 undefined\");\ncheck(first([3, 4]) === 3 && first([\"A\"]) === \"A\" && first([]) === undefined, \"返回第一项，空数组返回 undefined\");",
    "steps": [
      "先运行，再运行 --check：代码能执行，不代表类型信息被保留。",
      "把 any 改为泛型 T，输入数组元素和返回值使用同一个 T。",
      "给返回值加上 undefined，因为空数组没有首项。",
      "检查通过后，试 numberItem?.toFixed(1) 和 textItem?.toUpperCase()。"
    ],
    "concept": "泛型描述输入与输出之间的关系。数字数组对应数字，字符串数组对应字符串。第 11 关的检查还会验证类型，因此只让输出正确但保留 any 不能过关。检查内的高级类型只是验收工具，现在不用背。",
    "hint": "签名可读成：first<T>(items: readonly T[]): T | undefined。实现仍然只需要取 items[0]。",
    "extension": "写 findById<T extends { id: number }>，传入带 title 的对象后，确认返回值仍有 title 提示。",
    "lang": "ts",
    "file": "practice/11.ts",
    "lesson": "lessons/11-泛型.md"
  },
  {
    "id": "12",
    "title": "删除任务但保留上一份列表",
    "goal": "删除目标任务、处理不存在的 id，并证明原列表没被改。",
    "starter": "interface Task { id: number; title: string; done: boolean }\ntype Result = { ok: true; value: Task[] } | { ok: false; error: string };\nfunction removeTask(tasks: Task[], id: number): Result {\n  const index = tasks.findIndex(task => task.id === id);\n  tasks.splice(index, 1);\n  return { ok: true, value: tasks };\n}\nconst tasks: Task[] = [{id:1,title:\"学 JS\",done:false},{id:2,title:\"写 TS\",done:false}];\nconsole.log(\"删除结果：\", removeTask(tasks, 1));\nconsole.log(\"原列表：\", tasks);\n",
    "checks": "const original: Task[] = [{id:1,title:\"A\",done:false},{id:2,title:\"B\",done:true},{id:3,title:\"C\",done:false}];\nconst before = JSON.stringify(original);\nconst removed = removeTask(original, 2);\ncheck(JSON.stringify(original) === before, \"原数组被修改了；试试 filter 创建新数组\");\ncheck(removed.ok && JSON.stringify(removed.value.map(t => t.id)) === '[1,3]', \"删除后保留其他任务的顺序\");\ncheck(removeTask(original, 999).ok === false, \"不存在的 id 必须返回失败，不能误删最后一项\");\ncheck(removeTask([], 1).ok === false, \"空列表删除应失败\");",
    "steps": [
      "运行后比较删除结果与原列表，原列表怎么也变了？",
      "改用 filter 生成新数组，保留原列表。",
      "试不存在的 id：findIndex 返回 -1，splice(-1, 1) 会误删最后一项。",
      "增加存在性检查，再运行 --check。",
      "最后把功能接入 project/service.ts 和 main.ts，运行 npm run demo。"
    ],
    "concept": "splice 直接修改原数组；filter 创建新数组。Result 让不存在的 id 有明确失败路径。把数据操作与显示分开，就能单独检查不修改输入等业务约定。",
    "hint": "先用 some 判断是否存在，再返回 tasks.filter(task => task.id !== id)。",
    "extension": "把 tasks 参数改成 readonly Task[]，让编译器也阻止直接 splice；再增加“重命名任务”操作。",
    "lang": "ts",
    "file": "practice/12.ts",
    "lesson": "lessons/12-综合项目.md"
  }
];
