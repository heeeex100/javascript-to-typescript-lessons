const input = "20";
const bonus = 5;
const numeric = Number(input);
const total = numeric + bonus;
const valid = Number.isFinite(total);
console.log(numeric, total, valid);
