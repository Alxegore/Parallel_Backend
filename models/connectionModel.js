var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConnectionSchema = new Schema({
    username: { type: String, required: true, max: 20 },
    userid: { type: Number, required: true },
    groupid: { type: Number, required: true },
});

// Export the model
module.exports = mongoose.model('Connection', ConnectionSchema);