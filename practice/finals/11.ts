function first<T>(items: readonly T[]): T | undefined { return undefined; }
function findById<T extends {id:number}>(items: readonly T[], id: number): T | undefined { return undefined; }
console.log(first(["JS","TS"]));
