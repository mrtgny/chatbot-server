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

        console.log("request", request);
        const response = !!request.suggest ? new Suggestion(request) : new Response(request);
        connection.send(JSON.stringify(response))
    });

    connection.on('close', function (connection) {
        // close user connection
    });
});
