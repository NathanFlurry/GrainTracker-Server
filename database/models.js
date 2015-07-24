var mongoose = require('mongoose');
var bcrypt = require("bcrypt-nodejs")

var hashCount = 10
var salt = bcrypt.genSaltSync(hashCount)

/* Item */
var itemSchema = mongoose.Schema({
	'quantity': Number,
	'barcode': Number,
	'title': String,
	'pack-count': Number
});

/* User */
var userSchema = mongoose.Schema({
	'username': String,
	'display-name': String,
	'password': { type: String, set: function(value) { return bcrypt.hashSync(value, salt); } }
});
userSchema.methods.checkPassword = function(unhashedPassword) {
	return bcrypt.compareSync(unhashedPassword, this.password)
}

/* Export */
module.exports = function() {
	var Item = mongoose.model('Item', itemSchema);
	var User = mongoose.model('User', itemSchema);

	return {
		Item: Item,
		User: User
	}
}
