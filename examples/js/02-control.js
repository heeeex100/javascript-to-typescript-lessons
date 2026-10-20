const sessions = [10, 25, 40, 15];
let total = 0;
let count = 0;
for (const minutes of sessions) {
  if (minutes >= 25) {
    total += minutes;
    count += 1;
  }
}
console.log("达到 25 分钟的总时长：", total);
console.log("达到 25 分钟的次数：", count);
console.log("0 || 10：", 0 || 10);
console.log("0 ?? 10：", 0 ?? 10);
