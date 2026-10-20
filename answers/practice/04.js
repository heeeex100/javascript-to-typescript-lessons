const tasks = [
  { id: 1, title: "读 JS", done: false },
  { id: 2, title: "喝水", done: true },
  { id: 3, title: "写练习", done: false },
];
function pendingTitles(items) {
  return items.filter(task => !task.done).map(task => task.title);
}
console.log(pendingTitles(tasks));
