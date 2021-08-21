const { DB } = require('../database');
const { validateResult } = require('./../utils/validate_result');

module.exports.submissionController = {
    updateSubmissionControl,
    getSubmissionControl,
    deleteSubmissionControl,
    
    // sub order
    updateSubmission,
    getSubmission,
    deleteSubmission
}

async function updateSubmissionControl(req, res, next) {
    try {
        const {
            id,
            title,
            firstName,
            lastName,
            petition,
            petitionDate,
            office,
            address,
            province,
            district,
            subDistrict,
            postcode,
            submissionControlStatusID,
            agencyID,
        } = req.body;
        const { _id: createBy } = req.user || {};

        let result = await DB.query(`CALL spstd_api_submission_control_update(
            :p_id, 
            :p_title,
            :p_first_name,
            :p_last_name,
            :p_petition,
            :p_petition_date,
            :p_office,
            :p_address,
            :p_province,
            :p_district,
            :p_sub_district,
            :p_postcode,
            :p_submission_control_status_id,
            :p_agency_id,
            :p_create_by
        )`, {
            replacements: {
                p_id: id || null,
                p_title: title || null,
                p_first_name: firstName || null,
                p_last_name: lastName || null,
                p_petition: petition || null,
                p_petition_date: petitionDate || null,
                p_office: office || null,
                p_address: address || null,
                p_province: province || null,
                p_district: district || null,
                p_sub_district: subDistrict || null,
                p_postcode: postcode || null,
                p_submission_control_status_id: submissionControlStatusID || null,
                p_agency_id: agencyID || null,
                p_create_by: createBy || null,
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

async function getSubmissionControl(req, res, next) {
    try {

        const {
            startDate,
            endDate,
            status
        } = req.query
        

        let result = await DB.query(`CALL spstd_api_submission_control_select(
            :p_start_date,
            :p_end_date,
            :p_status
        )`, {
            replacements: {
                p_start_date: startDate || null,
                p_end_date: endDate || null,
                p_status: status || null
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

async function deleteSubmissionControl(req, res, next) {
    try {
        
        const {
            id
        } = req.query;
        const { id: createBy } = req.user || {};

        let result = await DB.query(`CALL spstd_api_submission_control_delete_by_id(
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

// order

async function updateSubmission(req, res, next) { 
    try {
        
        const {
            id,
            submissionControlID,
            submissionStatusID,
            agencyID,
            dutyID,
            remark
        } = req.body;
        const { id: createBy } = req.user || {};

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
        res.json(validateResult.query(result));
    } catch (e) {
        const error = Error();
        error.statusCode = 500;
        error.message = e;
        next(error)
    }
}

async function getSubmission(req, res, next) {
    try {
        
        const {
            submissionControlID
        } = req.query;

        let result = await DB.query(`CALL spstd_api_submission_select_by_submission_control_id(
            :p_submission_control_id
        )`, {
            replacements: {
                p_submission_control_id: submissionControlID || null
            }
        });

        res.json(result);

    } catch (error) {
        const e = Error();
        e.statusCode = 500;
        e.message = error;
        next(e);
    }
}

async function deleteSubmission(req, res, next) {
    try {
        
        const {
            id
        } = req.query
        const { id: createBy } = req.user || {};

        let result = await DB.query(`CALL spstd_api_submission_delete(
            :p_id,
            :p_create_by
        )`, {
            replacements: {
                p_id: id || null,
                p_create_by: createBy || null
            }
        });

        res.json(validateResult.query(result));

    } catch (error) {
        const e = Error();
        e.statusCode = 500;
        next(e);
    }
}