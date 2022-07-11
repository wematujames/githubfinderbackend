module.exports = (err, req, res, next) => {
	// console.log(err.stack);
	const error = { ...err, name: err.name, message: err.message };

	//Invalid object id error
	if (error.name === "CastError") {
		error.message = `Invalid object id ${error.value} specified.`;
		return res.status(400).json({
			msg: error.message || "Server error",
			err: err || "Server error"
		});
	}

	res.status(err.statusCode || 500).json({
		success: false,
		msg: error.message || "Server error",
		error: error || "Server error"
	});
};
