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
			var data = await auth.verify(token);
			db.connect();
			var id = await db.execute("INSERT INTO products (product_title, product_desc, product_image, product_stock, user_id) VALUES ((?), (?), (?), (?), (?))", [product_title, product_desc, product_image, product_stock, data.user_id]);
			return this.getProductInfo(id, token);
		}
		else {
			return { status: 403, message: "You are not allowed to perform this action" };
		}
	},

	deleteProduct: async function(product_id, token) {
		if (token != undefined) {
			var data = await auth.verify(token);
			db.connect();
			var del = await db.get("DELETE FROM products WHERE product_id = (?) AND user_id = (?)", [product_id, data.user_id]);
			return { status: 200, message: "Product deleted successfully" };
		}
		else {
			return { status: 403, message: "You are not allowed to perform this action" };
		}
	},

	checkBeforeUpdate: async function(product_title, product_desc, product_image, product_stock) {
		if (!product_title || product_title.trim(" ") == "") {
			return { success: false, status: 500, message: "Product title can't be empty"};
		}
		else if (!product_desc || product_desc.trim(" ") == "") {
			return { success: false, status: 500, message: "Product description can't be empty"};
		}
		else if (!product_image || product_image.trim(" ") == "") {
			return { success: false, status: 500, message: "Product image must be provided"};
		}
		else if (!product_stock) {
			return { success: false, status: 500, message: "Product stock must be provided"};
		}
		else {
			return { success: true }
		}
	},

	updateProduct: async function(product_id, product_title, product_desc, product_image, product_stock) {
		if (token != undefined) {
			var data = await auth.verify(token);
			var result = await this.checkBeforeUpdate(product_title, product_desc, product_image, product_stock);
			if (result.success) {
				db.connect();
				var del = await db.get("UPDATE products SET products_title = (?), product_desc = (?), product_image = (?), product_stock = (?) WHERE product_id = (?) AND user_id = (?)", [product_title, product_desc, product_image, product_stock, product_id, data.user_id]);
				return { status: 200, message: "Product updated successfully", product: { product_id: product_id, product_title: product_title, product_desc: product_desc, product_image: product_image, product_stock: product_stock } };
			}
			else {
				return result;
			}
		}
		else {
			return { status: 403, message: "You are not allowed to perform this action" };
		}
	}

};