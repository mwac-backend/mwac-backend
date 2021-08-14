const jwt = require('jsonwebtoken');
const {jwtSecret} = require('../config/index');

module.exports.tokenUtils = {
    generateToken,
    sendToken
}

async function generateToken(req, res, next) {
    try {
        const t = await createToken(req);

        req.token = t;
    } catch (e) {
        req.errormsg = err;
    }
    return next();
}

async function sendToken(req, res, next) {
    if (!req.token) {
        const err = Error(req.errormsg);
        err.message = req.errormsg;
        err.statusCode = 400;
        return next(err);
    }
    const accessToken = {
        auth: true,
        accessToken: req.token,
    }
    return res.status(200).json(accessToken);
}

async function createToken(req) {
    const token = jwt.sign({username: req.user.username}, jwtSecret, {
        expiresIn: '24h',
    });
    return token
}