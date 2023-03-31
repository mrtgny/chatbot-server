import cors from "cors";
import express from "express";
import { createServer } from "http";
import morgan from "morgan";
import { server as WebSocketServer } from "websocket";
import { initSocketServer } from "./routes";
import { isTest } from "./utils/functions";

const PORT = isTest() ? 8001 : 8000;
const app = express();

const server = createServer(app);
const wsServer = new WebSocketServer({ httpServer: server });

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const initServer = async () => {
  await initSocketServer(wsServer);
  return server.listen(PORT, () => {
    console.log("SERVER IS RUNNING AT", PORT);
  });
};

export default initServer;
