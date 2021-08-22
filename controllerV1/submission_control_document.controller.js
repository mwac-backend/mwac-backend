const { DB } = require("../database");
const { validateResult } = require("../utils/validate_result");

module.exports.submissionControllerDocument = {
    updateControlSubmissionDocument,
    getControlSubmissionDocument,
    deleteControlSubmissionDocument
}


async function getControlSubmissionDocument(req, res, next) {
    try {
        const {
            submissionControlId
        } = req.query
        

        let result = await DB.query(`CALL spstd_api_submission_control_document_select_by_sub_control_id(
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

// pathFile,
async function updateControlSubmissionDocument(req, res, next) {
    console.log(req.body);
    try {
        const {
            id,
            submissionControlId,
            remark,
            fileMiddleware,
        } = req.body;
        const { _id } = req.user || {};
        const createBy = _id;


        for (let i = 0; i < fileMiddleware.length; i++) {
            const {
                imagePathFull,
                imagePath,
                fieldName,
            } = fileMiddleware[i];
             console.log(i,'file detail ==>',imagePathFull,imagePath,fieldName);
           

            await DB.query(`CALL spstd_api_submission_control_document_update(
                :p_id,
                :p_path_file,
                :p_submission_control_id,
                :p_remark,
                :p_create_by
            )`, {
                replacements: {
                    p_id: id || null,
                    p_path_file: imagePath || null,
                    p_submission_control_id: submissionControlId || null,
                    p_remark: remark || null,
                    p_create_by: createBy || null,
                },
            });
        }
        return res.json({
            success:1,
            message:"success"
        });
    } catch (err) {
        next(err);
    }
}


async function deleteControlSubmissionDocument(req, res, next) {
    try {

        const {
            id
        } = req.query;
        const { _id } = req.user || {};
        const createBy = _id;

        let result = await DB.query(`CALL spstd_api_submission_control_document_delete_by_id(
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



