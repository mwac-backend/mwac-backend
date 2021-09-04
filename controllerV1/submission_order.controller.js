const { DB } = require("../database");
const { validateResult } = require("../utils/validate_result");
const { v4: uuidv4 } = require("uuid");
const {pathMapping} =require("../utils/directory");

module.exports.submissionOrderController = {
    updateSubmissionOrder,
    deleteSubmissionOrder,
    getSubmissionOrder
}

async function getSubmissionOrder(req, res, next) {
    try {
        const {
            id
        } = req.query
        

        let result = await DB.query(`CALL spstd_api_submission_order_select_by_submission_control_id(
            :p_id
        )`, {
            replacements: {
                p_id: id || null
            }
        });

        for (let index = 0; index < result.length; index++) {
            var data = await DB.query(`CALL spstd_api_submission_order_document_select_by_sub_order_id(
                :p_submission_order_id
            )`, {
                replacements: {
                    p_submission_order_id: result[index].id || null
                }
            });
            data.forEach((e) => {
                e.pathFile = pathMapping({shortPath: e.pathFile});
                e.createByPhotoPath = pathMapping({shortPath: e.createByPhotoPath});
              });

            result[index].createByPhotoPath = pathMapping({shortPath: result[index].createByPhotoPath});
            result[index].submissionOrderDocument = data || [];
        }
        

        res.json(result);

    } catch (e) {
        const error = Error();
        error.statusCode = 500;
        error.message = e;
        next(e)
    }
}

async function updateSubmissionOrder(req, res, next) {
    try {
        const {
            id,
            groupUuid,
            submissionControlId,
            submissionOrderStatusId,
            remark,
            userId,
            agencyId,
            formID
        } = req.body;

        const createBy = req.user.id || {};
        // const agencyId = req.user.agencyID || {};
        const groupUuidCheck = groupUuid || uuidv4();
        const agencyIdCheck = agencyId || req.user.agencyID;

        const result = await DB.query(`CALL spstd_api_submission_order_update(
            :p_id,
            :p_group_uuid,
            :p_submission_control_id ,
            :p_submission_order_status_id ,
            :p_user_id , 
            :p_agency_id ,
            :p_remark , 
            :p_create_by,
            :p_form_id 
        )`, {
            replacements: {
                p_id: id || null,
                p_group_uuid: groupUuidCheck,
                p_submission_control_id: submissionControlId || null,
                p_submission_order_status_id: submissionOrderStatusId || null,
                p_user_id: userId || null,
                p_agency_id: agencyIdCheck || null,
                p_remark: remark || null,
                p_create_by: createBy || null,
                p_form_id: formID || null
            }
        });
          
        if(submissionOrderStatusId === 1){
            const data = await DB.query(`CALL spstd_api_submission_control_status_update(
                :p_id,
                :p_submission_control_status_id
                )`, {
                replacements: {
                    p_id: submissionControlId || null,
                    p_submission_control_status_id: 2
                }
            });
        }

        if(submissionOrderStatusId === 4){
         
                const mapping = await DB.query(`CALL spstd_api_agency_submission_control_mapping_update(
                    :p_id, 
                    :p_agency_id,
                    :p_submission_control_id,
                    :p_remark,
                    :p_agency_submission_control_status_id,
                    :p_create_by
                )`, {
                    replacements: {
                        p_id: null,
                        p_agency_id: agencyIdCheck || null,
                        p_submission_control_id: submissionControlId || null,
                        p_remark: remark || null,
                        p_agency_submission_control_status_id: 1,
                        p_create_by: createBy || null
                    }
                });
        
        }


        res.json(result);
    } catch (e) {
        const error = Error();
        error.statusCode = 500;
        error.message = e;
        next(e)
    }
}

async function deleteSubmissionOrder(req, res, next) {
    try {

        const {
            id
        } = req.query;
        const { _id } = req.user || {};
        const createBy = _id;

        let result = await DB.query(`CALL spstd_api_submission_order_delete_by_id(
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

