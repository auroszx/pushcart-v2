// Authentication middleware of some sort.
const jwt = require('jsonwebtoken');

module.exports = {

	//This probably shouldn't be here, but this will do.
	secret: 'parangaricutirimicuaro',

	generate: function(data) {
		return jwt.sign(data, this.secret);
	},

	verify: function(tokenString) {
		return new Promise((res, rej) => {
			jwt.verify(tokenString, this.secret, (err, data) => {
				if (err) {
					rej(err);
				}
				else {
					res(data);
				}
			});
		}).catch((err) => {	//Silly UnhandledRejectionWarnings...

			console.log(err);
		});
	}

};