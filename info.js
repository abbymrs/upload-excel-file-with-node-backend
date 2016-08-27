var mongoose = require('mongoose');

var infoSchema = mongoose.Schema({
	'姓名': String,
	'性别': String,
	'年龄': Number,
	'工作': String,
	'工资': Number,
	'工作年限': Number
});
var Info = mongoose.model('Info', infoSchema);
module.exports = Info;