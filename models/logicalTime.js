var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var logicalTimeSchema = new Schema({
    logicalTime: { type: Number, required: true }
});

// Export the model
module.exports = mongoose.model('logicalTime', logicalTimeSchema);