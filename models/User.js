const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
	{
		fName: {
			type: String,
			required: true,
			maxlength: [50, "First name cannot be more than 50 characters"],
			trim: true
		},
		lName: {
			type: String,
			required: true,
			maxlength: [50, "Last name cannot be more than 50 characters"],
			trim: true
		},
		userName: {
			type: String,
			required: true,
			unique: true,
			maxlength: [50, "Username cannot be more than 50 characters"],
			trim: true
		},
		email: {
			type: String,
			match: [
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				"Please enter a valid email address"
			],
			trim: true
		},
		password: {
			type: String,
			required: true,
			select: false,
			minlength: [8, "Password cannot be less than 8 characters"],
			select: false
		},
		role: {
			type: String,
			enum: ["user"],
			default: "user"
		},
		profileImg: {
			type: String,
			default: "photo.jpeg"
		},
		createdAt: {
			type: Date,
			default: Date.now
		}
	},
	{ toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

//enable post virtual for user
userSchema.virtual("posts", {
	ref: "Post",
	localField: "_id",
	foreignField: "userId",
	justOne: false
});

//Encrypt user password
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

//Get signed jwt
userSchema.methods.getSignedJWT = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRESIN
	});
};

//Check if password match
userSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

//Generate password reset token
userSchema.methods.passResetToken = function () {
	const resetToken = crypto.randomBytes(20).toString("hex");

	//hash and store reset token in Db
	this.passwordResetToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");

	this.resetPasswordTokenExpiration = Date.now() + 10 * 60 * 1000;
	return resetToken;
};
module.exports = new mongoose.model("User", userSchema);
