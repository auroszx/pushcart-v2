// Controller for product related operations.
const db = require('../middleware/DB');
const md5 = require('md5');
const auth = require('../middleware/Auth');

module.exports = {

	getCommentsByProduct: async function(product_id, token) {
		if (token != undefined) {
			db.connect();
			var comments = await db.get("SELECT product_comment_id, product_comments.user_id, product_comment, users.user_fullname, users.user_username FROM product_comments JOIN users ON users.user_id = product_comments.user_id WHERE product_id = (?)", [product_id]);
			return { status: 200, comments: comments };
		}
		else {
			return { status: 403, message: "You are not allowed to perform this action" };
		}
	},

	addComment: async function(product_id, product_comment, token) {
		if (token != undefined) {
			var data = await auth.verify(token);
			db.connect();
			var id = await db.execute("INSERT INTO product_comments (product_id, user_id, product_comment) VALUES ((?), (?), (?))", [product_id, data.user_id, product_comment]);
			return {status: 200, product: this.getCommentById(id, token) };
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
			var data = await auth.verify(token);
			db.connect();
			var users = await db.get("SELECT product_comment_id FROM product_comments WHERE product_comments.product_comment_id = (?) AND product_comments.user_id = (?)", [product_comment_id, data.user_id]);
			var users2 = await db.get("SELECT products.user_id SELECT products.user_id FROM products JOIN product_comments ON product_comments.product_id = products.product_id WHERE product_comments.product_comment_id = (?) AND products.user_id = (?)", [product_comment_id, data.user_id]);
			if (users.length > 0 || users2.length > 0) {
				var del = await db.get("DELETE FROM product_comments WHERE product_comment_id = (?) AND user_id = (?)", [product_comment_id, data.user_id]);
				return { status: 200, message: "Comment deleted successfully" };
			}
			else {
				return { status: 406, message: "You are not allowed to delete this comment" };
			}
			
		}
		else {
			return { status: 403, message: "You are not allowed to perform this action" };
		}
	},

};