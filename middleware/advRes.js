const advRes = (model, populate) => async (req, res, next) => {
	let query;

	let reqQuery = { ...req.query };

	const fieldsToNotMatch = ["_select", "_sort", "_page", "_limit"];
	fieldsToNotMatch.forEach(field => delete reqQuery[field]);

	let queryStr = JSON.stringify(reqQuery);

	//add mongoose operators
	queryStr = queryStr.replace(
		/\b(lt|lte|gt|gte|in)\b/g,
		match => `$${match}`
	);

	query = model.find(JSON.parse(queryStr));

	//Select certain fields
	if (req.query._select) {
		query = query.select(req.query._select.replace(/,/g, " "));
	}

	//Sort by certain fields
	if (req.query._sort) {
		query = query.sort(req.query._sort.replace(/,/g, " "));
	} else {
		query = query.sort("-createdAt");
	}

	const page = parseInt(req.query._page, 10) || 1;
	const limit = parseInt(req.query._limit, 10) || 3;
	const skip = (page - 1) * limit;
	const totalRes = await model.countDocuments();
	const resShown = page * limit;

	//limit skip and populate
	query = query.limit(limit).skip(skip).populate(populate);

	const pagination = {};

	if (skip > 0) {
		pagination.prev = {
			prev: page - 1,
			limit
		};
	}

	if (resShown < totalRes) {
		pagination.next = {
			next: page + 1,
			limit
		};
	}

	const results = await query;

	res.advRes = {
		success: true,
		count: results.length,
		pagination,
		data: results
	};
	next();
};

module.exports = advRes;
