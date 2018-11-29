// Controller for product related operations.
const db = require('../middleware/DB');
const md5 = require('md5');
const auth = require('../middleware/Auth');

module.exports = {

	getCartByUser: async function(token) {
		if (token != undefined) {
			var data = await auth.verify(token);
			db.connect();
			var cart = await db.get("SELECT * from user_wishlist JOIN products ON user_wishlist.product_id = products.product_id WHERE user_wishlist.user_id = (?)", [data.user_id]);
			return { status: 200, cart: cart };
		}
		else {
			return { status: 403, message: "You are not allowed to perform this action" };
		}
	},

	addToCart: async function(product_id, user_product_qty, token) {
		if (token != undefined) {
			var data = await auth.verify(token);
			db.connect();
			var id = await db.execute("INSERT INTO user_wishlist (product_id, user_id, user_product_qty) VALUES ((?), (?), (?))", [product_id, data.user_id, user_product_qty]);
			return { status: 200, message: "Product added to cart successfully" };
		}
	},

	deleteFromCart: async function(user_wishlist_id, token) {
		if (token != undefined) {
			var data = await auth.verify(token);
			db.connect();
			var del = await db.get("DELETE FROM user_wishlist WHERE user_wishlist_id = (?) AND user_id = (?)", [user_wishlist_id, data.user_id]);
			return { status: 200, message: "Product deleted from cart successfully" };
			
		}
		else {
			return { status: 403, message: "You are not allowed to perform this action" };
		}
	},

	clearCart: async function(token) {
		if (token != undefined) {
			var data = await auth.verify(token);
			db.connect();
			var del = await db.get("DELETE FROM user_wishlist WHERE user_id = (?)", [data.user_id]);
			return { status: 200, message: "Your cart was cleared successfully" };
			
		}
		else {
			return { status: 403, message: "You are not allowed to perform this action" };
		}
	}


};