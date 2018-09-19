function populateUserProfile(resp) {
	var profile = {};
	profile.name = resp.givenName;
	profile.email = resp.signInNames[0].value;
	return profile;
}

module.exports.populateUserProfile = populateUserProfile;