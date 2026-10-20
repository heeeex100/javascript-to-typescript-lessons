globalThis.learningLabs.push(...[
  {
    "id": "13",
    "title": "做一个能搜索、排序、翻页的任务列表",
    "goal": "搜索 JS，只看未完成任务，按优先级排列，再取指定页；原列表不变。",
    "starter": "function queryTasks(tasks, options) {\n  // TODO：搜索、状态筛选、排序、分页；不要修改 tasks。\n  return { total: tasks.length, items: tasks.slice(0, options.pageSize) };\n}\nconst tasks = [\n  { id: 1, title: \"JS 数组\", done: false, priority: 2 },\n  { id: 2, title: \"js 异步\", done: false, priority: 3 },\n  { id: 3, title: \"TS 泛型\", done: true, priority: 1 },\n];\nconsole.log(queryTasks(tasks, { keyword: \"js\", status: \"pending\", page: 1, pageSize: 1 }));\n",
    "checks": "const input = Object.freeze([\n  Object.freeze({id:4,title:\"JS 四\",done:false,priority:2}),\n  Object.freeze({id:2,title:\"js 二\",done:false,priority:3}),\n  Object.freeze({id:1,title:\"JS 一\",done:false,priority:3}),\n  Object.freeze({id:3,title:\"JS 完成\",done:true,priority:5}),\n  Object.freeze({id:5,title:\"TS\",done:false,priority:9}),\n]);\nconst options = {keyword:\" JS \",status:\"pending\",page:1,pageSize:2};\nconst page1 = queryTasks(input, options);\ncheck(page1.total === 3, \"total 是筛选后、分页前的数量，应为 3\");\ncheck(JSON.stringify(page1.items.map(t => t.id)) === '[1,2]', \"优先级降序，相同优先级按 id 升序\");\ncheck(JSON.stringify(queryTasks(input,{...options,page:2}).items.map(t=>t.id)) === '[4]', \"第二页应只包含 id 4\");\nconst beyond = queryTasks(input,{...options,page:99});\ncheck(beyond.total === 3 && beyond.items.length === 0, \"越界页是空页，但 total 保留\");\ncheck(queryTasks(input,{...options,status:\"done\"}).items[0].id === 3, \"done 筛选没有生效\");\ncheck(queryTasks([],options).total === 0, \"空列表应返回 total 0\");\ncheck(queryTasks(input,{...options,keyword:\"\",status:\"all\",pageSize:10}).total === 5, \"空关键词匹配全部\");\nfor (const bad of [{page:0},{page:1.5},{pageSize:0},{pageSize:Infinity},{status:\"oops\"}]) {\n  let rejected=false; try { queryTasks(input,{...options,...bad}); } catch { rejected=true; }\n  check(rejected, \"必须拒绝非法分页/状态：\" + JSON.stringify(bad));\n}\ncheck(input[0].id === 4 && input.length === 5, \"不允许改变原数组顺序\");",
    "steps": [
      "先运行：搜索 js、每页 1 项，为什么第一项不是优先级更高的任务？",
      "先只做搜索和状态筛选，打印中间列表。",
      "加入排序，再分页；用 page 2、page 99 试边界。",
      "跑检查，最后确认原数组顺序没有改变。"
    ],
    "concept": "这是一个数据查询管道：把小步骤组合成业务行为。分页不该影响总数；排序要有明确的同分规则；不可变更新使原数据能继续给其他视图使用。",
    "hint": "先按“筛选 → 排序 → 计算 total → slice”拆成四段。",
    "extension": "增加“按标题升序”的排序选项，给同名任务指定 id 兜底规则；再写出页码变化时的 3 个验收例子。",
    "lang": "js",
    "file": "practice/13.js",
    "lesson": "challenges/13-task-query.md",
    "advanced": true,
    "requirements": [
      "数据已满足 {id,title,done,priority} 结构；priority 越大越靠前。",
      "关键词 trim 后忽略大小写，按标题包含匹配；空关键词匹配全部。",
      "status 仅允许 all / pending / done。排序先按 priority 降序，同分按 id 升序。",
      "page 从 1 开始；page、pageSize 必须为正安全整数，否则抛错。",
      "返回 {total,items}；total 是筛选后分页前的数量。超出末页返回空 items。",
      "不得修改输入数组、对象或 options。"
    ]
  },
  {
    "id": "14",
    "title": "给编辑器加撤销和重做",
    "goal": "连续修改、撤销、重做；撤销后重新编辑时，旧的重做分支失效。",
    "starter": "function createHistory(initial) {\n  let value = initial;\n  return {\n    get: () => value,\n    set(next) { value = next; },\n    undo() { return value; },\n    redo() { return value; },\n  };\n}\nconst history = createHistory(\"草稿\");\nhistory.set(\"版本 A\");\nhistory.set(\"版本 B\");\nconsole.log(\"撤销一次：\", history.undo());\nconsole.log(\"再撤销：\", history.undo());\nconsole.log(\"重做：\", history.redo());\n",
    "checks": "const h = createHistory(\"初稿\");\nh.set(\"A\"); h.set(\"B\");\ncheck(h.undo() === \"A\", \"撤销应回到 A，不能仍是 B\");\ncheck(h.undo() === \"初稿\" && h.undo() === \"初稿\", \"撤销到底时保持初稿\");\ncheck(h.redo() === \"A\", \"重做应回到 A\");\nh.set(\"分支 C\");\ncheck(h.redo() === \"分支 C\", \"撤销后新编辑必须清空旧重做分支\");\nh.set(\"分支 C\");\ncheck(h.undo() === \"A\", \"相同值不应制造一条历史记录\");\nconst isolated = createHistory(\"独立\");\ncheck(isolated.get() === \"独立\" && h.get() === \"A\", \"两个实例不能共享历史\");\nconst zero = createHistory(0); zero.set(1);\ncheck(zero.undo() === 0 && zero.redo() === 1, \"不能用真值判断代替历史长度判断\");\nconst blank = createHistory(undefined); blank.set(null);\ncheck(blank.undo() === undefined && blank.redo() === null, \"undefined 和 null 都是合法历史值\");\nconst preserve=createHistory(\"A\"); preserve.set(\"B\"); preserve.undo(); preserve.set(\"A\");\ncheck(preserve.redo()===\"B\",\"set 相同值不能破坏已有重做分支\");",
    "steps": [
      "先运行，观察撤销两次为什么完全没有效果。",
      "在纸上写 past / present / future 三列，手动演算 A → B → undo。",
      "实现 undo 与 redo，再处理撤销后 set 新内容。",
      "试两次 set 相同值、以及初始值 0 和 undefined。"
    ],
    "concept": "闭包让多个方法访问同一份私有状态。撤销是状态转移而非简单“减一”；新编辑会产生新的历史分支。明确 Object.is 和对象引用约定可以避免暗含的深拷贝期待。",
    "hint": "保存过去、现在、未来三份状态；数组可以当栈，用 push / pop。",
    "extension": "给历史加 maxDepth 限制；再把字符串版本换成不可变任务数组，实现添加任务后的撤销和重做。",
    "lang": "js",
    "file": "practice/14.js",
    "lesson": "challenges/14-undo-redo.md",
    "advanced": true,
    "requirements": [
      "支持 get()、set(next)、undo()、redo()。undo / redo 返回操作后的当前值。",
      "值使用 Object.is 比较；set 相同值不新增历史，也不破坏重做分支。",
      "撤销到底、重做到头时保持当前值；允许 0、空字符串、undefined 等值。",
      "撤销后 set 不同值必须清空 future；不同 createHistory 实例互不影响。",
      "本关按值保存版本；如果使用对象，调用方必须传新对象且不得再修改已保存版本。不要求自动深拷贝。"
    ]
  },
  {
    "id": "15",
    "title": "修复搜索结果被旧请求覆盖",
    "goal": "先搜 J，再搜 JS；即使 J 最后返回，页面仍保留 JS 的结果。",
    "starter": "function createLatestSearch(fetcher, render) {\n  return async function search(query) {\n    const items = await fetcher(query);\n    render({ status: \"success\", query, items });\n  };\n}\n// 使用手动控制的 Promise，稳定复现“后发先回”，无需真实网络。\nconst pending = new Map();\nconst search = createLatestSearch(query => new Promise(resolve => pending.set(query, resolve)), console.log);\nconst first = search(\"J\");\nconst second = search(\"JS\");\npending.get(\"JS\")([\"JS 新结果\"]);\nawait second;\npending.get(\"J\")([\"J 旧结果\"]);\nawait first;\n",
    "checks": "function deferred() {\n  let resolve, reject;\n  const promise = new Promise((a,b) => {resolve=a;reject=b;});\n  return {promise,resolve,reject};\n}\nconst a = deferred(), b = deferred(), events = [];\nlet call = 0;\nconst run = createLatestSearch(() => (++call === 1 ? a.promise : b.promise), state => events.push(state));\nconst oldRun = run(\"same\"), newRun = run(\"same\");\ncheck(events.length === 2 && events.every(e=>e.status === \"loading\"), \"每次调用立即发出 loading\");\nb.resolve([\"新\"]); await newRun;\na.resolve([\"旧\"]); await oldRun;\ncheck(events.length === 3 && events.at(-1).items[0] === \"新\", \"相同关键词的两次请求也要按序号区分；旧成功不得渲染\");\nconst oldFail = deferred(), newSuccess = deferred(), seen = [];\nlet calls2 = 0;\nconst run2 = createLatestSearch(() => (++calls2===1 ? oldFail.promise : newSuccess.promise), e=>seen.push(e));\nconst p1=run2(\"old\"), p2=run2(\"new\");\nnewSuccess.resolve([\"OK\"]); await p2;\noldFail.reject(new Error(\"旧失败\"));\nlet leaked=false; try {await p1;} catch {leaked=true;}\ncheck(!leaked && seen.length===3 && seen.at(-1).status===\"success\", \"旧失败必须被消化，不能覆盖新结果或泄漏拒绝\");\nconst errorEvents=[];\nconst fail=createLatestSearch(()=>{throw new Error(\"断网\");},e=>errorEvents.push(e));\nawait fail(\"fail\");\ncheck(errorEvents.at(-1).status===\"error\" && errorEvents.at(-1).error===\"断网\", \"最新请求的同步抛错也要转成 error 状态\");\nconst plain=[]; await createLatestSearch(async()=>[],e=>plain.push(e))(\"empty\");\ncheck(plain.at(-1).status===\"success\" && plain.at(-1).items.length===0, \"空结果也是成功\");",
    "steps": [
      "运行手动控制的两次请求：观察新结果之后又出现了旧结果。",
      "先实现每次调用都打印 loading，再给请求编号。",
      "让每个请求保存发起时的编号，完成时和最新编号比较。",
      "试旧请求失败、新请求成功；再试最新请求直接抛错。"
    ],
    "concept": "await 只保证单条异步流程内部的先后，不会保证多次调用的完成顺序。这是竞态条件。请求序号把“最后发起的用户意图”与“最后完成的请求”区分开，错误分支也必须遵守相同约定。",
    "hint": "给每个实例保存递增计数器；调用开始时先 ++，然后再 await。",
    "extension": "把控制器接到第 07 关的搜索框；再增加防抖。写出防抖为什么不能单独解决已发出请求的乱序问题。",
    "lang": "js",
    "file": "practice/15.js",
    "lesson": "challenges/15-latest-request.md",
    "advanced": true,
    "requirements": [
      "每次调用 search(query) 立即 render({status:\"loading\",query})。",
      "仅最后发起的请求允许渲染终态；旧的成功和失败都应被忽略。",
      "成功渲染 {status:\"success\",query,items}；失败渲染 {status:\"error\",query,error:string}。",
      "fetcher 同步抛错和 Promise 拒绝都要接住；search 的正常失败不向调用方继续抛出。",
      "相同关键词的多次请求也要区分；不同工厂实例的序号独立。",
      "本关忽略旧响应，不要求取消底层网络请求；render 视为不会抛错。"
    ]
  },
  {
    "id": "16",
    "title": "做一个最多同时执行两项的任务池",
    "goal": "五项任务只同时运行两项，某项失败不影响其他项，结果仍按输入顺序返回。",
    "starter": "async function runPool(jobs, limit) {\n  // Promise.allSettled 会等全部结果，但这里仍会一下启动所有任务。\n  return Promise.allSettled(jobs.map(job => job()));\n}\nlet active = 0;\nconst jobs = [0,1,2,3,4].map(id => async () => {\n  active++;\n  console.log(\"开始\", id, \"同时运行\", active);\n  await new Promise(resolve => setTimeout(resolve, 15));\n  active--;\n  if (id === 2) throw new Error(\"第三项失败\");\n  return id * 10;\n});\nconsole.log(await runPool(jobs, 2));\n",
    "checks": "let running=0, peak=0;\nconst started=[], gates=[];\nconst jobsToCheck=[0,1,2,3,4].map(id=>()=>{\n  running++; peak=Math.max(peak,running); started.push(id);\n  return new Promise(resolve=>{gates[id]=()=>{running--;resolve(id*10);};});\n});\nlet poolDone=false;\nconst pooled=runPool(jobsToCheck,2).then(value=>{poolDone=true;return value;});\nasync function flush(){for(let i=0;i<12;i++) await Promise.resolve();}\nawait flush();\ncheck(JSON.stringify(started)==='[0,1]', \"应先且仅启动 0、1；顺序执行和全部并发都不满足要求\");\ngates[1](); await flush();\ncheck(JSON.stringify(started)==='[0,1,2]' && !poolDone, \"一项完成就应补位，但不能提前返回\");\ngates[2](); await flush(); gates[0](); await flush();\ncheck(JSON.stringify(started)==='[0,1,2,3,4]', \"释放名额后应持续补位\");\ngates[4](); gates[3]();\nconst results=await pooled;\ncheck(peak===2 && running===0, \"同时活跃任务最多 2 个，返回前必须全部结束\");\ncheck(JSON.stringify(results.map(r=>r.value))==='[0,10,20,30,40]', \"必须按输入顺序返回，不能按完成顺序 push\");\nconst reason=new Error(\"同步失败\");\nconst mixed=await runPool([()=>{throw reason;},async()=>7,()=>Promise.reject(\"拒绝\")],1);\ncheck(mixed[0].status===\"rejected\" && mixed[0].reason===reason && mixed[1].value===7 && mixed[2].reason===\"拒绝\", \"同步错误和异步拒绝都要保存，失败后继续\");\ncheck((await runPool([],3)).length===0, \"空任务列表应立即返回 []\");\ncheck((await runPool([()=>42],10))[0].value===42, \"并发数大于任务数仍应正确\");\nfor(const limit of [0,-1,1.2,NaN,Infinity]) {\n  let rejected=false; try{await runPool([],limit);}catch{rejected=true;}\n  check(rejected,\"即使空列表也要拒绝非法并发数：\"+limit);\n}",
    "steps": [
      "运行，观察明明 limit=2，active 为什么超过 2。",
      "先做 limit=1 的顺序版本，保证失败也能继续。",
      "改成有限数量 worker，每个循环领取下一份工作。",
      "使用原输入下标写 results，再测试后发任务先完成。"
    ],
    "concept": "Promise.allSettled 汇总每项成功或失败的结果；并发限制还需要控制任务何时启动。索引保存输入顺序，worker 控制活跃数量，逐项 catch 保证失败隔离。本关检查用手动释放的 Promise 控制顺序，不靠精确毫秒计时。",
    "hint": "jobs 必须是函数数组。如果先把所有 job() 调完，之后就无法限制启动数量。",
    "extension": "加入重试上限，只对指定错误重试；写明重试是否继续占用名额，以及结果记录几次尝试。",
    "lang": "js",
    "file": "practice/16.js",
    "lesson": "challenges/16-concurrency-pool.md",
    "advanced": true,
    "requirements": [
      "jobs 是尚未执行的函数数组，每个函数无参数，可同步返回值、返回 Promise 或抛错。",
      "limit 必须是正安全整数；即使 jobs 为空也先校验 limit。",
      "同时运行数量不超过 limit；有空位就启动下一项，取任务按输入顺序。",
      "单项结果为 {status:\"fulfilled\",value} 或 {status:\"rejected\",reason}；保留原始拒绝原因。",
      "单项失败不打断其他项；所有项都结束后返回，结果顺序与输入一致。",
      "本关不要求取消、重试或动态增加任务。jobs、日志回调之外无网络依赖。"
    ]
  },
  {
    "id": "17",
    "title": "导入脏数据时一次列出所有错误",
    "goal": "把外部 unknown 校验成 Task[]；同时告诉用户每个错误在哪个字段。",
    "starter": "interface Task { id: number; title: string; done: boolean }\ninterface Issue { path: string; message: string }\ntype ImportResult = { ok: true; value: Task[] } | { ok: false; issues: Issue[] };\nfunction parseImport(input: unknown): ImportResult {\n  // TODO：不能用 as Task[] 假装校验完成。\n  return { ok: true, value: input as Task[] };\n}\nconsole.log(parseImport([{id:1,title:\" 学习 \",done:false},{id:1,title:\" \",done:\"false\"}]));\n",
    "checks": "const raw=[{id:1,title:\" JS \",done:false,extra:123}];\nconst before=JSON.stringify(raw);\nconst good=parseImport(raw);\ncheck(good.ok && JSON.stringify(good.value)==='[{\"id\":1,\"title\":\"JS\",\"done\":false}]', \"成功时 trim 标题，只输出已知字段\");\nif(good.ok) check(good.value[0] !== raw[0], \"输出对象必须新建\");\ncheck(JSON.stringify(raw)===before,\"不能修改输入\");\nconst dirty=parseImport([{id:2,title:\" \",done:\"false\"},{id:2,title:\"B\",done:false},null,[]]);\ncheck(!dirty.ok,\"脏数据不能伪装成功\");\nif(!dirty.ok) {\n  const paths=dirty.issues.map(i=>i.path);\n  check(JSON.stringify(paths)==='[\"$[0].title\",\"$[0].done\",\"$[1].id\",\"$[2]\",\"$[3]\"]',\"要收集全部错误，按行、按 id/title/done 顺序；坏行中的合法 id 也占位\");\n  check(dirty.issues.every(i=>i.message.trim().length>0),\"每个错误必须有可读消息\");\n}\nfor(const value of [null,{},\"[]\",123]) {\n  const result=parseImport(value);\n  check(!result.ok && result.issues.length===1 && result.issues[0]?.path===\"$\", \"顶层非数组应返回根路径错误\");\n}\nconst invalid=parseImport([{id:0,title:3,done:0},{id:Number.MAX_SAFE_INTEGER+1,title:\"A\",done:true}]);\ncheck(!invalid.ok && invalid.issues.length===4,\"非法数字 id 和字段类型不能被自动转换\");\ncheck(parseImport([]).ok,\"空数组是合法导入\");\n// 负向类型验收：成功和失败不能随意读另一分支的字段。\nconst typed: ImportResult = parseImport([]);\nif(false) {\n  // @ts-expect-error 未收窄前不能直接读取 value\n  console.log(typed.value);\n}",
    "steps": [
      "先运行，观察重复 id、空标题和字符串 done 为什么被当成成功。",
      "先做顶层数组、行对象检查，再逐字段校验。",
      "使用 issues 累积所有问题，别发现第一个就 return。",
      "最后检查 id 重复、输出规范化和原数据不变。"
    ],
    "concept": "这是边界校验与错误建模的组合。静态类型无法替你信任网络或文件内容。完整错误列表让用户一次修正多处数据；明确规范化、重复规则和整体失败策略可以避免业务歧义。",
    "hint": "Array.isArray 后接成 unknown[]，继续逐行收窄。为每行保存 `$[${index}]` 路径。",
    "extension": "增加可选 dueDate 字段，明确日期格式；再写一个把 Issue[] 按行分组显示的函数。",
    "lang": "ts",
    "file": "practice/17.ts",
    "lesson": "challenges/17-validate-import.md",
    "advanced": true,
    "requirements": [
      "输入是 unknown，函数负责校验已解析的数据；此关不做 JSON 文本解析。",
      "顶层必须是数组，错误路径 $；行必须是非 null、非数组对象，错误路径 $[i]。",
      "id 为正安全整数且全表唯一；遇到合法数字 id 就占位，即使该行其他字段错误。",
      "title 是 trim 后非空字符串；done 必须是 boolean，不能把字符串或数字强制转换。",
      "收集全部问题，顺序为行顺序、同行 id → title → done。每个 Issue 包含 path 与非空 message。",
      "只要有错就整体失败，不返回部分成功数据；成功返回新 Task 对象，剔除未知字段，不改输入。",
      "不要求额外的属性描述符或原型安全处理；用普通 JSON 数据即可。"
    ]
  },
  {
    "id": "18",
    "title": "做一个事件名与载荷严格对应的通知器",
    "goal": "订阅任务事件、发送通知、取消订阅；错误的事件名或载荷在编译时被拦住。",
    "starter": "function createEmitter<Events extends object>() {\n  return {\n    on<K extends keyof Events>(_event: K, _listener: (payload: Events[K]) => void): () => void {\n      // TODO：保存订阅；返回取消订阅函数。\n      return () => {};\n    },\n    emit<K extends keyof Events>(_event: K, _payload: Events[K]): void {\n      // TODO：按订阅顺序通知本轮快照中的所有监听器。\n    },\n  };\n}\ninterface TaskEvents { saved: {id:number; title:string}; failed: {message:string} }\nconst bus = createEmitter<TaskEvents>();\nconst off = bus.on(\"saved\", task => console.log(\"保存了\", task.title));\nbus.emit(\"saved\", {id:1,title:\"学 TS\"});\noff();\nbus.emit(\"saved\", {id:2,title:\"不应再通知\"});\n",
    "checks": "const testBus=createEmitter<TaskEvents>();\nconst notices:string[]=[];\nconst offSaved=testBus.on(\"saved\",task=>notices.push(task.title));\ntestBus.on(\"failed\",error=>notices.push(error.message));\ntestBus.emit(\"saved\",{id:1,title:\"A\"});\ncheck(JSON.stringify(notices)==='[\"A\"]',\"saved 必须只通知 saved 订阅者\");\noffSaved(); offSaved(); testBus.emit(\"saved\",{id:2,title:\"B\"}); testBus.emit(\"failed\",{message:\"错误\"});\ncheck(JSON.stringify(notices)==='[\"A\",\"错误\"]',\"取消订阅应生效且可重复调用\");\nconst sequence:string[]=[];\nconst snap=createEmitter<{tick:number}>();\nlet removeSecond:()=>void=()=>{};\nlet added=false;\nsnap.on(\"tick\",n=>{sequence.push(\"A\"+n);removeSecond();if(!added){added=true;snap.on(\"tick\",v=>sequence.push(\"C\"+v));}});\nremoveSecond=snap.on(\"tick\",n=>sequence.push(\"B\"+n));\nsnap.emit(\"tick\",1); snap.emit(\"tick\",2);\ncheck(JSON.stringify(sequence)==='[\"A1\",\"B1\",\"A2\",\"C2\"]',\"派发使用快照：本轮删除仍执行，本轮新增等下一轮\");\nlet duplicate=0;\nconst same=()=>{duplicate++;};\nconst d=createEmitter<{tick:number}>();\nconst offOne=d.on(\"tick\",same); d.on(\"tick\",same); d.emit(\"tick\",1);\ncheck(duplicate===2,\"相同函数的两次注册应当独立\");\noffOne(); d.emit(\"tick\",2); check(Number(duplicate)===3,\"取消其中一个注册不能删除另一个\");\nconst independent=createEmitter<TaskEvents>(); independent.emit(\"saved\",{id:9,title:\"孤立\"});\ncheck(notices.length===2,\"不同通知器不能共享订阅\");\nif(false) {\n  // @ts-expect-error 不存在的事件名必须被阻止\n  testBus.emit(\"removed\", {id:1});\n  // @ts-expect-error saved 载荷的 id 必须是 number\n  testBus.emit(\"saved\", {id:\"1\",title:\"A\"});\n  // @ts-expect-error failed 必须有 message\n  testBus.emit(\"failed\", {id:1});\n  testBus.on(\"saved\", payload=>{\n    // @ts-expect-error 监听器必须推断 saved 的载荷，不能退化为 any\n    payload.message;\n  });\n}",
    "steps": [
      "运行，注意本该打印一次的“保存了”完全没有出现。",
      "先存储监听器并实现 emit，再加取消订阅。",
      "让监听器在派发中取消另一个订阅、同时加一个新订阅，预测本轮与下轮的区别。",
      "跑 --check；除了行为，检查还会确认错误的事件名和载荷确实被 TS 拦住。"
    ],
    "concept": "泛型在这里表达了事件名和数据之间的联系。映射类型把不同键对应到不同监听器类型。运行时的快照又决定了注册表变更何时生效。@ts-expect-error 用于负向类型验收：预期错误若没有发生，检查反而失败。",
    "hint": "K extends keyof Events 绑定合法事件名；Events[K] 表示对应事件的载荷。",
    "extension": "监听器抛错时继续通知其余人，返回错误列表；再把 saved 事件接到任务管理项目的新增操作和日志输出。",
    "lang": "ts",
    "file": "practice/18.ts",
    "lesson": "challenges/18-typed-events.md",
    "advanced": true,
    "requirements": [
      "createEmitter<Events>() 提供 on(event,listener) 和 emit(event,payload)。事件名与载荷由 Events 的键和值对应。",
      "on 返回取消函数；可重复取消，不影响其他订阅。同一回调注册两次视为两份独立订阅。",
      "emit 同步按注册顺序派发；每次开始时复制订阅快照。本轮新增下轮生效，本轮删除不影响本轮快照。",
      "没有订阅者时不抛错；不同实例彼此隔离。",
      "基础合同假定监听器不会抛错、不递归 emit；监听器异常隔离作为扩展。",
      "测试需要错误事件名、错误载荷在编译时失败，不能将公开参数退化为 any。本关事件名使用 saved / failed / tick 等普通自有键。"
    ]
  }
]);
