const { DB } = require('../database');
const {pathMapping} =require("../utils/directory");
module.exports.userController = {
    info
}

async function info(req, res, next) {
    try {
        const { groupID } = req.user;
        
        let result = await DB.query(`CALL spstd_api_permission_select_by_group_id(:p_group_id)`, {
            replacements: {
                p_group_id: groupID || null
            }
        });
       req.user.permission = result;
       req.user['photoPath'] = pathMapping({shortPath: req.user['photoPath'] });

       req.user.permission.forEach(element => {
        element.createByPhotoPath=pathMapping({shortPath: element.createByPhotoPath });
       });

        res.json(req.user)
    } catch (e) {
        const error = Error();
        error.statusCode = 500;
        error.message = e;
        next(error)
    }
}