function planMinutes(text: string, bonus: number): number {
  const minutes=Number(text);
  if (!text.trim() || !Number.isFinite(minutes) || minutes<0 || !Number.isFinite(bonus) || bonus<0) throw new Error("分钟输入无效");
  return minutes+bonus;
}
console.log(planMinutes("20",5));
