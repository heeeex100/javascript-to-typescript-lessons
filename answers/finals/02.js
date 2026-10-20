const sessions = [10, 25, 40, 15];
const minimum = 25;
let total = 0;
let count = 0;
let skipped = 0;
let average = 0;
for (const minutes of sessions) {
  if (minutes >= minimum) {
    total = total + minutes;
    count = count + 1;
  } else {
    skipped = skipped + 1;
  }
}
if (count > 0) average = total / count;
console.log({ total, count, skipped, average });
