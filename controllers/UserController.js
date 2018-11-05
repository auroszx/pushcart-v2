// Controller for user related operations.
const db = require('../middleware/DB');
const md5 = require('md5');
const auth = require('../middleware/Auth');

module.exports = {

	getUser: async function(user_id, token) {
		if (token != undefined) {
			var data = await auth.verify(token);
			if (data.user_id == user_id) {
				db.connect();
				return db.get("SELECT user_id, user_fullname, user_username, user_email from users WHERE user_id = (?)", [user_id]);
			}
			else {
				return { status: 403, message: "You are not allowed to see other user's data"};
			}
		}
		else {
			return { status: 403, message: "You are not allowed to perform this action" };
		}
		
	},

	checkUser: function(username, password) {
		db.connect();
		return db.get("SELECT user_id, user_fullname, user_username, user_email from users WHERE user_username = (?) AND user_password = (?)", [username, md5(password)]);
	},

	checkBefore: async function(username, fullname, email, password) {
		if (!username || username.trim(" ") == "") {
			return { success: false, status: 500, message: "Username can't be empty"};
		}
		else if (!email || email.trim(" ") == "") {
			return { success: false, status: 500, message: "Email can't be empty"};
		}
		else if (!password || password.trim(" ") == "") {
			return { success: false, status: 500, message: "Password can't be empty"};
		}
		else if (!fullname || fullname.trim(" ") == "") {
			return { success: false, status: 500, message: "Full name can't be empty"};
		}
		else {
			db.connect();
			var users = await db.get("SELECT user_id from users WHERE user_username = (?)", [username]);
			var emails = await db.get("SELECT user_id from users WHERE user_email = (?)", [email]);
			if (users.length > 0) {
				return { success: false, status: 500, message: "Username is already in use"};	
			}
			else if (emails.length > 0) {
				return { success: false, status: 500, message: "Email is already in use"};
			}
			else {
				return { success: true };
			}
		}
	},

	addUser: async function(username, fullname, password, email) {
		db.connect();
		var result = await this.checkBefore(username, fullname, email, password);
		if (result.success) {
			return await db.execute("INSERT INTO users (user_username, user_fullname, user_password, user_email) VALUES ((?), (?), (?), (?))", [username, fullname, md5(password), email]);
		}
		else {
			return result;
		}
		
	},

	login: async function(username, password) {
		var users = await this.checkUser(username, password);
		if (users.length > 0) {
			return {status: 200, token: auth.generate(users[0])};
		}
		else {
			return { status: 406, message: "Wrong username/password combination" };
		}
	}

};