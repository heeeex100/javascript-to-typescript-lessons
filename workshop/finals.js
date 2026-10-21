// 每关最后的综合题。旧 practice 文件仍保留，综合题使用独立 finals 目录。
for (const [id, assignment] of Object.entries({
  "00": {
    "title": "综合大练习：做一张完整学习卡",
    "goal": "把名字、学习主题和计划时长组织成一张会随数据变化的学习卡。",
    "requirements": [
      "创建 learner、topic、minutes，名字和主题填写你自己的内容，minutes 为大于 0 的数字。",
      "message 同时包含这三个值，使用变量组装，改动主题或时长后应跟着变化。",
      "打印完整学习卡。"
    ],
    "starter": "const learner = \"\";\nconst topic = \"\";\nconst minutes = 0;\n// TODO：用上面三个值组成一句学习计划。\nconst message = \"\";\nconsole.log(message);\n",
    "checks": "check(typeof learner === \"string\" && learner.trim().length > 0,\"请填写自己的名字\");\ncheck(typeof topic === \"string\" && topic.trim().length > 0,\"请填写学习主题\");\ncheck(typeof minutes === \"number\" && minutes > 0,\"时长应是大于 0 的数字\");\ncheck(message.includes(learner) && message.includes(topic) && message.includes(String(minutes)),\"学习卡需要同时包含名字、主题和时长\");",
    "file": "practice/finals/00.js",
    "answerFile": "answers/finals/00.js",
    "examples": "名字“小林”、主题“JavaScript”、15 分钟 → 输出同时出现这三项。再换成自己的名字和 30 分钟。",
    "steps": [
      "分别填写名字、主题和数字时长。",
      "用模板字符串或拼接把三个值组织成 message。",
      "打印后分别换名字和时长，检查是否一起更新。"
    ],
    "hint": "分别填写名字、主题和数字时长。"
  },
  "01": {
    "title": "综合大练习：做学习时长计算面板",
    "goal": "处理文字输入、额外奖励分钟，并显示计算结果是否可用。",
    "requirements": [
      "保留 input 为文字，把它转换为数字 numeric。",
      "total 为转换后的数字加 bonus，不进行文字拼接。",
      "valid 是布尔值，表示 total 是不是有限数字；输入 abc 时应为 false。",
      "打印输入、转换值、总时长和 valid。"
    ],
    "starter": "const input = \"20\";\nconst bonus = 5;\n// TODO：补全转换、加法和有效数字判断。\nconst numeric = input;\nconst total = input + bonus;\nconst valid = true;\nconsole.log(numeric, total, valid);\n",
    "checks": "check(typeof numeric === \"number\" && Object.is(numeric,Number(input)),\"numeric 应是 input 转换得到的数字\");\ncheck(Object.is(total,Number(input)+bonus),\"总时长要做数字相加\");\ncheck(valid === Number.isFinite(total),\"valid 要反映实际结果是否为有限数字\");",
    "file": "practice/finals/01.js",
    "answerFile": "answers/finals/01.js",
    "examples": "input=\"20\"、bonus=5 → 20、25、true；input=\"abc\" → NaN、NaN、false。空文本会转为 0，空文本的业务校验留到后续练习。",
    "steps": [
      "保留原始 input，先得到 numeric。",
      "用 numeric 加 bonus，得到 total。",
      "用 Number.isFinite(total) 计算 valid。"
    ],
    "hint": "保留原始 input，先得到 numeric。"
  },
  "02": {
    "title": "综合大练习：专注记录统计器",
    "goal": "自己组合循环、条件和累加，统计总时长、达标次数、未达标次数和平均时长。",
    "requirements": [
      "遍历 sessions，minutes 大于或等于 minimum 才算达标。",
      "total 只累计达标记录；count 是达标次数，skipped 是未达标次数。",
      "average 是达标记录平均时长；没有达标记录时为 0。",
      "不要修改 sessions；最后打印四个统计值。",
      "换成空数组、全不达标、刚好等于 minimum 的数据，规则仍成立。"
    ],
    "starter": "const sessions = [10, 25, 40, 15];\nconst minimum = 25;\nlet total = 0;\nlet count = 0;\nlet skipped = 0;\nlet average = 0;\n// TODO：独立完成统计。可以用长写法 total = total + minutes。\nconsole.log({ total, count, skipped, average });\n",
    "checks": "const expected = sessions.filter(value=>value>=minimum);\ncheck(total === expected.reduce((sum,value)=>sum+value,0),\"total 只加达标分钟数\");\ncheck(count === expected.length,\"count 统计达标次数，包括刚好等于 minimum\");\ncheck(skipped === sessions.length-expected.length,\"skipped 统计未达标次数\");\ncheck(average === (count === 0 ? 0 : total/count),\"平均数是达标总时长除以达标次数；没有达标记录时为 0\");",
    "file": "practice/finals/02.js",
    "answerFile": "answers/finals/02.js",
    "examples": "[10,25,40,15]、门槛 25 → total=65、count=2、skipped=2、average=32.5；[] → 四项全为 0；[25,25] → 50、2、0、25。",
    "steps": [
      "先用循环读取每条分钟记录。",
      "在 if/else 中分别更新达标统计和未达标统计。",
      "循环结束后，只在 count 大于 0 时计算 average。",
      "分别替换 sessions 试空数组和刚好达标。"
    ],
    "hint": "先用循环读取每条分钟记录。",
    "extension": "再统计最长的一条达标记录；没有达标记录时显示 0。"
  },
  "03": {
    "title": "综合大练习：可复用的咖啡结账工具",
    "goal": "通过参数接收订单，计算优惠后的实付金额，并把结果交回调用方。",
    "requirements": [
      "实现 checkout(quantity, unitPrice=12, coupon=0)，返回数字。",
      "先计算数量乘单价，再减优惠券，实付不能小于 0。",
      "未传单价与优惠券时使用默认值；数量为 0 时结果为 0。",
      "调用函数计算至少两笔订单，调用方拿到结果后才能打印或继续计算。"
    ],
    "starter": "function checkout(quantity, unitPrice = 12, coupon = 0) {\n  // TODO：计算并返回实付，最小为 0。\n}\nconsole.log(checkout(2));\nconsole.log(checkout(3, 10, 5));\n",
    "checks": "check(checkout(2)===24,\"默认 2 杯应返回 24，不只是打印\");check(checkout(3,10,5)===25,\"数量、单价、优惠都要参与计算\");check(checkout(1,5,10)===0 && checkout(0)===0,\"实付不能小于 0\");",
    "file": "practice/finals/03.js",
    "answerFile": "answers/finals/03.js",
    "examples": "checkout(2) → 24；checkout(3,10,5) → 25；checkout(1,5,10) → 0。输入均按有效的非负数字提供。",
    "steps": [
      "先计算 quantity * unitPrice。",
      "减优惠券后保证结果不小于 0。",
      "通过 return 交给调用方，换不同参数验证。"
    ],
    "hint": "先计算 quantity * unitPrice。",
    "extension": "增加一个会员折扣参数，在优惠券之前计算折扣，并验证组合规则。"
  },
  "04": {
    "title": "综合大练习：生成任务列表摘要",
    "goal": "把数组筛选、标题转换和数量统计组合成一个可复用的数据处理函数。",
    "requirements": [
      "实现 taskSummary(tasks)，返回 {pendingTitles, doneCount, totalCount}。",
      "pendingTitles 只含未完成任务的标题，顺序与原列表一致。",
      "doneCount 是完成数量，totalCount 是总数量；空数组返回空标题和两个 0。",
      "不得修改传入数组或任务对象。"
    ],
    "starter": "function taskSummary(tasks) {\n  // TODO：生成摘要。\n  return { pendingTitles: [], doneCount: 0, totalCount: 0 };\n}\nconsole.log(taskSummary([{title:\"读 JS\",done:false},{title:\"喝水\",done:true}]));\n",
    "checks": "const source=Object.freeze([Object.freeze({title:\"A\",done:false}),Object.freeze({title:\"B\",done:true}),Object.freeze({title:\"C\",done:false})]);\nconst result=taskSummary(source);check(JSON.stringify(result.pendingTitles)==='[\"A\",\"C\"]',\"标题只来自未完成任务，保留顺序\");check(result.doneCount===1 && result.totalCount===3,\"同时统计完成数与总数\");const empty=taskSummary([]);check(empty.pendingTitles.length===0 && empty.doneCount===0 && empty.totalCount===0,\"处理空列表\");check(source[0].done===false,\"保留原数据\");",
    "file": "practice/finals/04.js",
    "answerFile": "answers/finals/04.js",
    "examples": "A 未完成、B 完成、C 未完成 → pendingTitles=[\"A\",\"C\"]、doneCount=1、totalCount=3。",
    "steps": [
      "先筛出未完成对象，再转换为标题数组。",
      "分别数出已完成数量和总数量。",
      "把三份结果放进一个对象返回，不修改输入。"
    ],
    "hint": "先筛出未完成对象，再转换为标题数组。"
  },
  "05": {
    "title": "综合大练习：可靠的任务存档工具",
    "goal": "完成保存和读取两个方向，让损坏存档也有明确的回退结果。",
    "requirements": [
      "saveTasks(tasks) 返回 JSON 字符串。",
      "loadTasks(text) 解析合法数组，坏文本或解析后不是数组时返回 []。",
      "一次保存再读取，应保留任务内容；这关只验证外层数组，字段校验留到第 17 关。",
      "原任务数组不被修改。"
    ],
    "starter": "function saveTasks(tasks) { return \"\"; }\nfunction loadTasks(text) {\n  // TODO：解析、接住格式错误，并检查外层是否数组。\n  return [];\n}\nconsole.log(loadTasks(saveTasks([{title:\"学习\",done:false}])));\n",
    "checks": "const source=[{title:\"A\",done:false}];const saved=saveTasks(source);check(typeof saved===\"string\" && JSON.stringify(loadTasks(saved))===JSON.stringify(source),\"保存再读取应保留数据\");for(const text of [\"oops\",\"null\",\"123\",\"{}\"]){check(JSON.stringify(loadTasks(text))===\"[]\",\"坏文本或非数组回退为空数组：\"+text);}check(loadTasks(\"[]\").length===0,\"合法空数组不报错\");",
    "file": "practice/finals/05.js",
    "answerFile": "answers/finals/05.js",
    "examples": "保存 [{title:\"学习\",done:false}] 再读取，应还原该数组；oops、null、123、{} 都返回 []。",
    "steps": [
      "保存时使用 JSON.stringify。",
      "读取时先 try/catch 处理解析失败。",
      "解析成功后再检查外层是不是数组。"
    ],
    "hint": "保存时使用 JSON.stringify。"
  },
  "06": {
    "title": "综合大练习：带成功与失败反馈的加载器",
    "goal": "调用传入的异步加载工具，等结果后生成摘要，失败时返回可显示的错误状态。",
    "requirements": [
      "实现 async loadTaskReport(loader)，在内部调用 loader 并等待结果。",
      "成功且结果为数组时返回 {status:\"success\",items,count}，空数组同样成功。",
      "同步抛错、Promise 拒绝或非数组结果，均返回 {status:\"error\",message:\"加载失败\"}。",
      "不要把未处理的失败继续抛给调用方。"
    ],
    "starter": "async function loadTaskReport(loader) {\n  // TODO：调用、等待、校验与失败反馈。\n  return { status: \"error\", message: \"加载失败\" };\n}\nconsole.log(await loadTaskReport(async()=>[\"写代码\",\"喝水\"]));\n",
    "checks": "const result=await loadTaskReport(async()=>[\"A\",\"B\"]);check(result.status===\"success\" && result.count===2 && result.items[1]===\"B\",\"真正等到数组，再生成成功摘要\");const empty=await loadTaskReport(async()=>[]);check(empty.status===\"success\" && empty.count===0,\"空数组是成功\");for(const loader of [()=>{throw new Error(\"错\")},async()=>{throw new Error(\"离线\")},async()=>null]){const bad=await loadTaskReport(loader);check(bad.status===\"error\" && bad.message===\"加载失败\",\"所有失败路径返回明确错误状态\");}",
    "file": "practice/finals/06.js",
    "answerFile": "answers/finals/06.js",
    "examples": "loader 成功给 [A,B] → success、count=2；给 [] → success、count=0；抛错或给 null → error、message=加载失败。",
    "steps": [
      "用 try 包住 loader() 的调用和 await。",
      "得到数组后计算 count，返回成功结构。",
      "非数组结果或抛错时返回统一失败结构。"
    ],
    "hint": "用 try 包住 loader() 的调用和 await。"
  },
  "08": {
    "title": "综合大练习：有类型约束的分钟输入工具",
    "goal": "将文字校验和数字计算接到 TS 参数约定上，返回真实数字。",
    "requirements": [
      "实现 planMinutes(text:string, bonus:number):number，不使用 any 或断言绕过检查。",
      "text 必须是非空、可转成有限非负数字的文字。bonus 为有限非负数字。",
      "合法时返回转换后的分钟数加 bonus；非法输入抛出 Error。"
    ],
    "starter": "function planMinutes(text: string, bonus: number): number {\n  // TODO：验证输入，返回数字结果。\n  return 0;\n}\nconsole.log(planMinutes(\"20\",5));\n",
    "checks": "check(planMinutes(\"20\",5)===25 && planMinutes(\"0\",0)===0 && planMinutes(\" 3 \",2)===5,\"返回真实计算结果\");for(const [text,bonus] of [[\"\",1],[\"abc\",1],[\"-1\",0],[\"2\",-1],[\"2\",Infinity]] as const){let rejected=false;try{planMinutes(text,bonus);}catch{rejected=true;}check(rejected,\"非法输入应抛错\");}",
    "file": "practice/finals/08.ts",
    "answerFile": "answers/finals/08.ts",
    "examples": "(\"20\",5) → 25；(\"0\",0) → 0；空文本、abc、负数分钟或负数奖励 → 抛错。",
    "steps": [
      "先检查空文本和 Number(text) 的结果。",
      "验证数字范围与 bonus。",
      "合法时返回实际加法结果，不修改函数类型来躲过错误。"
    ],
    "hint": "先检查空文本和 Number(text) 的结果。"
  },
  "09": {
    "title": "综合大练习：格式化完整任务卡",
    "goal": "使用接口、可选备注和默认文字，把输入对象转换成适合页面显示的一句话。",
    "requirements": [
      "Task 具有 readonly id:number、title:string、note?:string。",
      "formatTask(task) 返回“id · 标题：备注”；标题和备注去掉两侧空格。",
      "缺失或纯空白备注显示“无备注”，不能改变传入对象。"
    ],
    "starter": "interface Task { readonly id: number; title: string; note?: string }\nfunction formatTask(task: Task): string {\n  // TODO：规范化文字，拼完整任务卡。\n  return \"\";\n}\nconsole.log(formatTask({id:1,title:\" 写练习 \"}));\n",
    "checks": "check(formatTask({id:1,title:\" 写练习 \"})===\"1 · 写练习：无备注\",\"缺失备注时使用默认值，并去标题空格\");check(formatTask({id:2,title:\"A\",note:\"  \"})===\"2 · A：无备注\",\"空白备注也回退\");const source=Object.freeze({id:3,title:\" A \",note:\" 重点 \"});check(formatTask(source)===\"3 · A：重点\" && source.note===\" 重点 \",\"规范化展示，不改原对象\");",
    "file": "practice/finals/09.ts",
    "answerFile": "answers/finals/09.ts",
    "examples": "{id:1,title:\" 写练习 \"} → \"1 · 写练习：无备注\"；note=\" 重点 \" → 显示“重点”。",
    "steps": [
      "读取并清理可选 note，缺失与空白用默认值。",
      "清理标题，把 id、标题、备注组成展示文字。",
      "输入对象只读取，不直接改字段。"
    ],
    "hint": "读取并清理可选 note，缺失与空白用默认值。",
    "extension": "增加可选的 dueDate 字段，在任务卡中显示日期或“未设置日期”。"
  },
  "10": {
    "title": "综合大练习：标题输入与结果展示",
    "goal": "将未知输入校验、成功/失败结构和调用方展示连成完整流程。",
    "requirements": [
      "parseTitle(input:unknown) 只接受去空格后非空的字符串，成功返回 {ok:true,value}。",
      "非法输入返回 {ok:false,error:string}，错误原因非空。",
      "describe(result) 先按 ok 区分结果：成功返回“已接收：标题”，失败返回“失败：原因”。"
    ],
    "starter": "type Result = {ok:true;value:string}|{ok:false;error:string};\nfunction parseTitle(input: unknown): Result {\n  return {ok:false,error:\"尚未完成\"};\n}\nfunction describe(result: Result): string { return \"\"; }\nconsole.log(describe(parseTitle(\" 学习 \")));\n",
    "checks": "const good=parseTitle(\" A \");check(good.ok && good.value===\"A\",\"有效标题去两侧空格\");check(describe(good)===\"已接收：A\",\"成功结果要显示标题\");for(const input of [null,2,{},\"\",\"  \"]){const bad=parseTitle(input);check(!bad.ok && bad.error.trim().length>0,\"拒绝非字符串和空白，给出原因\");if(!bad.ok)check(describe(bad)===`失败：${bad.error}`,\"失败结果显示其原因\");}",
    "file": "practice/finals/10.ts",
    "answerFile": "answers/finals/10.ts",
    "examples": "\" 学习 \" → {ok:true,value:\"学习\"} → \"已接收：学习\"；null → 失败结构 → \"失败：具体原因\"。",
    "steps": [
      "先用运行时判断确认输入是非空字符串。",
      "按成功或失败返回对应的结果结构。",
      "describe 中先看 ok，再读取相应字段。"
    ],
    "hint": "先用运行时判断确认输入是非空字符串。",
    "extension": "增加标题长度上限，超过 20 字时返回清楚的失败原因。"
  },
  "11": {
    "title": "综合大练习：保留输入类型的查找工具箱",
    "goal": "完成两个泛型工具，既处理缺失结果，也把对象的具体类型交回调用方。",
    "requirements": [
      "first<T>(items:readonly T[]):T|undefined 返回第一项；空列表返回 undefined。",
      "findById<T extends {id:number}>(items:readonly T[],id:number):T|undefined 按 id 查找。",
      "不修改输入，返回值保留原元素的具体类型与字段；找不到时返回 undefined。"
    ],
    "starter": "function first<T>(items: readonly T[]): T | undefined { return undefined; }\nfunction findById<T extends {id:number}>(items: readonly T[], id: number): T | undefined { return undefined; }\nconsole.log(first([\"JS\",\"TS\"]));\n",
    "checks": "check(first([3,4])===3 && first<string>([])===undefined,\"第一项和空列表都要处理\");const tasks=Object.freeze([Object.freeze({id:1,title:\"A\"}),Object.freeze({id:2,title:\"B\"})]);const task=findById(tasks,2);check(task?.title===\"B\" && findById(tasks,99)===undefined,\"按 id 查找并保留 title 字段类型\");const user=findById([{id:4,name:\"小林\"}],4);const name:string|undefined=user?.name;check(name===\"小林\",\"同一个泛型工具支持另一种对象\");",
    "file": "practice/finals/11.ts",
    "answerFile": "answers/finals/11.ts",
    "examples": "first([3,4]) → 3；first([]) → undefined；查任务得到带 title 的任务，查用户得到带 name 的用户。",
    "steps": [
      "first 直接取第一项，承认空列表可能没有值。",
      "findById 按 id 判断，不改变元素类型。",
      "用任务和用户两种对象检查字段类型是否保留。"
    ],
    "hint": "first 直接取第一项，承认空列表可能没有值。"
  },
  "12": {
    "title": "综合大练习：支持删除和重命名的任务服务",
    "goal": "组合不可变更新、输入校验和成功/失败结果，保留修改前的任务列表。",
    "requirements": [
      "removeTask(tasks,id) 删除目标，renameTask(tasks,id,title) 重命名目标；都返回 Result<Task[]>。",
      "id 不存在时返回失败，不得误删最后一项。",
      "新标题去掉两侧空格，空白标题返回失败。",
      "成功返回新数组，不修改原数组或旧任务对象。"
    ],
    "starter": "interface Task {id:number;title:string;done:boolean}\ntype Result<T>={ok:true;value:T}|{ok:false;error:string};\nfunction removeTask(tasks: readonly Task[],id: number): Result<Task[]> { return {ok:false,error:\"尚未完成\"}; }\nfunction renameTask(tasks: readonly Task[],id: number,title:string): Result<Task[]> { return {ok:false,error:\"尚未完成\"}; }\n",
    "checks": "const source=Object.freeze([Object.freeze({id:1,title:\"A\",done:false}),Object.freeze({id:2,title:\"B\",done:true})]);const removed=removeTask(source,1);check(removed.ok && removed.value.length===1 && removed.value[0]?.id===2,\"正常删除目标\");check(!removeTask(source,99).ok,\"找不到应失败\");const renamed=renameTask(source,1,\" 新标题 \");check(renamed.ok && renamed.value[0]?.title===\"新标题\",\"重命名需要去空格\");check(!renameTask(source,1,\"  \").ok && !renameTask(source,99,\"C\").ok,\"拒绝空白标题与不存在的任务\");check(source.length===2 && source[0]?.title===\"A\",\"保留旧列表和旧对象\");",
    "file": "practice/finals/12.ts",
    "answerFile": "answers/finals/12.ts",
    "examples": "删除 id=1 → 只剩 id=2；重命名 id=1 为“ 新标题 ” → 新列表标题为“新标题”，旧列表仍为 A；不存在 id → 失败。",
    "steps": [
      "先确认目标存在，处理失败分支。",
      "删除用 filter；重命名用 map 和新对象。",
      "用冻结输入或打印前后数据证明旧数据没变。"
    ],
    "hint": "先确认目标存在，处理失败分支。",
    "extension": "增加 completeAll 操作，返回所有任务已完成的新列表，旧列表不变。"
  },
  "07": {
    "title": "综合大练习：可添加、完成、删除的任务面板",
    "goal": "将任务数据、点击事件和重新渲染组合成可操作的页面。",
    "requirements": [
      "输入非空标题可添加任务，空白输入给出提示。",
      "点击完成后更新该项 done；点击删除后移除该项。",
      "每次增、改、删后重新显示未完成数量；完成任务不计入剩余数量。",
      "用户输入用 textContent 显示；页面刷新恢复初始状态，不要求持久化。"
    ],
    "starter": "// 本关编辑 practice/finals/07-dom/app.js，保存后在浏览器刷新。\n",
    "file": "practice/finals/07-dom/app.js",
    "answerFile": "answers/finals/07-dom/app.js",
    "page": "practice/finals/07-dom/index.html",
    "answerPage": "answers/finals/07-dom/index.html",
    "checks": "",
    "examples": "初始剩余 1 → 添加后 2 → 完成一项后 1 → 删除另一项后 0；空白输入不增加任务。",
    "steps": [
      "完成提交回调里的新增任务。",
      "完成每项按钮回调里的完成和删除。",
      "render 中按最新数据重新计算未完成数量。"
    ],
    "hint": "完成提交回调里的新增任务。",
    "extension": "增加一个“全部完成”按钮，点击后所有任务完成且剩余数量变为 0。"
  }
})) {
  const lab = globalThis.learningLabs.find(item => item.id === id);
  if (lab) Object.assign(lab, { legacyStarter: lab.starter }, assignment, { isFinal: true });
}
// 补全基础链后的综合题使用新文件，保留旧版本练习与学习者修改。
for (const [id, assignment] of Object.entries({
  "03": {
    "title": "综合大练习：会记订单数的结账工具",
    "goal": "组合默认参数、回调和独立状态，创建可复用的结账工具。",
    "requirements": [
      "实现 createCheckout(unitPrice = 12, adjust = amount => amount)，返回一个接收 quantity 的结账函数。",
      "每次结账先计算数量 × 单价，再调用 adjust 一次调整金额，实付小于 0 时按 0。输入数量、单价及调整后的金额均为有效数字。",
      "返回 {total, orders}；orders 为这个工具已结账的次数，从 1 开始。0 件订单也计一次。",
      "创建两个工具后订单数互不影响；创建工具时不能先调用 adjust。"
    ],
    "starter": "function createCheckout(unitPrice = 12, adjust = amount => amount) {\n  // TODO：创建独立的订单数，返回真正的结账函数。\n}\n// TODO：创建默认工具，再创建一个每单减 3 元的工具；分别结账并打印。\n",
    "file": "practice/finals/03-checkout.js",
    "answerFile": "answers/finals/03-checkout.js",
    "checks": "const a=createCheckout();check(typeof a===\"function\",\"工厂应交回函数，创建时还没下单\");let calls=0;const b=createCheckout(10, amount=>{calls+=1;return amount-3;});check(calls===0,\"规则在结账时调用，不是在创建时调用\");const a1=a(2),b1=b(3),a2=a(0),b2=b(1);check(a1.total===24 && a1.orders===1 && a2.total===0 && a2.orders===2,\"默认价格与同一工具的累计订单数\");check(b1.total===27 && b1.orders===1 && b2.total===7 && b2.orders===2 && calls===2,\"每笔调用一次规则，两个工具独立计数\");check(createCheckout(5,amount=>amount-10)(1).total===0,\"实付最小为 0\");",
    "examples": "默认工具连续买 2 件、0 件 → {total:24,orders:1}、{total:0,orders:2}；单价 10、每单减 3 的另一个工具买 3 件 → {total:27,orders:1}。",
    "steps": [
      "工厂内部声明订单数，这时先不结账。",
      "返回一个接收 quantity 的函数，在内部计算原价并调用 adjust。",
      "限制最低金额、增加次数并返回对象；交错调用两个工具验证独立性。"
    ],
    "hint": "对照小题 03-05 的 apply 和 03-09 的独立计数，先写普通函数也可以。",
    "concept": "返回函数让结账动作延后发生；闭包保存每个工具的订单数；回调让计算规则由调用者选择。",
    "extension": "增加一个会员折扣规则，先打折再减券；保持原结账工具的订单数不受影响。"
  },
  "04": {
    "title": "综合大练习：保留原列表的任务编辑器",
    "goal": "组合对象复制、按编号更新与列表摘要，保留编辑前的数据。",
    "requirements": [
      "实现 renameTasks(tasks,id,title)，返回新数组，只给匹配编号创建新对象并改标题。",
      "未匹配的对象保留；编号不存在或列表为空时也返回新数组，不修改输入。",
      "实现 taskSummary(tasks)，返回 {pendingTitles,doneCount,totalCount}；空数组返回空标题与两个 0。",
      "对重命名后的列表生成摘要，并验证旧列表和旧对象仍保留原来的标题。"
    ],
    "starter": "function renameTasks(tasks, id, title) {\n  // TODO：根据编号更新，保留旧数组与对象。\n  return tasks;\n}\nfunction taskSummary(tasks) {\n  // TODO：筛选未完成标题，统计完成与总数量。\n  return { pendingTitles: [], doneCount: 0, totalCount: 0 };\n}\nconst before = [{id:1,title:\"读 JS\",done:false},{id:2,title:\"喝水\",done:true}];\n// TODO：改第一项标题，生成新列表摘要，分别打印新旧列表。\n",
    "file": "practice/finals/04-editor.js",
    "answerFile": "answers/finals/04-editor.js",
    "checks": "const source=Object.freeze([Object.freeze({id:1,title:\"A\",done:false}),Object.freeze({id:2,title:\"B\",done:true})]);const out=renameTasks(source,1,\"C\");check(out!==source && out[0]!==source[0] && out[0].title===\"C\" && out[0].id===1 && out[0].done===false && out[1]===source[1],\"只替换匹配对象，同时保留其他字段与未修改对象\");const missing=renameTasks(source,99,\"D\");check(missing!==source && missing[0]===source[0] && missing[1]===source[1],\"找不到时保留所有项，仍交回新数组\");const emptyInput=[];const emptyOut=renameTasks(emptyInput,1,\"C\");check(emptyOut!==emptyInput && emptyOut.length===0,\"空列表也交回新数组\");const report=taskSummary(out);check(JSON.stringify(report.pendingTitles)==='[\"C\"]' && report.doneCount===1 && report.totalCount===2,\"摘要应来自编辑后的数据\");const empty=taskSummary([]);check(empty.pendingTitles.length===0 && empty.doneCount===0 && empty.totalCount===0,\"空摘要\");check(source[0].title===\"A\",\"旧对象保持不变\");",
    "examples": "A 未完成、B 完成 → 将 A 改名为 C → 新摘要 pendingTitles=[\"C\"]、doneCount=1、totalCount=2；旧列表仍为 A、B。",
    "steps": [
      "map 遍历任务，匹配时返回带新标题的新对象，其余返回旧对象。",
      "单独编写 taskSummary，用 filter/map 或循环完成摘要。",
      "先重命名再生成摘要；打印旧列表证明没有连带修改。"
    ],
    "hint": "数组与任务卡片是两层，不能只生成新数组却修改旧任务对象。",
    "concept": "map 生成新数组；对象展开生成被编辑的新卡片。摘要只是读取结果，不应修改数据。",
    "extension": "给任务增加 meta.minutes，编写增加一分钟的操作，继续保留原对象与原 meta。"
  },
  "05": {
    "title": "综合大练习：跨文件的任务存档工具",
    "goal": "把保存、读取和调用拆到不同文件，让损坏存档也有清楚的回退结果。",
    "local": true,
    "requirements": [
      "编辑 practice/finals/05-storage/storage.js，具名导出 saveTasks 和 loadTasks；main.js 导入并调用。",
      "saveTasks(tasks) 返回 JSON 字符串；loadTasks(text) 对合法数组还原，坏文本或非数组返回 []。",
      "保存后读取应保留任务内容，原数组不被修改；字段校验留到第 17 关。",
      "在 main.js 依次打印正常存档、oops、null、{} 的读取结果，再用断点观察一次失败路径。"
    ],
    "starter": "import { saveTasks, loadTasks } from \"./storage.js\";\nconst tasks = [{ title: \"学习\", done: false }];\nconsole.log(loadTasks(saveTasks(tasks)));\n// TODO：再调用 loadTasks 观察坏文本、null 和对象文本。\n",
    "file": "practice/finals/05-storage/main.js",
    "files": {
      "storage.js": "export function saveTasks(tasks) {\n  // TODO：返回 JSON 文本。\n  return \"\";\n}\nexport function loadTasks(text) {\n  // TODO：处理解析失败与合法的非数组。\n  return [];\n}\n"
    },
    "answerFile": "answers/finals/05-storage/main.js",
    "supportAnswers": {
      "storage.js": "answers/finals/05-storage/storage.js"
    },
    "checks": "const source=[{title:\"A\",done:false}];const before=JSON.stringify(source);const saved=saveTasks(source);check(typeof saved===\"string\" && JSON.stringify(loadTasks(saved))===before,\"保存再读取应保留数据\");for(const text of [\"oops\",\"null\",\"123\",\"{}\"]){check(JSON.stringify(loadTasks(text))===\"[]\",\"坏文本或非数组回退为空数组：\"+text);}check(loadTasks(\"[]\").length===0 && JSON.stringify(source)===before,\"合法空数组与原数据保护\");",
    "examples": "正常任务数组 → 保存成文本 → 读取还原；oops、null、123、{} → []。自动检查验证数据结果，断点观察由你完成。",
    "steps": [
      "先在 storage.js 实现并导出两个工具，让 main.js 能导入。",
      "读取时先处理 JSON 格式错误，再检查外层数组。",
      "分别运行正常与异常输入，用断点看分支后再执行 --check。"
    ],
    "hint": "先确认两个文件之间名称、路径正确，再排查解析与结构检查；编辑 storage.js，运行 main.js。",
    "concept": "模块分开职责；JSON 在文字与数据间转换；异常与非数组是不同的失败路径。",
    "extension": "在读取失败时加入原因日志，区分文本损坏和内容不是数组，再用断点验证。"
  }
})) {
  const lab = globalThis.learningLabs.find(item => item.id === id);
  Object.assign(lab, assignment);
}
for (const lab of globalThis.learningLabs) lab.isFinal = true;

