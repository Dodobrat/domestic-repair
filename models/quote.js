'use strict'

const sqlite = require('sqlite-async')

module.exports = class Quote {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			const sql = `CREATE TABLE IF NOT EXISTS quotes (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			executionDate TEXT NULL, executionTime TEXT NULL, price INTEGER NULL, 
			approved INTEGER DEFAULT 0 NOT NULL, 
			createdAt TEXT,
			techId INTEGER NOT NULL,
			jobId INTEGER NOT NULL, 
            FOREIGN KEY(jobId) REFERENCES jobs(id), 
            FOREIGN KEY(techId) REFERENCES technicians(id));`
			await this.db.run(sql)
			return this
		})()
	}

	async checkQuoteIds(data) {
		const {techId, jobId, createdAt} = data
		if (jobId.length === 0) throw new Error('missing job id')
		if (techId.length === 0) throw new Error('missing tech id')
		if (createdAt.length === 0) throw new Error('missing timestamp')
	}

	async checkQuoteData(data) {
		await this.checkQuoteIds(data)
		const {date, time, price} = data.formData
		if (price.length === 0) throw new Error('missing job price')
		if (date.length === 0) throw new Error('missing job execution date')
		if (time.length === 0) throw new Error('missing job execution time block')
	}


	async limitTechAssignedJobsCount(techId) {
		try {
			const jobCount = 2
			let limitRes
			const sql = `SELECT COUNT(id) as quotes FROM quotes WHERE techId = ${techId} AND approved = 0;`
			const data = await this.db.get(sql)
			if (data.quotes > jobCount) {
				limitRes = { err: 'You can\'t have more than 3 pending jobs' }
			}else {
				limitRes = true
			}
			return limitRes
		} catch (err) {
			throw err
		}
	}

	async provideQuote(data) {
		const result = await this.limitTechAssignedJobsCount(data.techId)
		if (!result.err) {
			try {
				await this.checkQuoteData(data)
				const {date, time, price} = data.formData
				const {techId, jobId, createdAt} = data
				const sql = `INSERT INTO quotes (executionDate, executionTime, price, techId, createdAt, jobId) 
            VALUES ("${date}", "${time}", "${price}", "${techId}","${createdAt}", "${jobId}");`
				await this.db.run(sql)
				return true
			} catch (err) {
				throw err
			}
		}else {
			return result
		}
	}

	async getQuoteById(quoteId) {
		const sql = `SELECT * FROM quotes WHERE id="${quoteId}";`
		return await this.db.get(sql)
	}

	async getQuoteByJobId(jobId) {
		const sql = `SELECT * FROM quotes WHERE jobId="${jobId}";`
		return await this.db.get(sql)
	}

	async deleteQuote(quoteId) {
		const sql = `DELETE FROM quotes WHERE id = ${quoteId};`
		await this.db.run(sql)
	}

	async getAllPendingQuotesByTechId(techId) {
		const sql = `SELECT * FROM quotes WHERE techId="${techId}" AND approved = 0 ORDER BY id DESC;`
		return await this.db.all(sql)
	}

	async getAllApprovedQuotesByTechId(techId) {
		const sql = `SELECT * FROM quotes WHERE techId="${techId}" AND approved = 1 ORDER BY id DESC;`
		return await this.db.all(sql)
	}

	async approveQuote(quoteId) {
		const sql = `UPDATE quotes SET approved = 1 WHERE id='${quoteId}';`
		await this.db.run(sql)
	}

	//TODO: Uncomment the next function for resetting the database and deleting quotes and jobs tables

	// async dropQuoteTable() {
	// 	let sql = 'PRAGMA foreign_keys = OFF;'
	// 	await this.db.run(sql)
	// 	sql = 'DROP TABLE quotes;'
	// 	await this.db.run(sql)
	// 	sql = 'PRAGMA foreign_keys = ON;'
	// 	await this.db.run(sql)
	// }
}
