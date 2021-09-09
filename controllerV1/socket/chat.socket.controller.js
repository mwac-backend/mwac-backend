const { ScoketData } = require('./sockData.repository');
const { authValidation } = require('../../middleware/auth.validation.middleware');

module.exports.chatSocket = {
    chatSocketController
}

function chatSocketController(io) {
    io.use(authValidation.validJWTSocketNeeded);
    io.on('connection', async (socket) => {
        const { submissionControlID } = socket.handshake.query;
        if(!submissionControlID) socket.emit('error', {error: "No Room Identify"})
        else {
            const user = socket.user;
            socket.join(submissionControlID);

            socket.emit('connect-info', {...socket.user, ...socket.handshake.query});

            const r = await ScoketData.getMessageByRoom({submissionControlID});
            io.in(submissionControlID).emit('on-get-message', r);
            io.in(submissionControlID).except(socket.id).emit('on-join', {...socket.user, ...socket.handshake.query});

            socket.on('get-message', async (data) => {
                const r = await ScoketData.getMessageByRoom({submissionControlID});
                io.in(submissionControlID).emit('on-get-message', r);
            });

            socket.on('send-message', async (data) => {
                const r = await ScoketData.saveMessage({data, user, submissionControlID});
                io.emit('on-send-message', {...r});
                const message = await ScoketData.getMessageByRoom({submissionControlID});
                io.in(submissionControlID).except(socket.id).emit('on-get-message', message);
            })

            socket.on('disconnect', () => {
                io.in(submissionControlID).except(socket.id).emit('on-leave', {...socket.user})
                socket.leave(submissionControlID);
            })
        }
    });
}