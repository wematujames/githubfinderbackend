class ErrorResponse extends Error {
	constructor(statusCode, msg, reason) {
		super(msg);
		this.statusCode = statusCode;
		this.reason = reason;
	}
}
module.exports = ErrorResponse;
