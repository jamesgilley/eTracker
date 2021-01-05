const inquirer = require('inquirer');
const fs = require('fs');
const util = require('util');
var mysql = require('mysql');
var localStorage = require('local-storage');
const writeFileAsync = util.promisify(fs.writeFile);

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mydb"
});