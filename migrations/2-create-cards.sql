CREATE TABLE cards (
	id INTEGER PRIMARY KEY,
	project_id INTEGER,
	message TEXT,
	data TEXT,
	FOREIGN KEY(project_id) REFERENCES projects(id)
);
