require("dotenv").config({ path: "./config/config.env" });
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/connecDB");

//Init app
const app = express();

//connect to DB
connectDB();

//Middleware
app.use(express.static("Public")); // Set static folder
app.set("view engine", "ejs"); //Set view engine
app.use(express.urlencoded({ extended: true })); //accept form data
app.use(express.json()); // accept json data
app.use(cors());

//Routes
// app.use("/", require("./routes")); //main page / documentation
app.use("/api/v1/auth", require("./routes/auth")); // authourization routes

//Custom error handler
app.use(require("./middleware/errorHandler"));

//start server
app.listen(process.env.PORT || 5000, () => {
	console.log(
		`Server started in ${process.env.NODE_ENV} on port ${process.env.PORT}`
	);
});
