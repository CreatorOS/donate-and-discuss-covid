var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestSchema = new Schema({
  title: String, 
  resources: String, 
  pol: String,
  handle: String,
  profilePicture: String, 
  timestamp: { type: Date, default: Date.now },
  questId: String,
  tags: [ String ],
});

module.exports.QuestModel = mongoose.model('QuestModel', QuestSchema );
