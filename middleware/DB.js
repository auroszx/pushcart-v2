// SQLite3 Database Middleware
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let connection = null;

module.exports = {

	connect: function() {
		this.connection = new sqlite3.Database(path.join(__dirname, '..', 'db', 'notikha.db'), (err) => {
			if (err) {
			    console.error(err.message);
			}
			else {
				//console.log('Connected to the Notikha database.');
			}
		});
	},

	close: function() {
		this.connection.close();
	},

	get: function(stmt, params) {
		return new Promise((res, rej) => {
			this.connection.all(stmt, params, (err, rows) => {
				if (err) {
					rej(err);
				}
				else {
					//console.log(rows);
					res(rows);
				}
			});
		});
		
	},

	execute: function(stmt, params) {
		return new Promise((res, rej) => {
			this.connection.run(stmt, params, function(err) {
		      	if (err){
		        	rej(err);
		      	}
		      	else {
		      		res(this.lastID);
		      	}
		    });
		});
		  	
	}

};