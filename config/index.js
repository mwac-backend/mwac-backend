const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    dialect: 'mysql',
    jwtSecret: process.env.JWT_SECRET,
};
