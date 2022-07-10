const express = require("express"),
	router = express.Router(),
	{ protect } = require("../middleware/auth"),
	{
		registerUser,
		loginUser,
		getMe,
		forgotPassword,
		resetPassword,
		updateDetails,
		updatePassword
	} = require("../controllers/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/updatedetails", protect, updateDetails);
router.put("/updatepassword", protect, updatePassword);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);

module.exports = router;
