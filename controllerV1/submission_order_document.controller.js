const { DB } = require("../database");
const { validateResult } = require("../utils/validate_result");

module.exports.submissionOrderDocument = {
    updateOrderDocument
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
                    p_path_file: imagePathFull || null,
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
