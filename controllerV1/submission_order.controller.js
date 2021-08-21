const { DB } = require("../database");
const { validateResult } = require("../utils/validate_result");

module.exports.submissionOrderController = {
    updateSubmissionOrder,
    deleteSubmissionOrder,
    getSubmissionOrder
}

async function getSubmissionOrder(req, res, next) {
    try {
        const {
            id
        } = req.query
        

        let result = await DB.query(`CALL spstd_api_submission_order_select_by_submission_control_id(
            :p_id
        )`, {
            replacements: {
                p_id: id || null
            }
        });

        res.json(result);

    } catch (e) {
        const error = Error();
        error.statusCode = 500;
        error.message = e;
        next(e)
    }
}

async function updateSubmissionOrder(req, res, next) {
    try {
        const {
            id,
            groupUuid,
            submissionControlId,
            submissionOrderStatusId,
            userId,
            agencyId,
            remark,
            createBy
        } = req.body;
        const { _id } = req.user || {};
        const createBy = _id;

        const result = await DB.query(`CALL spstd_api_submission_order_update(
            :p_id,
            :p_group_uuid,
            :p_submission_control_id ,
            :p_submission_order_status_id ,
            :p_user_id , 
            :p_agency_id ,
            :p_remark , 
            :p_create_by 
        )`, {
            replacements: {
                p_id: id || null,
                p_group_uuid: groupUuid || null,
                p_submission_control_id: submissionControlId || null,
                p_submission_order_status_id: submissionOrderStatusId || null,
                p_user_id: userId || null,
                p_agency_id: agencyId || null,
                p_remark: remark || null,
                p_create_by: createBy || null
            }
        });

        res.json(validateResult.query(result));
    } catch (e) {
        const error = Error();
        error.statusCode = 500;
        error.message = e;
        next(e)
    }
}

async function deleteSubmissionOrder(req, res, next) {
    try {

        const {
            id
        } = req.query;
        const { _id } = req.user || {};
        const createBy = _id;

        let result = await DB.query(`CALL spstd_api_submission_order_delete_by_id(
            :p_id,
            :p_create_by
        )`, {
            replacements: {
                p_id: id || null,
                p_create_by: createBy || null
            }
        });

        res.json(validateResult.query(result));

    } catch (e) {
        const error = Error();
        error.statusCode = 500;
        error.message = e;
        next(e)
    }
}

