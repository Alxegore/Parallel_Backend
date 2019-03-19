var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GroupSchema = new Schema({
    creator: { type: String, required: true, max: 20 },
    groupname: { type: String, required: true, max: 20 },
    groupid: { type: Number, required: true }
});

// Export the model
module.exports = mongoose.model('Group', GroupSchema);