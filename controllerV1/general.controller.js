const { DB } = require('../database');

module.exports.generalController = {
    getAgency,
    getSubmissionOrderStatus,
    getSubmissionControlStatus
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