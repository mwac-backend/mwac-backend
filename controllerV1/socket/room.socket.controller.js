const { ScoketData } = require('./sockData.repository');
const { authValidation } = require('../../middleware/auth.validation.middleware');

module.exports.roomSocket = {
    roomSocketController,
}

function roomSocketController(io) {
    io.use(authValidation.validJWTSocketNeeded);
    io.on('connection', (socket) => {

        const user = socket.user;
        socket.emit('connect-info', socket.user);
    });
}