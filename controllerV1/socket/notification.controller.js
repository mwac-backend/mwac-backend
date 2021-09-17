// repository
const {SocketData} = require("./sockData.repository");
const { authValidation } = require('../../middleware/auth.validation.middleware');
const { caching, cachingGet } = require('../../database');

module.exports.notificationSocket = {
    notificationSocketController
}

function notificationSocketController(io) {
    io.use(authValidation.validJWTSocketNeeded);
    io.on('connection', async (socket) => {

        const user = socket.user;

        await setListAgency(user.agencyID, socket.id, user.id);
        socket.emit('connect-info', user);

        socket.on('create-notification', async (data) => {
            // step 1
            const { submissionControlID, title, subTitle, remark } = data || {};

            // step 2
            // find agency in submission control
            const agencyList = await SocketData.getAgencyBySubmissionControl(submissionControlID);
            // step 2.2
            // find people in agency list
            for (let i = 0; i < agencyList.length; i++) {
                const userList = await SocketData.getUserByAgencyID(agencyList[i].id)

                // step 2.3
                // get people online
                const listAgencySocketID = await getListAgency(agencyList[i].id);
                // send notification
                for (let n = 0; n < listAgencySocketID.length; n++) {

                    // find last seen
                    const lastSeen = await SocketData.getLastSeenNotificationByUserID({userID: listAgencySocketID[n].userID});

                    socket.to(listAgencySocketID[n].socketID).emit('on-create-notification', {
                        title,
                        subTitle,
                        remark,
                        lastSeen
                    });
                }

                // step 3
                // save notification every people in agency
                for (let n = 0; n < userList.length; n++) {
                    const r = await SocketData.updateNotification({
                        id: null,
                        title,
                        subTitle,
                        submissionControlID,
                        agencyID: agencyList[i].id,
                        userID: userList[n].id,
                        remark,
                        user
                    });
                }

            }

        });

        socket.on('get-notifications', async (data) => {

            const lastSeen = await SocketData.getLastSeenNotificationByUserID({userID: user.id});

            const notification = await SocketData.getNotification({userID: user.id});
            socket.emit('on-get-notifications', {
                lastSeen,
                notification
            })
        });

        socket.on('is-read-notifications', async (data) => {
            const r = await SocketData.updateLastSeenNotificationByUserID({userID: user.id});

            socket.emit('on-is-read-notifications', r);
        })

        socket.on('disconnect', async (data) => {
            await delListAgencyBySocketID(user.agencyID, socket.id);
        })
    });
}

async function getListAgency(key) {
    try {
        let listAgency = await cachingGet(key) || '[]';
        listAgency = JSON.parse(listAgency);
        return listAgency;
    } catch (e) {
        console.log(e)
    }
}

async function setListAgency(key, socketID, userID) {
    try {
        let listAgency = await cachingGet(key) || '[]';
        listAgency = JSON.parse(listAgency);
        listAgency.push({socketID, userID});
        listAgency = JSON.stringify(listAgency);
        caching.set(key, listAgency);
    } catch (e) {
        console.log(e)
    }
}

async function delListAgencyBySocketID(key, socketID) {
    try {
        let listAgency = await cachingGet(key) || '[]';
        listAgency = JSON.parse(listAgency);
        listAgency = listAgency.filter(n => n.socketID !== socketID);
        listAgency = JSON.stringify(listAgency);
        caching.set(key, listAgency);
    } catch (e) {
        console.log(e)
    }
}