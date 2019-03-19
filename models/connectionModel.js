var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConnectionSchema = new Schema({
    username: { type: String, required: true, max: 20 },
    userid: { type: String, required: true, max: 30 },
    groupid: { type: String, required: true, max: 30 },
});

// Export the model
module.exports = mongoose.model('Connection', ConnectionSchema);