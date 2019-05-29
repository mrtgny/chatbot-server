const WebSocketServer = require('websocket').server;
const http = require('http');
const {Response, Suggestion} = require('./Response');

const server = http.createServer(function (request, response) {
    // process HTTP request. Since we're writing just WebSockets
    // server we don't have to implement anything.
});
server.listen(8000, function () {
});

// create the server
wsServer = new WebSocketServer({
    httpServer: server
});

// WebSocket server
wsServer.on('request', function (request) {
    const connection = request.accept(null, request.origin);

    // This is the most important callback for us, we'll handle
    // all messages from users here.

    connection.on('message', function (message) {
        let request;
        if (message.type === 'utf8') {
            // process WebSocket message
            try {
                request = JSON.parse(message.utf8Data);
            } catch (e) {
                console.log("JSON PARSE ERROR", e)
            }
        }

        if (!!request.suggest) {
            connection.send(JSON.stringify(new Suggestion(request)));
        } else {
            const response = new Response(request);
            const {message, author} = response;
            const init = request.message !== 'init-chatbot';
            console.log("RESPONSE", response);

            if (init) {
                connection.send(JSON.stringify(request));
                connection.send(JSON.stringify({author, status: "typing"}));
            }
            setTimeout(() => {
                connection.send(JSON.stringify({...response, message}));
                // if (response.name) {
                //     connection.send(JSON.stringify({author: 'chatbot', name: response.name}));
                // }
            }, init ? message.length * 50 : 0);

        }

        console.log("request", request);

    });

    connection.on('close', function (connection) {
        // close user connection
    });
});
