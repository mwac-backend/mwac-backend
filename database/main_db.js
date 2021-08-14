const {Sequelize} = require('sequelize');
const {
    username,
    password,
    host,
    port,
    database,
} = require('../config/index');
const sequelize = new Sequelize(database, username, password, {
    host: host,
    port: port,
    dialect: 'mysql',
    timezone: '+07:00',
    logging: true,
    database: database,
});
try {
    sequelize
        .authenticate()
        .then(async () => {
            console.log(`Connect database ${database} successful`);
        })
        .catch((err) => {
        });
} catch (error) {
    console.error(`Unable to connect to the database ${database}:`);
    console.log(error);
}

module.exports = sequelize;
