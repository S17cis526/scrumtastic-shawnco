"use strict";

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('srcumtastic.sqlite3', function(err){
	if(err) console.error(err);
});

var migrate = require('./lib/migrate');
migrate(db, 'migrations', function(err){
	db.serialize(function(){
		db.run("INSERT INTO projects (name) values (?)", ["title"]);
		db.all("SELECT * FROM projects", [], function(error, rows){
			if(err) return console.error(err);
			console.log("ROWS: ", rows);
		});
	});
});
