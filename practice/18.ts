function createEmitter<Events extends object>() {
  return {
    on<K extends keyof Events>(_event: K, _listener: (payload: Events[K]) => void): () => void {
      // TODO：保存订阅；返回取消订阅函数。
      return () => {};
    },
    emit<K extends keyof Events>(_event: K, _payload: Events[K]): void {
      // TODO：按订阅顺序通知本轮快照中的所有监听器。
    },
  };
}
interface TaskEvents { saved: {id:number; title:string}; failed: {message:string} }
const bus = createEmitter<TaskEvents>();
const off = bus.on("saved", task => console.log("保存了", task.title));
bus.emit("saved", {id:1,title:"学 TS"});
off();
bus.emit("saved", {id:2,title:"不应再通知"});
