const { DB } = require('../../database');
const { v4: uuidv4 } = require('uuid');
const { validateResult } = require('../../utils/validate_result');

module.exports.ScoketData = {
    // room
    getMemberByRoom,
    getRoom,
    updateRoom,
    deleteRoom,

    // message
    getMessageByRoom,
    saveMessage
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

async function getRoom({user}) {
    try {
        let { agencyID } = user;

        let result = await DB.query(`CALL spstd_api_agency_submission_control_mapping_select(
            :p_agency_id
        )`, {
            replacements: {
                p_agency_id:agencyID || null
            }
        })

        return result;

    } catch (error) {
        return [];
    }
}

async function updateRoom({
    id,
    agencyID,
    submissionControlID,
    remark,
    user
}) {
    try {
        let { id: createBy } = user || {};

        let result = await DB.query(`CALL spstd_api_agency_submission_control_mapping_update(
            :p_id,
            :p_agency_id,
            :p_submission_control_id,
            :p_remark,
            :p_create_by
        )`, {
            replacements: {
                p_id: id || null,
                p_agency_id: agencyID || null,
                p_submission_control_id: submissionControlID || null,
                p_remark: remark || null,
                p_create_by: createBy || null
            }
        })

        return validateResult.query(result);
    } catch (error) {
        return null;  
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

        return result;
    } catch (error) {
        return [];
    }
}

async function saveMessage({data, user}) {
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
                p_submission_control_id: data.submissionControlID || null,
                p_parent_message_id: data.parentMessageID || null,
                p_message: data.message || null,
                p_message_type_id: data.messageTypeID || null,
                p_create_by: createBy || null,
            }
        })

        return validateResult.query(r);

    } catch (error) {
        return null;
    }
}