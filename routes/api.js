var express = require('express');
var router = express.Router();

// Base API
router.get('/', function(req, res, next) {
  res.send('This is the GrainTrack API.');
});

router.get('/api/items/:search-key/:offset/:count', function(req, res, next) {
    // Get items
});

router.get('/api/items/:id', function(req, res, next) {
	// Return item of that id
});

router.post('/api/items', function(req, res, next) {
    // Add an item
});

router.put('/api/items/:id/:attribute', function(req, res, next) {
    // Change item count attribute, 404 if invalid attribute
});

router.delete('/api/items/:id', function(req, res, next) {
    // Delete item
});

module.exports = router;


/*
Item object:
{
	"id": 123456,
	"barcode-id": 123456, // Might not exist
	"title": "ABC",
	"pack-count": 32
}
*/