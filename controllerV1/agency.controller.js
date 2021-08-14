const { DB } = require('../database');

module.exports.agencyController = {
    getAgency
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