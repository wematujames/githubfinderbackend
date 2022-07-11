const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/asyncHandler");
const UserSearchTerm = require("../models/UserSearchTerm");
const mongoose = require("mongoose");

//Desc                      //Get all search terms
//Route                     //GET /api/v1/searchTerms
//Require Auth              //True
module.exports.getSearchTerms = asyncHandler(async (req, res, next) => {
	res.json(res.advRes);
});

//Desc                      //Get user search terms
//Route                     //GET /api/v1/searchTerms/search
//Require Auth              //True
module.exports.searchSearchTerms = asyncHandler(async (req, res, next) => {
	//Ensure only on query param
	if (req.query.searchTerm && req.query.user) {
		return next(
			new ErrorResponse(
				400,
				"Please provide either one of user or searchTerm as a query parameter"
			)
		);
	}
	// Get user search terms
	if (req.query.user) {
		const searchTerms = await UserSearchTerm.find({
			user: req.query.user
		});
		return res.json({ length: searchTerms.length, searchTerms });
	}
	//Get search term by id
	if (req.query.searchTerm) {
		const searchTerm = await UserSearchTerm.findById(req.query.searchTerm);

		if (!searchTerm)
			return next(new ErrorResponse(404, "Search term does not exist"));

		return res.json(searchTerm);
	}
});

//Desc                      //Get create searchTerm
//Route                     //PUT /api/v1/searchTerms/:userid
//Require Auth              //True
module.exports.insertSearchTerm = asyncHandler(async (req, res, next) => {
	req.body.user = req.user.id;

	//Chech if search term by user already exists
	const existingTerm = await UserSearchTerm.findOne({
		user: req.user.id,
		searchTerm: req.body.searchTerm
	});

	//Check if user already searched for term
	if (existingTerm) {
		existingTerm.updatedAt = new Date();
		await UserSearchTerm.findByIdAndUpdate(existingTerm._id, {
			updatedAt: new Date()
		});
		return res.json({ msg: "Search term updated" });
	}
	//insert new serchTerm
	await UserSearchTerm.create(req.body);
	res.status(201).send({ msg: "Search term added" });
});

//Desc                      //Get Delete searchTerm
//Route                     //DELETE /api/v1/searchTerms/userid?searchTermId=1
//Require Auth              //True
module.exports.deleteSearchTerm = asyncHandler(async (req, res, next) => {
	const searchTerm = await UserSearchTerm.findOne({
		user: req.user.id,
		searchTerm: req.query.searchTerm
	});

	if (!searchTerm)
		return next(new ErrorResponse(400, "No such search term by user."));

	res.json({ msg: "SearchTerm deleted" });
});
