const { DB } = require('../database');
const bcryptjs = require('bcryptjs');
const {validateResult} = require('../utils/validate_result')
module.exports.oauthController = {
    login,
    updateAccount
}

async function login(req, res, next) {
    try {

        const {
            username,
            password
        } = req.body;

        let userExistsResult = await DB.query(`CALL spstd_api_check_username(:p_username)`, {
            replacements: {
                p_username: username
            }
        });

        const userexists = userExistsResult[0];
        if (!userexists) throw 'Username or password is wrong';
        
        const validPass = await bcryptjs.compare(password, userexists.password);
        if (!validPass) throw 'Password is incorrect';
        userexists.password = undefined;
        req.user = userexists;
        next();
    
    } catch (e) {
        const error = Error();
        error.statusCode = 500;
        error.message = e;
        next(error);
    }
}


async function updateAccount(req, res, next) {
    try {
        
        const {
            id,
            username,
            password,
            title,
            name,
            surname,
            email,
            phoneNumber,
            groupID
        } = req.body;
        const { id: createBy } = req.user || {}

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        let result = await DB.query(`CALL spstd_api_users_update(
            :p_id, 
            :p_username,
            :p_password, 
            :p_title,
            :p_name,
            :p_surname,
            :p_email,
            :p_phone_number,
            :p_group_id,
            :p_create_by
        )`, {
            replacements: {
                p_id: id || null,
                p_username: username || null,
                p_password: hashedPassword || null, 
                p_title: title || null,
                p_name: name || null,
                p_surname: surname || null,
                p_email: email || null,
                p_phone_number: phoneNumber || null,
                p_group_id: groupID || null,
                p_create_by: createBy || null
            }
        });

        res.json(validateResult.query(result))
    } catch (e) {
        const error = Error();
        error.statusCode = 500;
        error.message = e;
        next(error);
    }
}