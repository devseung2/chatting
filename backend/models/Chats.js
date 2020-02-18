const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
	id : String,
	msg : String,
	channel : String,
	date : { type: Date, default: Date.now  }
});

module.exports = mongoose.model('Chat', ChatSchema);