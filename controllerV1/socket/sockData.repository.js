const { DB } = require('../../database');
const { v4: uuidv4 } = require('uuid');
const { validateResult } = require('../../utils/validate_result');
const {pathMapping} = require("../../utils/directory");

module.exports.SocketData = {
    // room
    getMemberByRoom,
    deleteRoom,

    // message
    getMessageByRoom,
    saveMessage,

    // notification
    updateNotification,
    getNotification,
    getLastSeenNotificationByUserID,
    updateLastSeenNotificationByUserID,

    // info
    getAgencyBySubmissionControl,
    getUserByAgencyID,
}

async function getMemberByRoom({submissionControlID}) {
    try {
        
        let result = await DB.query(`CALL spstd_member_submission_control_select_by_submission_control_id(
            :p_submission_control_id
        )`, {
            replacements: {
                p_submission_control_id: submissionControlID || null
            }
        });

        return result

    } catch (error) {
        return []
    }
}

async function deleteRoom({id, submissionControlID, user}) {
    try {
        
        const { id: createBy } = user || {};

        let result = await DB.query(`CALL spstd_api_agency_submission_control_mapping_delete_by_id(
            :p_id,
            :p_submission_control_id,
            :p_create_by
        )`, {
            replacements: {
                p_id: id || null,
                p_submission_control_id: submissionControlID || null,
                p_create_by: createBy || null
            }
        })

        return validateResult.query(result)

    } catch (error) {
        return null;
    }
}

async function getMessageByRoom({submissionControlID, startDate, endDate}) {
    try {
        
        let result = await DB.query(`CALL spstd_api_message_select_by_submission_control_id(
            :p_submission_control_id,
            :p_start_date,
            :p_end_date
        )`, {
            replacements: {
                p_submission_control_id: submissionControlID || null,
                p_start_date: startDate || null,
                p_end_date: endDate || null
            }
        });
        result.forEach(n => {
            n.createByPhotoPath = pathMapping({shortPath: n.createByPhotoPath})
        })

        return result;
    } catch (error) {
        return [];
    }
}

async function saveMessage({data, user, submissionControlID}) {
    try {
        
        const { id: createBy } = user;

        const r = await DB.query(`CALL spstd_api_message_update(
            :p_id,
            :p_submission_control_id,
            :p_parent_message_id,
            :p_message,
            :p_message_type_id,
            :p_create_by
        )`, {
            replacements: {
                p_id: null,
                p_submission_control_id: submissionControlID || null,
                p_parent_message_id: data.parentMessageID || null,
                p_message: data.message || null,
                p_message_type_id: data.messageTypeID || null,
                p_create_by: createBy || null,
            }
        })

        return validateResult.query(r)

    } catch (error) {
        return null;
    }
}

async function getAgencyBySubmissionControl(submissionControlID) {
    try {

        const r = await DB.query(`CALL spstd_api_agency_select_by_submission_control_id(
            :p_submission_control_id
        )`, {
            replacements: {
                p_submission_control_id: submissionControlID || null
            }
        });

        return r;
    } catch (error) {
        return [];
    }
}

async function getUserByAgencyID(agencyID) {
    try {

        const r = await DB.query(`CALL spstd_api_users_select_by_agency_id(
            :p_agency_id
        )`, {
            replacements: {
                p_agency_id: agencyID || null
            }
        });

        return r;

    } catch (error) {
        return [];
    }
}

async function updateNotification({id, title, subTitle, remark, isRead, user, submissionControlID, agencyID, userID}) {
    try {

        const { id: createBy } = user;

        const r = await DB.query(`CALL spstd_api_notification_submission_control_update(
            :p_id,
            :p_title,
            :p_sub_title,
            :p_remark,
            :p_submission_control_id,
            :p_user_id,
            :p_agency_id,
            :p_is_read,
            :p_create_by
        )`, {
            replacements: {
                p_id: id || null,
                p_title: title || null,
                p_sub_title: subTitle || null,
                p_remark: remark || null,
                p_submission_control_id: submissionControlID || null,
                p_user_id: userID || null,
                p_agency_id: agencyID || null,
                p_is_read: isRead || null,
                p_create_by: createBy || null
            }
        });

        return validateResult.query(r);

    } catch (error) {
        console.log(error)
        return null;
    }
}

async function getNotification({userID, startDate, endDate}) {
    try {

        const r = await DB.query(`CALL spstd_api_notification_submission_control_select_by_user_id(
            :p_user_id,
            :p_start_date,
            :p_end_date
        )`, {
            replacements: {
                p_user_id: userID || null,
                p_start_date: startDate || null,
                p_end_date: endDate || null
            }
        });

        return r;
    } catch (error) {
        return [];
    }
}

async function getLastSeenNotificationByUserID({userID}) {
    try {
        let r = await DB.query(`CALL spstd_api_notification_last_seen_select_by_user_id(
            :p_user_id
        )`, {
            replacements: {
                p_user_id: userID || null
            }
        });

        r = r[0] || {};
        if(r.lastSeen) return r.lastSeen
        else return r;
    } catch (error) {
        return null;
    }
}

async function updateLastSeenNotificationByUserID({userID}) {
    try {

        let r = await DB.query(`CALL spstd_api_notification_last_seen_update_by_user_id(
            :p_user_id
        )`, {
            replacements: {
                p_user_id: userID || null
            }
        });

        r = r[0] || {};
        return r;
    } catch (error) {
        return {
            success: 0,
            message: error
        };
    }
}