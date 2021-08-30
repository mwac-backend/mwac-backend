const { DB } = require('../database');

module.exports.generalController = {
    getAgency,
    getSubmissionOrderStatus,
    getSubmissionControlStatus,
    getMappingSubmissionControlStatus,
    getUserByAgency
}
async function getAgency(req, res, next) {
    try {
        let result = await DB.query(`CALL spstd_api_agency_select()`);
        res.json(result);
    } catch (e) {
        const error = Error();
        error.statusCode = 500;
        error.message = e;
        next(error);
    }
}

async function getUserByAgency(req, res, next) {
    try {
        const {
            agencyId
        } = req.query
        let result = await DB.query(`CALL spstd_api_users_select_by_agency_id(
            :p_agency_id
        )`, {
            replacements: {
                p_agency_id: agencyId || null
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

async function getSubmissionOrderStatus(req, res, next) {
    try {
        let result = await DB.query(`CALL spstd_api_submission_order_status_select()`);
        res.json(result);
    } catch (e) {
        const error = Error();
        error.statusCode = 500;
        error.message = e;
        next(error);
    }
}
async function getSubmissionControlStatus(req, res, next) {
    try {
        let result = await DB.query(`CALL spstd_api_submission_control_status_select()`);
        res.json(result);
    } catch (e) {
        const error = Error();
        error.statusCode = 500;
        error.message = e;
        next(error);
    }
}

async function getMappingSubmissionControlStatus(req, res, next) {
    try {
        let result = await DB.query(`CALL spstd_api_agency_submission_control_status_select()`);
        res.json(result);
    } catch (e) {
        const error = Error();
        error.statusCode = 500;
        error.message = e;
        next(error);
    }
}