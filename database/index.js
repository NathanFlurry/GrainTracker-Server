var mongoose = require('mongoose');

module.exports.start = function() {
	// Connect to the database
	mongoose.connect('mongodb://localhost/test');

	// Get the database
	var db = mongoose.connection;

	// Events
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {

		// Get the models
		var models = require('./models.js')();

		// Mixin the models
		for (var index in models) {
			module.exports[index] = models[index]
		}
	});
}

module.exports.searchQuery = function(query) {
	return new RegExp(query, 'i')
}
