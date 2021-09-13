const { DB } = require('../database');
const {pathMapping} =require("../utils/directory");

module.exports.generalController = {
    getAgency,
    getSubmissionOrderStatus,
    getSubmissionControlStatus,
    getMappingSubmissionControlStatus,
    getUserByAgency,
    getCategoryPetition
}
async function getAgency(req, res, next) {
    try {
        let result = await DB.query(`CALL spstd_api_agency_select()`);

        // result.forEach((e) => {
        //     e.createByPhoto = pathMapping({shortPath: e.createByPhoto});
        //   });


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

        result.forEach((e) => {
            e.phtoPath = pathMapping({shortPath: e.phtoPath});
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
        result.forEach((e) => {
            e.createByPhotoPath = pathMapping({shortPath: e.createByPhotoPath});
          });

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

        result.forEach((e) => {
            e.createByPhotoPath = pathMapping({shortPath: e.createByPhotoPath});
          });
          
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

        result.forEach((e) => {
            e.createByPhotoPath = pathMapping({shortPath: e.createByPhotoPath});
          });

        res.json(result);
    } catch (e) {
        const error = Error();
        error.statusCode = 500;
        error.message = e;
        next(error);
    }
}

async function getCategoryPetition(req, res, next) {
    try {
        let result = await DB.query(`CALL spstd_api_category_petition_select()`);

        result.forEach((e) => {
            e.createByPhoto = pathMapping({shortPath: e.createByPhoto});
          });


        res.json(result);
    } catch (e) {
        const error = Error();
        error.statusCode = 500;
        error.message = e;
        next(error);
    }
}