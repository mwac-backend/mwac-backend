const { DB } = require("../database");
const { validateResult } = require("../utils/validate_result");
const {pathMapping} =require("../utils/directory");

module.exports.submissionOrderDocument = {
    updateOrderDocument,
    getOrderDocument,
    deleteOrderDocument
}

async function getOrderDocument(req, res, next) {
    try {
        const {
            submissionOrderId
        } = req.query
        

        let result = await DB.query(`CALL spstd_api_submission_order_document_select_by_sub_order_id(
            :p_submission_order_id
        )`, {
            replacements: {
                p_submission_order_id: submissionOrderId || null
            }
        });
        result.forEach((e) => {
            e.pathFile = pathMapping({shortPath: e.pathFile});
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
async function updateOrderDocument(req, res, next) {
    console.log(req.body);
    try {
        const {
            id,
            submissionOrderId,
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
             console.log(1,'file detail ==>',imagePathFull,imagePath,fieldName);
           

            await DB.query(`CALL spstd_api_submission_order_document_update(
                :p_id,
                :p_path_file,
                :p_submission_order_id,
                :p_remark,
                :p_create_by
            )`, {
                replacements: {
                    p_id: id || null,
                    p_path_file: imagePath || null,
                    p_submission_order_id: submissionOrderId || null,
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


async function deleteOrderDocument(req, res, next) {
    try {

        const {
            id
        } = req.query;
        const { _id } = req.user || {};
        const createBy = _id;

        let result = await DB.query(`CALL spstd_api_submission_order_document_delete_by_id(
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



