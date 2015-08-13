'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var tran = new Schema({
    date: Date,
    location: String,
    amount: Number,
    status:{
        type: String,
        default: "ins"
    }
});

var people = new Schema({
    peopleId: Schema.ObjectId,
    name:String,
    surname:String,
    transactions: [tran]
});


var room = new Schema({
    name: String,
    peoples: [people]
});

mongoose.model('Room', room);

