module.exports = function (passport) {
	passport.authenticate("google", {
		clientID: process.env.GOOGLEAUTH_CLIENT_ID,
		clientSecret: process.env.GOOGLEAUTH_CLIENT_SECRET
	});

	passport.serilaizeUser();

	passport.deserializeUser();
};
