const express = require("express"),
	router = express.Router({ mergeParams: true }),
	{ protect } = require("../middleware/auth"),
	{
		getSearchTerms,
		insertSearchTerm,
		deleteSearchTerm,
		searchSearchTerms
	} = require("../controllers/searchTerms"),
	UserSearchTerm = require("../models/UserSearchTerm"),
	advRes = require("../middleware/advRes");

router.use(protect);

router
	.route("/")
	.get(advRes(UserSearchTerm), getSearchTerms)
	.post(insertSearchTerm)
	.delete(deleteSearchTerm);

router.get("/search", searchSearchTerms);

module.exports = router;
