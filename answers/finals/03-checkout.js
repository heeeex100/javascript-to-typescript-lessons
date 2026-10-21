function createCheckout(unitPrice = 12, adjust = amount => amount) {
  let orders = 0;
  return quantity => {
    let total = adjust(quantity * unitPrice);
    if (total < 0) total = 0;
    orders += 1;
    return { total, orders };
  };
}
const regular = createCheckout();
const coupon = createCheckout(10, amount => amount - 3);
console.log(regular(2), coupon(3), regular(0));
