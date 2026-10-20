interface Task {id:number;title:string;done:boolean}
type Result<T>={ok:true;value:T}|{ok:false;error:string};
function removeTask(tasks: readonly Task[],id: number): Result<Task[]> { return {ok:false,error:"尚未完成"}; }
function renameTask(tasks: readonly Task[],id: number,title:string): Result<Task[]> { return {ok:false,error:"尚未完成"}; }
