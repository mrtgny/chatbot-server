import { onMessage } from "../methods/socket";
import { createConnection } from "../utils/functions";
import { ISocketAppRoute } from "../utils/types";

const socketRoutes: ISocketAppRoute = {
  private() {
    // For authenticated requests.
  },
  public(socket) {
    socket.on("request", (request) => {
      console.log("connected");
      const [{ connection }, id] = createConnection(request);
      connection.on("message", (message) => onMessage(message, id));
      connection.on("close", connection.close);
    });
  },
};

export default socketRoutes;
