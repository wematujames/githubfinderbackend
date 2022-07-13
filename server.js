const express = require("express");
const cors = require("cors");
const connectDB = require("./config/connecDB");
const config = require("config");
const colors = require("colors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

//Init app
const app = express();

//connect to DB
connectDB();

//Middleware
app.use(express.static("Public")); // Set static folder
app.set("view engine", "ejs"); //Set view engine
app.use(express.urlencoded({ extended: true })); //accept form data
app.use(express.json()); // accept json data
app.use(cors()); // allow cross orign req
app.use(morgan("dev")); // req logger
app.use(cookieParser());
//Routes
// app.use("/", require("./routes")); //main page / documentation
app.use("/api/v1/auth", require("./routes/auth")); // authourization routes
app.use("/api/v1/searchTerms", require("./routes/searchTerms")); // authourization routes

//Custom error handler
app.use(require("./middleware/errorHandler"));

//start server
app.set("PORT", 5000); // Set app port
app.listen(process.env.PORT || config.get("server.port"), () => {
	console.log(
		`Server started in ${process.env.NODE_ENV} on port ${config.get(
			"server.port"
		)}`.yellow
	);
});
