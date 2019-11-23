'use strict'

const sqlite = require('sqlite-async')

module.exports = class Log {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			const sql = `CREATE TABLE IF NOT EXISTS logs (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			jobId INTEGER NOT NULL, 
			desc TEXT, 
			createdAt TEXT,
			FOREIGN KEY(jobId) REFERENCES jobs(id));`
			await this.db.run(sql)
			return this
		})()
	}
}
