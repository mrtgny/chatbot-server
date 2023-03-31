import { server as WebSocketServer } from "websocket";
import socketRoutes from "./socket";

const initSocketServer = async (wsServer: WebSocketServer) => {
  socketRoutes.public(wsServer);
  socketRoutes.private(wsServer);
};

export { initSocketServer };
