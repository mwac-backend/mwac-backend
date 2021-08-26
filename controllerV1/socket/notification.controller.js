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

        socket.on('create-notification', async (data) => {

            // socket.emit('on-create-notification')
        });

        socket.on('get-notifications', async (data) => {

            // socket.emit('on-get-notifications')
        });

        socket.on('is-read-notifications', async (data) => {

            // socket.emit('on-is-read-notifications')
        })

    });
}