var express = require('express'),
    router = express.Router(),
    UserController = require('../controllers/people'),
    RoomController = require('../controllers/room');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});



router.get('/room/:peopleId/:roomId', function(req, res) {
  var peopleId = req.params.peopleId,
      roomId = req.params.roomId;

    RoomController.getRoomDetail(peopleId, roomId, function (err, doc) {
      if (err)
        res.render('error', err);
      else
        res.render('room', {result: doc, userId:peopleId});
    });


});

router.get('/room/:peopleId', function(req, res) {
  var peopleId = req.params.peopleId;

  res.render('allrooms', {result: null, userId:peopleId});

});

router.get('/people/:id', function(req, res) {
  var id = req.params.id;


  RoomController.getPeopleRooms(id, function(err, doc){
    if(err)
      res.render('error', err);
    else
      res.render('user', {result:doc, userId: id});
  });
});

router.get('/people', function(req, res) {
  res.render('newuser');
});


module.exports = router;
