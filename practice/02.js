const sessions = [10, 25, 40, 15];
let total = 0;
let count = 0;
for (const minutes of sessions) {
  if (minutes > 25) {
    total += minutes;
    count += 1;
  }
  console.log("读到", minutes, "累计", total, "次数", count);
}
