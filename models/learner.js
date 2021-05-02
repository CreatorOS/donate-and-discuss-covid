var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LearnerSchema = new Schema({
  email: String, 
  questId: String,
  submission: String,
  owner: String,
  picture: String,
  timestamp: Number,
});

module.exports.LearnerModel = mongoose.model('LearnerModel', LearnerSchema );
