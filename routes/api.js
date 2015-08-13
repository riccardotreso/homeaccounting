var express = require('express'),
    router = express.Router(),
    PeopleController = require('../controllers/people'),
    RoomController = require('../controllers/room');


router.post('/v1/people', function(req, res) {
  var message = req.body;
  PeopleController.get(message.name, function(err, doc){

    if(!err && doc != null)
      res.status(200).json({id:doc._id});
    else
      res.status(500).json(err);


  });
});

router.post('/v1/people/insert', function(req, res) {
  var message = req.body;
  PeopleController.insert(message, function(err, doc){

    if(!err){
      res.status(200).json({id:doc._id});
    }
    else{
      res.status(500).json(err);
    }


  });
});

router.post('/v1/transaction/insert', function(req, res) {
  var message = req.body;
  RoomController.insertTransaction(message, function(err, doc){

    if(!err){
      res.status(200).json(doc);
    }
    else{
      res.status(500).json(err);
    }


  });
});


router.post('/v1/transaction/confirm', function(req, res) {
  var message = req.body;
  RoomController.confirmTransactions(message, function(err, doc){

    if(!err){
      res.status(200).json(doc);
    }
    else{
      res.status(500).json(err);
    }


  });
});

router.get('/v1/rooms/:peopleId', function(req, res) {
  var peopleId = req.params.peopleId;

  RoomController.getAllRooms(peopleId, function(err, doc){

    if(!err){
      res.status(200).json(doc);
    }
    else{
      res.status(500).json(err);
    }


  });
});


router.post('/v1/rooms/add', function(req, res){
  var message = req.body;
  RoomController.addRoom(message, function(err, doc){

    if(!err){
      res.status(200).json(doc);
    }
    else{
      res.status(500).json(err);
    }


  });
});

router.post('/v1/rooms/new', function(req, res){
  var message = req.body;
  RoomController.newRoom(message, function(err, doc){

    if(!err){
      res.status(200).json(doc);
    }
    else{
      res.status(500).json(err);
    }


  });
});

module.exports = router;
