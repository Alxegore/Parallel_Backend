var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: { type: String, required: true, max: 20 },
    password: { type: String, required: true, max: 20 },
    userid: { type: Number, required: true },
});

// Export the model
module.exports = mongoose.model('User', UserSchema);