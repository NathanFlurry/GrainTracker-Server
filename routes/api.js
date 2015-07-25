var express = require('express');
var router = express.Router();
var db = require('../database/index.js')

// TODO: Validators to check all values are there when posted
// TODO: Fetch data based on barcode id

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
    .skip(offset)
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
    .skip(offset)
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
  .findById(itemID)
  .exec(function(err, item) {
    if (err) return next(err);

    // Return the item
    res.json(item);
  })
});

router.post('/item', function(req, res, next) {
    // TODO: Find why this is an issue
    // Temporary fix for 'nutrition[protein]': '5',
    req.body['nutrition'] = { }
    for (var index in req.body) {
      var splice = index.split('[')
      if (splice[0] == 'nutrition' && splice.length >= 2) {
        req.body['nutrition'][splice[1].substr(0, splice[1].length - 1)] = req.body[index]
      }
    }

    // Make the new item
    var item = new db.Item(req.body)

    item.save(function(err) {
      if (err) return next(err);

      // Return the new object
      res.json(item);
    })
});

router.post('/item/barcode/:barcode', function(req, res, next) {
    /*// Make the new item
    var item = new db.Item(req.body)

    item.save(function(err) {
      if (err) return next(err);

      // Return the new object
      res.json(item);
    })*/
    // TODO: This
});

router.post('/item/:id/update', function(req, res, next) {
  var itemID = req.params['id']
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

      // TODO: Deal with objects here

      // Change the item
      item[attribute] = data
    }

    // Save the item
    item.save(function(err) {
      if (err) return next(err);

      // Return the new object
      res.json(item)
    })
  })
});

router.delete('/item/:id', function(req, res, next) {
  var itemID = req.params['id']

  // Delete item
  db.Item
  .findById(itemID)
  .remove()
  .exec(function(err, item) {
    if (err) return next(err);

    // Return success
    res.json({ success: true });
  })
});



module.exports = router;
