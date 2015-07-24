var express = require('express');
var router = express.Router();

// Base API
router.get('/', function(req, res, next) {
  res.send('This is the GrainTrack API.');
});

router.get('/items/:search-key/:offset/:count', function(req, res, next) {
    // Get items
});

router.get('/items/:id', function(req, res, next) {
	// Return item of that id
});

router.post('/items', function(req, res, next) {
    // Add an item
});

router.post('/items/:id/:attribute', function(req, res, next) {
    // Change item count attribute, 404 if invalid attribute
});

router.delete('/items/:id', function(req, res, next) {
    // Delete item
});

module.exports = router;
