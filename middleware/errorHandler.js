const {DatabaseError} = require('sequelize');

module.exports = (error, req, res, next) => {
    try {
        const status = error.statusCode || 500;
        const message = error.message;
        const detail = error.detail;
        const data = {
            status: status,
            message: message,
            detail: detail,
        };
        if (message instanceof DatabaseError) {
            data.message = message.message;
        } else if (message instanceof Error) {
            data.message = message.message;
        }
        const {transaction} = req.body;
        try {
            if (transaction) transaction.rollback();
        } catch (error) {
        }
        console.error(data);
        return res.status(status).json(data);
    } catch (e) {
        console.error(e);
        return res.status(500).json(e);
    }
};
