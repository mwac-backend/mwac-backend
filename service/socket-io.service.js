const { roomSocket } = require('../controllerV1/socket/room.socket.controller');
const { notificationSocket } = require('../controllerV1/socket/notification.controller');

function initSocketIO(server) {

    const io = require('socket.io')(server);
    io.on('connection', (socket) => {
        console.log("Connect");
    })
    roomSocket.roomSocketController(io.of('/rooms'));
    notificationSocket.notificationSocketController(io.of('/notifications'));

}

module.exports.Socket = {
    initSocketIO
}