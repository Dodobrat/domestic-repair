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

	async addLog(data) {
		if (!data.jobId) throw new Error('missing jobId')
		if (!data.desc) throw new Error('missing desc')
		if (!data.createdAt) throw new Error('missing timestamp')
		const {desc, createdAt, jobId} = data
		const sql = `INSERT INTO logs (desc, createdAt, jobId) 
            VALUES ("${desc}","${createdAt}","${jobId}");`
		await this.db.run(sql)
		return true
	}

	async getLogsByJobId(jobId) {
		if (!jobId) throw new Error('missing jobId')
		const sql = `SELECT * FROM logs WHERE jobId="${jobId}" ORDER BY id DESC;`
		return await this.db.all(sql)
	}
}
