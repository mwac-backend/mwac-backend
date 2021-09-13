const DB = require('./main_db');
const { asyncGet, caching } = require('./caching');

module.exports = {
    DB,
    caching,
    cachingGet: asyncGet,
}
