import type { Express } from "express";
import { server as WebSocketServer } from "websocket";
import socketRoutes from "./socket";

const init = async (app: Express) => {
};

const initSocketServer = async (wsServer: WebSocketServer) => {
    socketRoutes.public(wsServer);
    socketRoutes.private(wsServer);
}

export {
    init,
    initSocketServer
};
