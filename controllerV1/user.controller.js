const { DB } = require('../database');

module.exports.userController = {
    info
}

async function info(req, res, next) {
    try {
        res.json(req.user)
    } catch (e) {
        const error = Error();
        error.statusCode = 500;
        error.message = e;
        next(error)
    }
}