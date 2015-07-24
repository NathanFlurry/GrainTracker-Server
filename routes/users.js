var express = require('express');
var router = express.Router();

router.post('/login', function(req, res, next) {
	// Login
});

router.post('/sigup', function(req, res, next) {
	// Sign up the user
});


module.exports = router;

/*
User object:
{
	"username": "ABC", // unique
	"display-name": "ABC DEF",
	"password": "ABC DEF" // hashed bcrypt, 10 times // not sent to client
}
*/