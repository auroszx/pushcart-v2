// Controller for product related operations.
const db = require('../middleware/DB');
const md5 = require('md5');
const auth = require('../middleware/Auth');

module.exports = {

	getCommentsByProduct: async function(product_id, token) {
		if (token != undefined) {
			db.connect();
			var comments = await db.get("SELECT product_comment_id, product_comments.user_id, product_comment, users.user_fullname, users.user_username, users.user_id FROM product_comments JOIN users ON users.user_id = product_comments.user_id WHERE product_id = (?)", [product_id]);
			return { status: 200, comments: comments };
		}
		else {
			return { status: 403, message: "You are not allowed to perform this action" };
		}
	},

	addComment: async function(product_id, product_comment, token) {
		console.log(product_id, product_comment);
		if (token != undefined) {
			var data = await auth.verify(token);
			db.connect();
			var id = await db.execute("INSERT INTO product_comments (product_id, user_id, product_comment) VALUES ((?), (?), (?))", [product_id, data.user_id, product_comment]);
			console.log(id);
			return { status: 200, comment: await this.getCommentById(id, token) };
		}
	},

	getCommentById: async function(product_comment_id, token) {
		if (token != undefined) {
			db.connect();
			return {status: 200, comments: await db.get("SELECT product_comment_id, product_comments.user_id, product_comment, users.user_fullname, users.user_username FROM product_comments JOIN users ON users.user_id = product_comments.user_id WHERE product_comment_id = (?)", [product_comment_id]) }
		}
		else {
			return { status: 403, message: "You are not allowed to perform this action" };
		}
	},

	deleteComment: async function(product_comment_id, token) {
		if (token != undefined) {
			db.connect();
			var del = await db.get("DELETE FROM product_comments WHERE product_comment_id = (?)", [product_comment_id]);
			return { status: 200, message: "Comment deleted successfully" };
			
		}
		else {
			return { status: 403, message: "You are not allowed to perform this action" };
		}
	},

};