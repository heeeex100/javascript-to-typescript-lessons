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
for (const lab of globalThis.learningLabs) lab.isFinal = true;
