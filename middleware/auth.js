const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("./asyncHandler");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

//Make sure user is logged in
exports.protect = async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	}
	//   else if( req.cookies.token) {
	//       token = req.cookies.token;
	//     }

	//checi if token is set
	if (!token) {
		return next(
			new ErrorResponse(
				401,
				`Not authorized`,
				`Must be logged in to access this route`
			)
		);
	}

	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		req.user = await User.findById(payload.id);
		next();
	} catch (err) {
		console.log(err);
		return next(
			new ErrorResponse(
				401,
				`Not authorized`,
				`Must be logged in to access this route`
			)
		);
	}
};

//Authorize roles
exports.authorize =
	(...roles) =>
	(req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new ErrorResponse(
					403,
					`Role ${req.user.role} not authorized to access this route`,
					`Forbidden`
				)
			);
		}
		next();
	};
