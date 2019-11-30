'use strict'

const sqlite = require('sqlite-async')

module.exports = class Job {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			const sql = `CREATE TABLE IF NOT EXISTS jobs (
			id INTEGER PRIMARY KEY AUTOINCREMENT, appType TEXT, appAge INTEGER, appMan TEXT, desc TEXT, 
			lat TEXT NULL, lng TEXT NULL, createdAt TEXT, status INTEGER DEFAULT 0 NOT NULL,
			assigned INTEGER DEFAULT NULL, userId INTEGER NOT NULL, quoteId INTEGER NULL,
			FOREIGN KEY(userId) REFERENCES users(id), FOREIGN KEY(quoteId) REFERENCES quotes(id));`
			await this.db.run(sql)
			return this
		})()
	}

	async validateAppDetails(formData) {
		if(formData.appType.length === 0) throw new Error('missing type')
		if(formData.appAge.length === 0) throw new Error('missing age')
		if(formData.appMan.length === 0) throw new Error('missing manufacturer')
		if(formData.desc.length === 0) throw new Error('missing desc')
		return true
	}

	async validateUserDetails(formData) {
		if(formData.userId.length === 0) throw new Error('missing user')
		if(formData.createdAt.length === 0) throw new Error('missing timestamp')
		if(formData.lat.length === 0) throw new Error('missing user latitude location')
		if(formData.lng.length === 0) throw new Error('missing user longitude location')
		return true
	}

	async add(formData) {
		try {
			await this.validateAppDetails(formData)
			await this.validateUserDetails(formData)
			const {appType, appAge, appMan, desc, lat, lng, userId, createdAt} = formData
			const sql = `INSERT INTO jobs (appType, appAge, appMan, desc, lat, lng, createdAt, userId) 
            VALUES ("${appType}","${appAge}","${appMan}","${desc}","${lat}","${lng}","${createdAt}","${userId}");`
			await this.db.run(sql)
			return true
		} catch (err) {
			throw err
		}
	}

	async getAllAvailable() {
		const sql = 'SELECT * FROM jobs WHERE assigned IS NULL AND quoteId IS NULL ORDER BY id DESC'
		return await this.db.all(sql)
	}

	async getByUser(userId) {
		try {
			if (userId.length === 0) throw new Error('no argument passed')
			const sql = `SELECT * FROM jobs WHERE userId='${userId}' ORDER BY id DESC;`
			const result = await this.db.all(sql)
			if(result.length === 0) return null
			return result
		} catch (err) {
			throw err
		}
	}

	async getByUserApproved(userId) {
		try {
			if (userId.length === 0) throw new Error('no argument passed')
			const sql = `SELECT * FROM jobs WHERE userId='${userId}' AND assigned IS NOT NULL AND status = 0 
			ORDER BY id DESC;`
			const result = await this.db.all(sql)
			if(result.length === 0) return null
			return result
		} catch (err) {
			throw err
		}
	}

	async getByUserCompleted(userId) {
		try {
			if (userId.length === 0) throw new Error('no argument passed')
			const sql = `SELECT * FROM jobs WHERE userId='${userId}' AND status = 1 ORDER BY id DESC;`
			const result = await this.db.all(sql)
			if(result.length === 0) return null
			return result
		} catch (err) {
			throw err
		}
	}

	async getTechPendingJobs(pendingQuotes) {
		if (!pendingQuotes) throw new Error('no argument passed')
		const pendingJobs = pendingQuotes.map(async(quote) => {
			const sql = `SELECT * FROM jobs WHERE assigned IS NULL AND quoteId = '${quote.id}' ORDER BY id DESC;`
			return await this.db.get(sql)
		})
		return Promise.all(pendingJobs).then((techPendingJobs) => techPendingJobs)
	}

	async getTechAssignedJobs(assignedQuotes) {
		const assignedJobs = assignedQuotes.map(async(quote) => {
			const sql = `SELECT * FROM jobs WHERE assigned = 1 AND quoteId = '${quote.id}' ORDER BY id DESC;`
			return await this.db.get(sql)
		})
		return Promise.all(assignedJobs).then((techAssignedJobs) => techAssignedJobs)
	}

	async getById(id) {
		try {
			if (id.length === 0) throw new Error('no argument passed')
			const sql = `SELECT * FROM jobs WHERE id='${id}';`
			const result = await this.db.get(sql)
			if(result === undefined) return { msg: 'Not found' }
			return result
		} catch (err) {
			throw err
		}
	}

	async setQuoteToNull(jobId) {
		if (!jobId) throw new Error('no argument passed')
		const sql = `UPDATE jobs SET quoteId = NULL WHERE id='${jobId}';`
		await this.db.run(sql)
		return true
	}

	async setPending(jobId, quoteId) {
		if (!jobId) throw new Error('no jobId passed')
		if (!quoteId) throw new Error('no quoteId passed')
		const sql = `UPDATE jobs SET quoteId = ${quoteId} WHERE id='${jobId}';`
		await this.db.run(sql)
		return true
	}

	async markAssigned(id) {
		try {
			let sql = `SELECT COUNT(id) as jobs FROM jobs WHERE id='${id}';`
			const data = await this.db.get(sql)
			if (data.jobs === 0) throw new Error('no such job found')
			else {
				sql = `UPDATE jobs SET assigned = 1 WHERE id='${id}';`
				await this.db.run(sql)
				return true
			}
		} catch (err) {
			throw err
		}
	}

	async markCompleted(id) {
		try {
			let sql = `SELECT COUNT(id) as jobs FROM jobs WHERE id='${id}';`
			const data = await this.db.get(sql)
			if (data.jobs === 0) throw new Error('no such job found')
			else {
				sql = `UPDATE jobs SET status = 1 WHERE id='${id}';`
				await this.db.run(sql)
				return true
			}
		} catch (err) {
			throw err
		}
	}

	//TODO: Uncomment the next function for resetting the database and deleting quotes and jobs tables

	// async dropJobsTable() {
	// 	let sql = 'PRAGMA foreign_keys = OFF;'
	// 	await this.db.run(sql)
	// 	sql = 'DROP TABLE jobs;'
	// 	await this.db.run(sql)
	// 	sql = 'PRAGMA foreign_keys = ON;'
	// 	await this.db.run(sql)
	// }
}
