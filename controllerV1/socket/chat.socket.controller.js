const { ScoketData } = require('./sockData.repository');
const { authValidation } = require('../../middleware/auth.validation.middleware');

module.exports.chatSocket = {
    chatSocketController
}

function chatSocketController(io) {
    io.use(authValidation.validJWTSocketNeeded);
    io.on('connection', (socket) => {
        
        const { submissionControlID } = socket.handshake.query;
        if(!submissionControlID) socket.emit('error', {error: "No Room Identify"});

        const user = socket.user;
        socket.join(submissionControlID);

        socket.emit('connect-info', {...socket.user, ...socket.handshake.query});

        const r = await ScoketData.getMessageByRoom({submissionControlID});
        socket.emit('on-get-message', r);

        socket.on('get-message', async (data) => {
            const submissionControlID = data.submissionControlID;
            const r = await ScoketData.getMessageByRoom({submissionControlID: submissionControlID});
            io.in(submissionControlID).emit('on-get-message', r);
        });

        socket.on('send-message', async (data) => {
            const r = await ScoketData.saveMessage({data, user});
            io.emit('on-send-message', {...r[0]});
            io.in(submissionControlID).except(socket.id).emit('on-get-message', r);
        })

    });
}