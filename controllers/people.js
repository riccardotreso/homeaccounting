'use strict';
var mongoose = require('mongoose'),
    People = mongoose.model('People'),
    _ = require('lodash');


exports.getById = function(id, callback){

    People.findOne({_id:new mongoose.Types.ObjectId(id)}, function(err, doc){
       callback(err, doc);
    });

};


exports.get = function(name, callback){

    People.find({name:name}, function(err, doc){
        if(err){
            callback(err, null);
        }
        else{
            if(doc.length > 1){
                callback(null, null);
            }
            else{
                callback(null, doc[0]);
            }
        }
    });
};

exports.insert = function(message, callback){
    var doc = new People();
    doc.name = message.name;
    doc.surname = message.surname;
    doc.email = message.email;

    doc.save(function(err, doc){
        callback(err, doc);
    })
};

exports.insertTransaction = function(message, callback){
    People.findOne({_id: new mongoose.Types.ObjectId(message.id)}, function(err, doc){
        if(!err){
            var newTran = {
                date: new Date(message.date),
                location: message.location,
                amount: parseFloat(message.amount)
            };
            doc.transactions.push(newTran);
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



function checkSharedTransaction(myTransaction){

}