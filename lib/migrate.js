"use strict";

/** @module migrate
 * Used for performing migrations on a database
 */
module.exports = migrate;

var fs = require('fs');

/**
 * @function migrate
 * Applies the specified directory of migration (sql files) on the supplied
 * database, if they haven't been previously applied. 
 * @param {sqlite3.database} db - The database to migrate.
 * @param {string} dir - The directory of migration SQL files.
 * @param {function} callback - Callback function on error or finish
 */
function migrate(db, dir, callback){
	var migrations = fs.readdirSync(dir);
	var todo = migrations.length;
	db.serialize(function(){
		db.run("CREATE TABLE IF NOT EXISTS migrations"
			+ "(id INTEGER PRIMARY KEY, filename TEXT NOT NULL);"
		);
		migrations.forEach(function(migration){
			db.get("SELECT id FROM migrations WHERE filename=?", [migration], function(error, row){
				if(error){return callback(err);}
				if(!row){
					var sql = fs.readFileSync(dir + '/' + migration, {encoding: 'utf8'});
					db.run(sql, [], function(err, result){
						if(err){callback(err);}
						db.run("INSERT INTO migrations (filename) VALUES (?);", [migration], function(err){
							if(err){return callback(err);}
							todo--;
							if(todo == 0){callback(false);}
						});
					});
				}else{
					todo--;
					if(todo == 0){callback(false);}
				}
			});
		});
	});
}
