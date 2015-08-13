'use strict';

var mongoose = require('mongoose'),
    Room = mongoose.model('Room'),
    _ = require('lodash'),
    PeopleController = require('../controllers/people');


exports.getPeopleRooms = function(peopleId, callback){
    var query = {"peoples.peopleId": new mongoose.Types.ObjectId(peopleId)};

    searchRoomAndCount(query, callback);
};


exports.getRoomDetail = function(peopleId, roomId, callback){
    var peopleDoc,
        result = {};


    Room.findOne({_id:new mongoose.Types.ObjectId(roomId)}, function(err, doc){
        if(err){
            callback(err, null);
        }
        else{

            peopleDoc = _.find(doc.peoples, {peopleId: new mongoose.Types.ObjectId(peopleId)});
            if(peopleDoc) {

                //Controlla le transazioni condivise
                result.transactionInSharing = _.where(peopleDoc.transactions, {status: 'insharing'}).length > 0;
                //filtra sulle transazioni inserite
                result.transactions = _.where(peopleDoc.transactions, {status: 'ins'});
                result.roomId = roomId;
                result.roomName = doc.name;
                result.peopleName = peopleDoc.name;
                result.peopleId = peopleId;

                callback(null, result);
            }
            else{
                callback(null, null);
            }
        }
    });

};

exports.insertTransaction = function(message, callback){
    var peopleDoc;

    Room.findOne({_id: new mongoose.Types.ObjectId(message.roomId)}, function(err, doc){
        if(!err){
            var newTran = {
                date: new Date(message.date),
                location: message.location,
                amount: parseFloat(message.amount)
            };

            peopleDoc = _.find(doc.peoples, {peopleId: new mongoose.Types.ObjectId(message.peopleId)});


            peopleDoc.transactions.push(newTran);

            doc.save(function(err, doc){
                if(!err){
                    callback(null, newTran);
                }
                else{
                    callback(err, null);
                }

            });
        }
        else{
            callback(err, null);
        }


    });
};

exports.confirmTransactions = function(message, callback){
    var peopleDoc,
        myTransaction;

    Room.findOne({_id: new mongoose.Types.ObjectId(message.roomId)}, function(err, doc){
        if(err)
            callback(err, null);
        else {
            peopleDoc = _.find(doc.peoples, {peopleId: new mongoose.Types.ObjectId(message.peopleId)});
            myTransaction = _.where(peopleDoc.transactions, {status: 'ins'});

            _.forEach(myTransaction, function (value, index) {
                _.find(peopleDoc.transactions, {_id: value._id}).status = 'insharing';
            });

            doc.save();

            var result = {status:"ok"};
            callback(err, result);
        }

    });
};


exports.getAllRooms = function(peopleId, callback){
    var query = {
        "peoples.peopleId":{
            $nin:[new mongoose.Types.ObjectId(peopleId)]
        }
    };

    searchRoomAndCount(query, function(err, docs){
        //add empty room
        Room.aggregate(
            {$match:{peoples:{$size:0}}},
            {$project:{_id:0,
                id:"$_id",
                name:"$name",
                count:{$add:0}}}
        ).exec(function(err, list){
                var wrapped = _(docs).concat(list);
                callback(err, wrapped);
            });
    });
};

exports.newRoom = function(message, callback){
    var room = new Room();
    room.name = message.name;
    room.peoples = [];

    room.save(function(err, doc){
        if(!err){
            var result = {
                id: doc._id,
                name: doc.name,
                count: 0
            };
            callback(err, result);
        }
        else{
            callback(err, null);
        }
    });
};

exports.addRoom = function(message, callback){

    PeopleController.getById(message.peopleId, function(err, people){
        if(!err) {
            Room.findOne({_id: new mongoose.Types.ObjectId(message.roomId)}, function (err, room) {
                room.peoples.push({
                    peopleId: people._id,
                    name: people.name,
                    surname: people.surname,
                    transactions: []
                });

                room.save(function (err, doc) {
                    if (!err) {
                        var result = doc;
                        result.peoples = [];
                        callback(err, result);
                    }
                    else {
                        callback(err, null);
                    }
                });
            })
        }
    });

};




/*Private Methods*/

function searchRoomAndCount(query, callback){
    Room.aggregate(
        {$match : query},
        {$unwind : "$peoples" },
        {$group:
        {
            _id:{
                roomId: "$_id",
                name: "$name"
            },
            count:{
                $sum:1
            }
        }
        },
        {$project:
        {
            _id:0,
            id:"$_id.roomId",
            name:"$_id.name",
            count:"$count"
        }
        },
        {$sort:{name:1}}
    ).exec(function(err, docs){
            callback(err, docs);
        });
}