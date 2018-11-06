// Controller for user related operations.
const db = require('../middleware/DB');
const md5 = require('md5');
const auth = require('../middleware/Auth');

module.exports = {

	getProductsByUser: async function(product_id, token) {
		if (token != undefined) {
			db.connect();
			return db.get("SELECT * from products WHERE product_id = (?)", [product_id]);
		}
		else {
			return { status: 403, message: "You are not allowed to perform this action" };
		}
	},

	getAllProducts: async function(token) {
		if (token != undefined) {
			db.connect();
			return db.get("SELECT * from products");
		}
		else {
			return { status: 403, message: "You are not allowed to perform this action" };
		}
	},

	getProductInfo: async function(product_id, token) {
		if (token != undefined) {
			db.connect();
			return db.get("SELECT * FROM products WHERE product_id = (?)", [product_id]);
		}
		else {
			return { status: 403, message: "You are not allowed to perform this action" };
		}
	},

	getProductStock: async function(product_id, token) {
		if (token != undefined) {
			db.connect();
			return db.get("SELECT product_stock FROM products WHERE product_id = (?)", [product_id]);
		}
		else {
			return { status: 403, message: "You are not allowed to perform this action" };
		}
	},

	addProduct: async function(product_title, product_desc, product_image, product_stock) {
		if (token != undefined) {
			db.connect();
			var id = await db.execute("INSERT INTO products (product_title, product_desc, product_image, product_stock) VALUES ((?), (?), (?), (?))", [product_title, product_desc, product_image, product_stock]);
			return this.getProductInfo(id, token);
		}
		else {
			return { status: 403, message: "You are not allowed to perform this action" };
		}
	}

	//WIP

};