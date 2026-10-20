function totalMinutes(minutes, days = 1) {
  return minutes * days;
}
const double = value => value * 2;
function apply(value, operation) {
  return operation(value);
}
function makeCounter() {
  let count = 0;
  return () => {
    count += 1;
    return count;
  };
}
console.log("总时长：", totalMinutes(30, 5));
console.log("默认一天：", totalMinutes(30));
console.log("函数作为参数：", apply(4, double));
const next = makeCounter();
const another = makeCounter();
console.log("第一个计数器：", next(), next());
console.log("另一个计数器：", another());
