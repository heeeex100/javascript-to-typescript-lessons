function createEmitter<Events extends object>() {
  const buckets: { [K in keyof Events]?: Set<(payload: Events[K]) => void> } = {};
  return {
    on<K extends keyof Events>(event: K, listener: (payload: Events[K]) => void): () => void {
      const bucket = buckets[event] ?? new Set<(payload: Events[K]) => void>();
      buckets[event] = bucket;
      // 包装为独立订阅：同一个函数注册两次也能分别取消。
      const subscription = (payload: Events[K]) => listener(payload);
      bucket.add(subscription);
      return () => { bucket.delete(subscription); };
    },
    emit<K extends keyof Events>(event: K, payload: Events[K]): void {
      const snapshot = [...(buckets[event] ?? [])];
      for (const listener of snapshot) listener(payload);
    },
  };
}
interface TaskEvents { saved: {id:number; title:string}; failed: {message:string} }
const bus = createEmitter<TaskEvents>();
const off = bus.on("saved", task => console.log("保存了", task.title));
bus.emit("saved", {id:1,title:"学 TS"});
off();
bus.emit("saved", {id:2,title:"不应再通知"});
