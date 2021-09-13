// repository
const {SocketData} = require("./socket_data");
const { authValidation } = require('../../middleware/auth.validation.middleware');
const { caching, cachingGet } = require('../../database');

module.exports.notificationSocket = {
    notificationSocketController
}

function notificationSocketController(io) {
    io.use(authValidation.validJWTSocketNeeded);
    io.on('connection', async (socket) => {

        const user = socket.user;

        await setListAgency(user.agencyID, socket.id);
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
                    socket.to(listAgencySocketID[n]).emit('on-create-notification', {
                        title,
                        subTitle,
                        remark
                    });
                }

                // step 3
                // save notification every people in agency
                for (let n = 0; n < userList.length; n++) {
                    const r = await SocketData.updateNotification({
                        title,
                        subTitle,
                        submissionControlID,
                        agencyID: agencyList[i].id,
                        userID: userList[n].id,
                        remark
                    });
                }

            }

        });

        socket.on('get-notifications', async (data) => {

            // socket.emit('on-get-notifications')
        });

        socket.on('is-read-notifications', async (data) => {

            // socket.emit('on-is-read-notifications')
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

async function setListAgency(key, value) {
    try {
        let listAgency = await cachingGet(key) || '[]';
        listAgency = JSON.parse(listAgency);
        listAgency.push(value);
        listAgency = JSON.stringify(listAgency);
        console.log(listAgency)
        caching.set(key, listAgency);
    } catch (e) {
        console.log(e)
    }
}

async function delListAgencyBySocketID(key, value) {
    try {
        let listAgency = await cachingGet(key) || '[]';
        listAgency = JSON.parse(listAgency);
        listAgency = listAgency.filter(n => n !== value);
        listAgency = JSON.stringify(listAgency);
        caching.set(key, listAgency);
    } catch (e) {
        console.log(e)
    }
}