// 课程标题描述这一章学什么，综合题另有自己的任务名称。
const chapterNames = [
  ["认识 JavaScript：写出第一段程序", "认识 JavaScript", "从保存文字和输出结果开始，认识变量和最简单的程序。"],
  ["变量与类型：分清文字和数字", "变量与类型", "观察文字与数字的差别，练习转换、计算和有效数字判断。"],
  ["条件与循环：让程序判断和重复", "条件与循环", "从一次加法开始，学会条件判断、重复执行和累计统计。"],
  ["函数与作用域：组合工具并保留状态", "函数与作用域", "从参数与返回值开始，练习回调、作用域和各自独立的计数状态。"],
  ["数组与对象：整理一组任务", "数组与对象", "从读取一项数据开始，练习筛选、转换和统计一组数据。"],
  ["模块与调试：拆开程序并定位错误", "模块、JSON 与调试", "练习跨文件复用、JSON 存档和错误定位，用断点观察执行过程。"],
  ["异步编程：等待结果并处理失败", "异步编程", "看清异步执行顺序，练习等待真实结果并为失败准备反馈。"],
  ["DOM 与事件：让数据改变页面", "DOM 与事件", "把文字、任务数据和点击事件接起来，观察页面怎样更新。"],
  ["TypeScript 入门：用类型检查发现错误", "TypeScript 入门", "了解类型注解与真实数据的区别，用编译器检查输入输出约定。"],
  ["接口与可选属性：描述任务数据", "接口与可选属性", "描述对象应有哪些字段，并处理缺失备注与默认值。"],
  ["联合类型与收窄：先判断再使用", "联合类型与收窄", "逐步检查未知输入，区分成功与失败结果，再安全读取字段。"],
  ["泛型：保留输入与输出的类型关系", "泛型", "让同一个工具处理多种数据，同时保留每次调用的具体类型。"],
  ["任务管理实战：组合数据操作与类型", "任务管理实战", "把校验、结果类型和不可变更新组合成任务管理功能。"],
  ["数据查询：组合筛选、排序和分页", "筛选、排序与分页", "分步处理查询条件、结果顺序和分页，保留原始数据。"],
  ["闭包与历史：实现撤销和重做", "闭包与撤销重做", "让函数保留自己的状态，再组织过去、现在与可重做的版本。"],
  ["请求竞态：让最新搜索结果生效", "异步请求与竞态", "区分请求发起顺序与完成顺序，避免旧响应覆盖新结果。"],
  ["并发控制：安排异步任务", "并发控制", "推迟任务启动、限制同时运行的数量，并按输入顺序保存结果。"],
  ["运行时校验：检查外部输入", "运行时校验", "按层检查外部数据，为错误字段提供清楚的位置和原因。"],
  ["类型安全事件：连接消息与数据", "类型安全事件", "练习事件名、消息数据和取消订阅之间的约定。"],
];
for (const lab of globalThis.learningLabs) {
  const [title, navTitle, learningGoal] = chapterNames[Number(lab.id)];
  lab.finalTitle = lab.title.replace(/^综合大练习：/, "");
  Object.assign(lab, { title, navTitle, learningGoal });
}
