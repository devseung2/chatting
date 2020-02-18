const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    id: String,
    pw: String
});

module.exports = mongoose.model('User', UserSchema);