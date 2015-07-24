var express = require('express');
var router = express.Router();
var db = require('../database/index.js')

// Constants
var offset =

// Base API
router.get('/', function(req, res, next) {
  res.send('This is the GrainTrack API.');
});

router.get('/items/:searchkey/:offset/:count', function(req, res, next) {
    var searchKey = req.params['searchkey'];
    var offset = req.params['offset']
    var count = req.params['count']

    // Fetch the data from the database
    db.Item
    .find({
      'title': db.searchQuery(searchKey)
    })
    .sort({
      title: 1
    })
    .limit(count) // TODO: offset
    .exec(function(err, items) {
      if (err) return next(err);
      res.json(items)
    })
});

router.get('/items/:id', function(req, res, next) {
	// Return item of that id
});

router.post('/item', function(req, res, next) {
    // Make the new item
    var item = new db.Item(req.body)

    item.save(function(err) {
      if (err) return next(err);
      res.json(item);
    })
});

router.post('/items/:id/:attribute', function(req, res, next) {
    // Change item count attribute, 404 if invalid attribute
});

router.delete('/items/:id', function(req, res, next) {
    // Delete item
});

module.exports = router;
