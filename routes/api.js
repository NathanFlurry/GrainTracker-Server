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
    var offset = req.params['offset'];
    var count = req.params['count'];

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

router.get('/items/:offset/:count', function(req, res, next) {
    var offset = req.params['offset'];
    var count = req.params['count'];

    // Fetch the data from the database
    db.Item
    .find()
    .sort({
      title: 1
    })
    .limit(count) // TODO: offset
    .exec(function(err, items) {
      if (err) return next(err);
      res.json(items)
    })
});

router.get('/item/:id', function(req, res, next) {
	var itemID = req.params['id']

  // Get the item
  db.Item
  .findOne({
    _id: itemID
  })
  .exec(function(err, item) {
    if (err) return next(err);
    res.json(item);
  })
});

router.post('/item', function(req, res, next) {
    // Make the new item
    var item = new db.Item(req.body)

    item.save(function(err) {
      if (err) return next(err);
      res.json(item);
    })
});

router.post('/item/:id/update', function(req, res, next) {
  var itemID = req.params['id']
  var attribute = req.params['attribute']
  var attributes = req.body

  // Get the item
  db.Item
  .findById(itemID)
  .exec(function(err, item) {
    if (err) return next(err);

    for (var attribute in attributes) {
      // Get the attribute
      var data = attributes[attribute]

      // Check that the attribute exists
      if (db.Item.schema.tree[attribute] == null) return next(Error('Invalid attribute \'' + attribute + '\'.'))

      // Change the item
      item[attribute] = data
    }

    // Save the item
    item.save(function(err) {
      if (err) return next(err);

      // Return success
      res.json(item)
    })
  })
});

router.delete('/items/:id', function(req, res, next) {
    // Delete item
});

module.exports = router;
