var express = require('express');
var router = express.Router();
var db = require('../database/index.js')

/*router.post('/login', function(req, res, next) {
	// Data
	var username = req.body.username
	var password = req.body.password

	var user = db.User.fineOne({ username: username }, 'username display-name', function(err, person) {
		if (err) res.error(err);
		if (person.checkPassword(password)) {

		}
	})
});

router.post('/sigup', function(req, res, next) {
	// Sign up the user
});*/

// TODO: This


module.exports = router;

/*
User object:
{
	"username": "ABC", // unique
	"display-name": "ABC DEF",
	"password": "ABC DEF" // hashed bcrypt, 10 times // not sent to client
}
*/
