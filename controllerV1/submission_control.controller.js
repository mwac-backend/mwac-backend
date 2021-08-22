const { DB } = require('../database');
const { validateResult } = require('../utils/validate_result');

module.exports.submissionController = {
    updateSubmissionControl,
    getSubmissionControl,
    deleteSubmissionControl
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
        const { _id } = req.user || {};
        const createBy = _id;
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
            agencyId,
            startDate,
            endDate
        } = req.query
        let result = await DB.query(`CALL spstd_api_submission_control_select(
            :p_agency_id,
            :p_start_date,
            :p_end_date
        )`, {
            replacements: {
                p_agency_id: agencyId || null,
                p_start_date: startDate || null,
                p_end_date: endDate || null
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


