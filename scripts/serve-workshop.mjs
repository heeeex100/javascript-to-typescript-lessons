import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { createWorkshopHandler } from "./static-server.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const port = Number(process.env.WORKSHOP_PORT ?? 8766);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("WORKSHOP_PORT 必须为 1～65535 的整数");
const server = createServer(await createWorkshopHandler(root));
server.on("error", error => {
  console.error(`预览服务未启动：${error.message}。${error.code === "EADDRINUSE" ? `可以使用已经运行的预览，或关闭占用 ${port} 端口的旧预览后重试。` : "也可以直接打开 workshop/index.html。"}`);
  process.exitCode = 1;
});
server.listen(port, "127.0.0.1", () => console.log(`动手实验台：http://127.0.0.1:${port}/workshop/\n只在本机访问；终端按 Ctrl+C 关闭。`));
