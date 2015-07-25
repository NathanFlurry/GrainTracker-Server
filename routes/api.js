var express = require('express');
var router = express.Router();
var request = require('request');
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

/*
  Doritos - 028400091510
  Tropicana - 5022313319513
  Lay's Classic Chips - 028400160148
  Dasani Water - 0049000027624
*/




router.post('/item/barcode/:barcode', function(req, res, next) {
    // Get the barcode
    var barcode = req.params.barcode

    // See if an item with the barcode exists already
    var barcode = req.params.barcode
        db.Item.findOne({ 'barcode': barcode })
        .exec(
            function(err, item) {
                if (err) return next(err);

                // Test if item exists
                if (item != null) {
                    item.quantity += 1

                    item.save(
                        function(err) {
                            if (err) return next(err);

                            res.json(item)
                        }
                    )
                } else {
                    request(
                        'http://world.openfoodfacts.org/api/v0/product/' + barcode + '.json',
                        function(err, response, body) {
                            if (err) return next(err);
                            if (response.statusCode != 200) return next(new Error('Not status 200.'));

                            var data = JSON.parse(body);

                            if (data.status != 1) return next(new Error('Status is not 1.'));

                            // Create the item
                            var item = new db.Item({
                                'quantity': 1,
                                'barcode': barcode,
                                'title': data.product.product_name,
                                'pack-count': 1,

                                'nutrition': { // All in grams
                                    'calories': 500, // TODO: Find a better number for this
                                    'fat': data.product.nutriments.fat,
                                    'cholesterol': 0, // TODO: This
                                    'sodium': data.product.nutriments.sodium,
                                    'carbohydrates': data.product.nutriments.carbohydrates,
                                    'protein': data.product.nutriments.proteins
                                }
                    	   })

                           item.save(function(err) {
                                if (err) return next(err);

                                // Return the new object
                                res.json(item);
                    	   })
                        }
                    )
                }
            }
        )
})

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
