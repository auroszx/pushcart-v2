const server = require('server');
const { get, post, put, del, error } = server.router;
const { json, status, header } = server.reply;
const user = require('./controllers/UserController');
const product = require('./controllers/ProductController');
const comments = require('./controllers/CommentsController');

const cors = [
  ctx => header("Access-Control-Allow-Origin", "*"),
  ctx => header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization"),
  ctx => header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"),
  ctx => ctx.method.toLowerCase() === 'options' ? 200 : false
];

var routes = [

	// User routes
	get('/user/me', async ctx => {
		return json(await user.getUserMe(ctx.headers.authorization));
	}),

	get('/user/:id', async ctx => {
		return json(await user.getUser(parseInt(ctx.params.id), ctx.headers.authorization));
	}),

	post('/user/create', async ctx => {
		return json(await user.addUser(ctx.data.username, ctx.data.fullname, ctx.data.password, ctx.data.email));
	}),

	post('/user/login', async ctx => {
		return json(await user.login(ctx.data.username, ctx.data.password));
	}),

	del('/user/delete', async ctx => {
		return json(await user.deleteUser(ctx.headers.authorization));
	}),

	put('/user/update', async ctx => {
		return json(await user.updateUser(ctx.data.username, ctx.data.fullname, ctx.data.email, ctx.data.password, ctx.headers.authorization));
	}),


	// Product routes
	get('/products/user/:id', async ctx => {
		return json(await product.getProductsByUser(parseInt(ctx.params.id), ctx.headers.authorization));
	}),

	get('/products/search=:search', async ctx => {
		return json(await product.getAllProducts(ctx.params.search, ctx.headers.authorization));
	}),

	get('/products/by/:id', async ctx => {
		return json(await product.getProductInfo(parseInt(ctx.params.id), ctx.headers.authorization));
	}),

	get('/products/stock/:id', async ctx => {
		return json(await product.getProductStock(parseInt(ctx.params.id), ctx.headers.authorization));
	}),

	post('/products/create', async ctx => {
		return json(await product.addProduct(ctx.data.product_title, ctx.data.product_desc, ctx.data.product_image, ctx.data.product_stock, ctx.headers.authorization));
	}),

	del('/products/delete/:id', async ctx => {
		return json(await product.deleteProduct(parseInt(ctx.params.id), ctx.headers.authorization));
	}),

	put('/products/update', async ctx => {
		return json(await product.updateProduct(ctx.data.product_id, ctx.data.product_title, ctx.data.product_desc, ctx.data.product_image, ctx.data.product_stock, ctx.headers.authorization));
	}),

	// Comment routes
	get('/comments/product/:id', async ctx => {
		return json(await comments.getCommentsByProduct(parseInt(ctx.params.id), ctx.headers.authorization));
	}),

	get('/comments/:id', async ctx => {
		return json(await comments.getCommentById(parseInt(ctx.params.id), ctx.headers.authorization));
	}),

	post('/comments/create', async ctx => {
		return json(await comments.addComment(ctx.data.product_id, cta.data.product_comment, ctx.headers.authorization));
	}),

	del('/comments/delete/:id', async ctx => {
		return json(await comments.deleteComment(parseInt(ctx.params.id), ctx.headers.authorization));
	}),

	// Extra error handling
	error(ctx => status(500).json({status: 500, message: ctx.error.message}))

];


// Running the server
server({ security: { csrf: false }, 
		parser: { body: { limit: '20mb' }, json: { limit: '20mb' }
		} }, cors, routes).then(ctx => {
  			console.log(`Pushcart V2 server running on http://localhost:${ctx.options.port}/`);
});
