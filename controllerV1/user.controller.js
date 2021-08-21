const { DB } = require('../database');

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
        res.json(req.user)
    } catch (e) {
        const error = Error();
        error.statusCode = 500;
        error.message = e;
        next(error)
    }
}