const name = "小杨";
let minutes = 20;
minutes += 10;
console.log(`${name} 学习了 ${minutes} 分钟`);

const input = "20";
console.log("直接相加：", input + 5);
console.log("转换后相加：", Number(input) + 5);
console.log("类型：", typeof input, typeof Number(input));
console.log("严格比较：", input === 20);
console.log("无效数字：", Number("abc"));
console.log("空字符串：", Number(""));

const user = { name: "小杨" };
user.name = "小李"; // 允许修改对象属性，没有重新赋值 user。
console.log("const 对象的属性：", user.name);
