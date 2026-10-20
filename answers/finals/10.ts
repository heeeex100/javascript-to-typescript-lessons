type Result = {ok:true;value:string}|{ok:false;error:string};
function parseTitle(input: unknown): Result {
  if(typeof input!=="string" || !input.trim()) return {ok:false,error:"需要非空标题"};
  return {ok:true,value:input.trim()};
}
function describe(result: Result): string { return result.ok ? `已接收：${result.value}` : `失败：${result.error}`; }
console.log(describe(parseTitle(" 学习 ")));
