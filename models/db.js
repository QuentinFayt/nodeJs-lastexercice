const mysql      = require("mysql");
const con        = require("../config/config");
const connection = mysql.createConnection({
    host    : con.DB_HOST,
    user    : con.DB_USER,
    password: con.DB_PASSORD,
    database: con.DB_NAME,
    port    : con.DB_PORT,
});
connection.connect();
module.exports = connection;