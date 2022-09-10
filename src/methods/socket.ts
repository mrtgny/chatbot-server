import { Message } from "websocket";
import { handleRequest } from "../functions/socket";
import { IRequest } from "../utils/types";

export const onMessage: (message: Message, id: string) => void = async (message, id) => {
    if (message.type === 'utf8') {
        try {
            const request: IRequest = JSON.parse(message.utf8Data);
            request.id = id;
            handleRequest(request)
        } catch (e) {
            console.log("JSON PARSE ERROR", e)
        }
    }
} 