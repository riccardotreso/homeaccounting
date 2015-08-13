'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var people = new Schema({
    name: String,
    surname: String,
    email:String

});


mongoose.model('People', people);
