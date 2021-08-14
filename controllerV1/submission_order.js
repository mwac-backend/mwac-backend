const { DB } = require("../database");
const { validateResult } = require("../utils/validate_result");

module.exports.submissionOrder = {
    addSubmissionOrder,
    deleteSubmissionOrder,
    updateSubmissionOrder
}

async function addSubmissionOrder ({
    id,
    submissionControlID,
    submissionStatusID,
    agencyID,
    dutyID,
    remark,
    createBy
}) {
    const result = await DB.query(`CALL spstd_api_submission_update(
        :p_id,
        :p_submission_control_id,
        :p_submission_status_id,
        :p_agency_id,
        :p_duty_id,
        :p_remark,
        :p_create_by
    )`, {
        replacements: {
            p_id: id || null,
            p_submission_control_id: submissionControlID || null,
            p_submission_status_id: submissionStatusID || null,
            p_agency_id: agencyID || null,
            p_duty_id: dutyID || null,
            p_remark: remark || null,
            p_create_by: createBy || null
        }
    });
    validateResult.query(result);
}

async function deleteSubmissionOrder ({

}) {

}

async function updateSubmissionOrder ({

}) {

}