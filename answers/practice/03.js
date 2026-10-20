function checkout(quantity, unitPrice = 12) {
  const total = quantity * unitPrice;
  console.log("店员说：", total);
  return total;
}
const payment = checkout(2);
console.log("付款系统拿到：", payment);
