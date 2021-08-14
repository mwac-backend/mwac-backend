const { DB } = require('../database');
const bcryptjs = require('bcryptjs');
const {validateResult} = require('../utils/validate_result')
module.exports.oauthController = {
    login,
    createAccount
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


async function createAccount(req, res, next) {
    try {
        
        const {
            id,
            username,
            password,
            citizenID,
            titleNameTH,
            firstNameTH,
            lastNameTH,
            titleNameEN,
            firstNameEN,
            lastNameEN,
            dob,
            phoneNumber,
            group_id
        } = req.body;
        const { _id } = req.user || {}
        const createBy = _id || null;

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        let result = await DB.query(`CALL spstd_api_users_update(
            :p_id, 
            :p_username,
            :p_password, 
            :p_citizen_id,
            :p_title_name_th,
            :p_first_name_th,
            :p_last_name_th,
            :p_title_name_en,
            :p_first_name_en,
            :p_last_name_en,
            :p_dob,
            :p_phone_number,
            :p_group_id,
            :p_create_by
        )`, {
            replacements: {
                p_id: id || null, 
                p_username: username || null,
                p_password: hashedPassword || null, 
                p_citizen_id: citizenID || null,
                p_title_name_th: titleNameTH || null,
                p_first_name_th: firstNameTH || null,
                p_last_name_th: lastNameTH || null,
                p_title_name_en: titleNameEN || null,
                p_first_name_en: firstNameEN || null,
                p_last_name_en: lastNameEN || null,
                p_dob: dob || null,
                p_phone_number: phoneNumber || null,
                p_group_id: group_id || null,
                p_create_by: createBy || null,
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