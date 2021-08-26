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
   
        socket.on('get-rooms', async (data) => {
            const rooms = await ScoketData.getRoom({user});
            socket.emit('on-get-rooms', rooms);
        })

        socket.on('create-room', async (data) => {
            let { agencyID, submissionControlID, remark } = data || {};

            const result = await ScoketData.updateRoom({
                id: null,
                agencyID, 
                submissionControlID, 
                remark, 
                user
            });
            socket.emit('on-create-room', result);
        });

    });
}