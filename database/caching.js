const redis = require('redis');
const { promisify } = require("util");
const RDS_PORT = 6379; // Port number
const RDS_HOST = "127.0.0.1"; // Server IP

const client = connect();

client.on("error", function(error) {
    console.error(error);
});

const asyncGet = promisify(client.get).bind(client);

module.exports = {
    caching : client,
    asyncGet
};


function connect() {
    const client = redis.createClient(RDS_PORT, RDS_HOST, {
        db: 0,
        auth_pass: "",
        password: "",
        port: RDS_PORT,
        host: RDS_HOST,
    });


    client.on('error', function (error) {
        console.error(error);
    });

    client.on('subscribe', (channel, count) => {
        console.log(channel);
        console.log(count);
    });

    return client;
}
