const config = require("config");
const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
	try {
		const mongoURI = config.get("db.URI");

		const conn = await mongoose.connect(mongoURI, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});

		console.log(`Connected: ${conn.connection.host}`.blue.inverse);
	} catch (error) {
		console.log(error.message);
	}
};

module.exports = connectDB;
