const sendMail = require("../utils/sendMail"),
	User = require("../models/User"),
	crypto = require("crypto"),
	ErrorResponse = require("../utils/ErrorResponse"),
	asyncHandler = require("../middleware/asyncHandler"),
	{ passResetEmailTemplate } = require("../utils/templates");

//Desc                      //Register new user
//Route                     //POST /api/v1/auth/register
//Require Auth              //False
exports.registerUser = asyncHandler(async (req, res, next) => {
	const user = await await User.create(req.body);

	sendTokenResponse(201, user, res, "Registration Successful");
});

//Desc                      //Login user
//Route                     //POST /api/v1/auth/login
//Require Auth              //False
exports.loginUser = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;
	//Check if email and password were provided
	if (!email || !password) {
		return next(
			new ErrorResponse(
				400,
				`Please enter email and password`,
				`One or more fields not completed`
			)
		);
	}

	//Check for user in DB
	const user = await User.findOne({ email }).select("+password");
	if (!user) {
		return next(
			new ErrorResponse(
				400,
				`Invalid credentials`,
				"Invalid email/password"
			)
		);
	}

	//Check if passwords match
	const passMatch = await user.matchPassword(password);
	if (!passMatch) {
		return next(
			new ErrorResponse(
				400,
				`Invalid credentials`,
				"Invalid email/password"
			)
		);
	}

	sendTokenResponse(200, user, res, "Login Successful");
});

//Desc                      //Get logged in user
//Route                     //POST /api/v1/auth/me
//Require Auth              //True
exports.getMe = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id);

	res.status(200).json({
		succees: true,
		data: user
	});
});

//Desc                      //Forgot password
//Route                     //POST /api/v1/auth/forgotpassord
//Require Auth              //False
exports.forgotPassword = asyncHandler(async (req, res, next) => {
	// check if email was provided
	if (!req.body.email) {
		return next(
			new ErrorResponse(400, `Please enter an email`, `No email provided`)
		);
	}
	const user = await User.findOne({ email: req.body.email });

	if (!user) {
		return next(
			new ErrorResponse(
				400,
				`Email not found`,
				`Email provided doesn't exist in DB`
			)
		);
	}

	const resetToken = user.passResetToken();

	await user.save({ validateBeforeSave: false });

	const options = {
		receiver: req.body.email,
		subject: "Password Reset",
		html: passResetEmailTemplate(req, resetToken)
	};

	try {
		await sendMail(options);
		res.status(200).json({
			success: true,
			msg: "Email sent",
			user
		});
	} catch (error) {
		console.log(error);
		user.passwordResetToken = undefined;
		user.passwordResetTokenExpiration = undefined;
		await user.save({ validateBeforeSave: false });
	}
});

//Desc                      //Get logged in user
//Route                     //PUT /api/v1/auth/resetpassword/:resettoken
//Require Auth              //False
exports.resetPassword = asyncHandler(async (req, res, next) => {
	const resetToken = crypto
		.createHash("sha256")
		.update(req.params.resettoken)
		.digest("hex");

	const user = await User.findOne({
		passwordResetToken: resetToken,
		resetPasswordTokenExpiration: { $gt: Date.now() }
	});
	console.log(user);
	//Validate password reset token and validate user
	if (!user) {
		return next(
			new ErrorResponse(
				400,
				`Invalid token or token may have expired`,
				`Token is only valid for 10mins`
			)
		);
	}
	//Set new user password
	user.password = req.body.password;
	user.passwordResetToken = undefined;
	user.passwordResetTokenExpiration = undefined;
	await user.save();
	//Send response with token to login in user
	sendTokenResponse(200, user, res, "Password reset successful");
});

//Desc                      //Update user details
//Route                     //PUT /api/v1/auth/updatedetails
//Require Auth              //True
exports.updateDetails = asyncHandler(async (req, res, next) => {
	const { email, name } = req.body;

	const user = await User.findByIdAndUpdate(
		req.user.id,
		{ name, email },
		{ new: true, runValidators: true }
	);

	res.status(200).json({
		succees: true,
		data: user
	});
});

//Desc                      //Update user password
//Route                     //PUT /api/v1/auth/updatepassword
//Require Auth              //True
exports.updatePassword = asyncHandler(async (req, res, next) => {
	const { currentPassword, newPassword } = req.body;

	const user = await User.findById(req.user.id).select("+password");

	// Check if passwords match
	const isMatch = await user.matchPassword(currentPassword);

	if (!isMatch) {
		return next(
			new ErrorResponse(
				400,
				`Incorrect previous password`,
				`Current password entered does not match password in DB`
			)
		);
	}

	user.password = newPassword;

	user.save();

	sendTokenResponse(200, user, res, "Password updated successfully");
});

//Utitility function
//Get get token and send response
const sendTokenResponse = (statusCode, user, res, msg) => {
	const token = user.getSignedJWT();

	const options = {
		expires: new Date(
			Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
		),
		httpOnly: true
	};

	res.status(statusCode).cookie("token", token, options).json({
		success: true,
		msg,
		token
	});
};
