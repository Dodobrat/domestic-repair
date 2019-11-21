'use strict'

const sqlite = require('sqlite-async')

module.exports = class Job {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			const sql = `CREATE TABLE IF NOT EXISTS jobs (
			id INTEGER PRIMARY KEY AUTOINCREMENT, appType VARCHAR(32), appAge INTEGER, appMan VARCHAR(32), 
			desc VARCHAR(300), executionDate VARCHAR(32) NULL, executionTime VARCHAR(32) NULL, price INTEGER NULL, 
			createdAt TEXT, completed INTEGER,assignedTo INTEGER NULL, userId INTEGER, 
			 FOREIGN KEY(userId) REFERENCES users(id), FOREIGN KEY(assignedTo) REFERENCES technicians(id));`
			await this.db.run(sql)
			return this
		})()
	}

	async validateDetails(formData) {
		if(formData.type.length === 0) throw new Error('missing type')
		if(formData.age.length === 0) throw new Error('missing age')
		if(formData.manufacturer.length === 0) throw new Error('missing manufacturer')
		if(formData.desc.length === 0) throw new Error('missing desc')
		return true
	}

	async validateUserDetails(formData) {
		if(formData.user.length === 0) throw new Error('missing user')
		if(formData.createdAt.length === 0) throw new Error('missing timestamp')
		return true
	}

	async add(formData) {
		try {
			await this.validateDetails(formData)
			await this.validateUserDetails(formData)
			const {type, age, manufacturer, desc, user, createdAt} = formData
			const sql = `INSERT INTO jobs (appType, appAge, appMan, desc, createdAt, completed, userId) 
            VALUES ("${type}","${age}","${manufacturer}","${desc}","${createdAt}", 0, "${user}");`
			await this.db.run(sql)
			return true
		} catch (err) {
			throw err
		}
	}

	async getAllUnassigned() {
		const sql = 'SELECT * FROM jobs WHERE assignedTo IS NULL ORDER BY id DESC'
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

	async getTechAssigned(techId) {
		try {
			if (techId.length === 0) throw new Error('no argument passed')
			const sql = `SELECT * FROM jobs WHERE assignedTo='${techId}' ORDER BY id DESC;`
			const result = await this.db.all(sql)
			if(result.length === 0) return null
			return result
		} catch (err) {
			throw err
		}
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

	async markCompleted(id) {
		try {
			let sql = `SELECT COUNT(id) as jobs FROM jobs WHERE id='${id}';`
			const data = await this.db.get(sql)
			if (data.jobs === 0) throw new Error('no such job found')
			else {
				sql = `UPDATE jobs SET completed = 1 WHERE id='${id}';`
				await this.db.run(sql)
				return true
			}
		} catch (err) {
			throw err
		}
	}

	async checkQuoteIds(data) {
		if (data.jobId.length === 0) throw new Error('missing job id')
		if (data.techId.length === 0) throw new Error('missing tech id')
	}

	async checkQuoteData(data) {
		await this.checkQuoteIds(data)
		if (data.formData.invoice.length === 0) throw new Error('missing job price')
		if (data.formData.execDate.length === 0) throw new Error('missing job execution date')
		if (data.formData.execTime.length === 0) throw new Error('missing job execution time block')
	}

	async limitTechAssignedJobsCount(techId) {
		try {
			const jobCount = 3
			const sql = `SELECT COUNT(id) as jobs FROM jobs WHERE assignedTo = ${techId} AND completed = 0;`
			const data = await this.db.get(sql)
			if (data.jobs >= jobCount) return {err: 'You cannot have more than 3 unfinished jobs assigned'}
			else return true
		} catch (err) {
			throw err
		}
	}

	async provideQuote(quoteData) {
		try {
			await this.checkQuoteData(quoteData)
			const {jobId, techId} = quoteData
			const {invoice, execDate, execTime} = quoteData.formData
			let sql = `SELECT COUNT(id) as jobs FROM jobs WHERE id='${jobId}' AND assignedTo IS NOT NULL;`
			const data = await this.db.get(sql)
			if (data.jobs !== 0) throw new Error('job already assigned')
			else {
				if (await this.limitTechAssignedJobsCount(techId) === true) {
					sql = `UPDATE jobs SET price = '${invoice}', executionDate = '${execDate}',
					 executionTime = '${execTime}', assignedTo = '${techId}' WHERE id='${jobId}';`
					await this.db.run(sql)
				}else return await this.limitTechAssignedJobsCount(techId)
			}
		} catch (err) {
			throw err
		}
	}
}
