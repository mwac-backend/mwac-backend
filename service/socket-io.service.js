const { roomSocket } = require('../controllerV1/socket/room.socket.controller');
const { notificationSocket } = require('../controllerV1/socket/notification.controller');
const { chatSocket } = require('../controllerV1/socket/chat.socket.controller');

function initSocketIO(server) {

    const io = require('socket.io')(server, {
        cors: {
            origin: '*:*'
        }
    });
    io.of('/').on('connection', (socket) => {
        console.log("Connect");
    })
    roomSocket.roomSocketController(io.of('/rooms'));
    chatSocket.chatSocketController(io.of('/chat'));
    notificationSocket.notificationSocketController(io.of('/notifications'));

}

module.exports.Socket = {
    initSocketIO
}