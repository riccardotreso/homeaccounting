var express = require('express'),
    router = express.Router(),
    UserController = require('../controllers/people'),
    RoomController = require('../controllers/room'),
    baseResponse = require('../config/baseResponse'),
    _ = require('lodash');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', baseResponse);
});



router.get('/room/:peopleId/:roomId', function(req, res) {
  var peopleId = req.params.peopleId,
      roomId = req.params.roomId;

    RoomController.getRoomDetail(peopleId, roomId, function (err, doc) {
      if (err)
        res.render('error', err);
      else
        res.render('room', _.extend({result: doc, userId:peopleId}, baseResponse));
    });


});

router.get('/room/:peopleId', function(req, res) {
  var peopleId = req.params.peopleId;

  res.render('allrooms', _.extend({result: null, userId:peopleId}, baseResponse));

});

router.get('/people/:id', function(req, res) {
  var id = req.params.id;
  RoomController.getPeopleRooms(id, function(err, doc){
    if(err)
      res.render('error', err);
    else
      res.render('user', _.extend({result:doc, userId: id}, baseResponse));
  });
});

router.get('/people', function(req, res) {
  res.render('newuser', baseResponse);
});


module.exports = router;
