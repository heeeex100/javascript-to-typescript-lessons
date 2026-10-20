function first(items: any[]): any {
  return items[0];
}
const numberItem = first([10, 20]);
const textItem = first(["JS", "TS"]);
console.log(numberItem, textItem, first([]));
