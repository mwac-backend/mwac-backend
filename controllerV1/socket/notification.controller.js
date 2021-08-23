// repository
// const {SocketData} = require("./socket_data");
const { authValidation } = require('../../middleware/auth.validation.middleware');

module.exports.notificationSocket = {
    notificationSocketController
}

function notificationSocketController(io) {
    io.use(authValidation.validJWTNeeded);
    io.on('connection', (socket) => {

        const user = socket.user;
        socket.emit('connect-info', socket.user);


    });
}