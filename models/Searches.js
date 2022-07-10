const mongoose = require("mongoose");

const userSearchSchema = new mongoose.Schema({
	searchTerm: {
		type: String,
		required: [true, "Search term field cannot be empty."],
		trim: true
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	updatedAt: {
		type: Date,
		default: Date.now
	}
});
module.exports = new mongoose.model("userSearchTerm", userSearchSchema);
