import { possibleAnswers } from "../utils/constants";
import { capitalize, fixMissedSize, getConnection, parseRequest, prepareList, prepareResponse, resetConnection, sendMessage } from "../utils/functions";
import { AUTHOR_ENUM, CoffeeSizeType, IRequest, IResponse } from "../utils/types";

const isSuggesgtion = (request: IRequest) => {
    return request.suggest;
}

const handleSuggestion = (request: IRequest) => {
    const { id, message: _message } = request;
    const { data } = getConnection(id);
    const message = _message.toLowerCase();
    const splittedMessage = message.split(" ");
    const lastWord = splittedMessage[splittedMessage.length - 1];
    const suggestion = {
        author: "chatbot",
        message: lastWord ?
            possibleAnswers.map(i => {
                const startsWithLastWord = i.indexOf(lastWord) === 0
                const startsWithMessage = i.indexOf(message) === 0;
                const containsMessage = startsWithLastWord || startsWithMessage;
                if (containsMessage) {
                    return i
                } else {
                    return ""
                }
            }).filter(i => i) : [],
        suggest: true,
        date: new Date().toString()
    } as any

    sendMessage(suggestion, id);
}

const isInitMessage = (request: IRequest) => {
    return request.message === 'init-chatbot'
}

const handleChat = (request: IRequest) => {
    const { id, message: _message } = request;
    const { data } = getConnection(id);
    const { missedSize, name, nameRequested } = data
    const message = _message.toLowerCase();
    const response: IResponse = { author: AUTHOR_ENUM.CHATBOT, date: (new Date()).toString() }
    console.log("REQUEST", message);

    const init = isInitMessage(request);
    console.log("RESPONSE", response, init);

    if (init) {
        response.message = "Hello, welcome to CoffeeInLove. What do you desire?"
        resetConnection(id);
    } else {
        sendMessage({ ...response, status: 'typing' }, id);
        if (nameRequested) {
            data.name = request.message;
            response.name = request.message!.split(" ").map(i => capitalize(i)).join(" ");
        }
        response.list = prepareList(request)
        response.message = missedSize ?
            fixMissedSize(message as CoffeeSizeType, data, response, request) :
            nameRequested ?
                prepareResponse(response, data, request) :
                parseRequest(request, response);

        if (!response.message && !response.list?.length) {
            response.message = "Excuse me. I did not understand what you want. Could you try again?"
        }
    }

    setTimeout(() => {
        sendMessage(response, id);
    }, init ? 0 : response.message.length * 50);
}


export const handleRequest: (request: IRequest) => void = async (request) => {
    if (isSuggesgtion(request)) {
        handleSuggestion(request)
    } else {
        handleChat(request);
    }
}