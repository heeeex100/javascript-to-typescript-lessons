function checkout(quantity, unitPrice = 12, coupon = 0) {
  const payable = quantity * unitPrice - coupon;
  return Math.max(0, payable);
}
console.log(checkout(2));
console.log(checkout(3, 10, 5));
