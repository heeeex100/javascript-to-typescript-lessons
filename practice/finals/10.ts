type Result = {ok:true;value:string}|{ok:false;error:string};
function parseTitle(input: unknown): Result {
  return {ok:false,error:"尚未完成"};
}
function describe(result: Result): string { return ""; }
console.log(describe(parseTitle(" 学习 ")));
