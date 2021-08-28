const { DB } = require('../database');
const { validateResult } = require('../utils/validate_result');

module.exports.mappingSubmissionController = {
    updateMappingSubmissionController,
    getListAgencyBySubmissionControl,
    getListMappingSubmissionControlByAgency
}

async function updateMappingSubmissionController(req, res, next) {
    try {
        const {
            id,
            agencyId,
            submissionControlId,
            remark,
            mappingSubmissionControlStatusId
        } = req.body;
        const createBy = req.user.id || null;
        let result = await DB.query(`CALL spstd_api_agency_submission_control_mapping_update(
            :p_id, 
            :p_agency_id,
            :p_submission_control_id,
            :p_remark,
            :p_agency_submission_control_status_id,
            :p_create_by
        )`, {
            replacements: {
                p_id: id || null,
                p_agency_id: agencyId || null,
                p_submission_control_id: submissionControlId || null,
                p_remark: remark || null,
                p_agency_submission_control_status_id: mappingSubmissionControlStatusId || null,
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

async function getListAgencyBySubmissionControl(req, res, next) {
    try {
        const {
            submissionControlId
        } = req.query
        
        let result = await DB.query(`CALL spstd_api_agency_select_by_submission_control_id(
            :p_submission_control_id
        )`, {
            replacements: {
                p_submission_control_id: submissionControlId || null
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

async function getListMappingSubmissionControlByAgency(req, res, next) {
    try {
        const {
            endDate,
            startDate
        } = req.query

         const agencyId = req.user.agencyID;

        let result = await DB.query(`CALL spstd_api_agency_submission_control_mapping_select_by_agency_id(
            :p_agency_id,
            :p_start_date,
            :p_end_date
        )`, {
            replacements: {
                p_start_date: startDate || null,
                p_end_date: endDate || null,
                p_agency_id: agencyId || null,
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

