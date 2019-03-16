var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConnectionSchema = new Schema({
    username: { type: String, required: true, max: 20 },
    groupid: { type: String, required: true, max: 20 },
});

// Export the model
module.exports = mongoose.model('Connection', ConnectionSchema);