function first<T>(items: readonly T[]): T | undefined { return items[0]; }
function findById<T extends {id:number}>(items: readonly T[], id: number): T | undefined { return items.find(item=>item.id===id); }
console.log(first(["JS","TS"]));
