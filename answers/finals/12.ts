interface Task {id:number;title:string;done:boolean}
type Result<T>={ok:true;value:T}|{ok:false;error:string};
function removeTask(tasks: readonly Task[],id: number): Result<Task[]> {
  if(!tasks.some(task=>task.id===id))return {ok:false,error:"任务不存在"};
  return {ok:true,value:tasks.filter(task=>task.id!==id)};
}
function renameTask(tasks: readonly Task[],id: number,title:string): Result<Task[]> {
  if(!title.trim())return {ok:false,error:"标题不能为空"};
  if(!tasks.some(task=>task.id===id))return {ok:false,error:"任务不存在"};
  return {ok:true,value:tasks.map(task=>task.id===id?{...task,title:title.trim()}:task)};
}
