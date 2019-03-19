var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChatSchema = new Schema({
    username: { type: String, required: true, max: 20 },
    userid: { type: Number, required: true },
    message: { type: String, required: true, max: 140 },
    groupid: { type: Number, required: true },
});

// Export the model
module.exports = mongoose.model('Chat', ChatSchema);