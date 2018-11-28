var mysql     = require('mysql');
var Schema       = mysql.Schema;

var ClientSchema   = new Schema({
    Lastname: String,
	Firstname: String,
	Middlename: String
});

module.exports = mysql.model('Client', ClientSchema);