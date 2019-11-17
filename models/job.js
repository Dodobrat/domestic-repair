'use strict'

const sqlite = require('sqlite-async')

module.exports = class Job {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = `CREATE TABLE IF NOT EXISTS jobs (
			id INTEGER PRIMARY KEY AUTOINCREMENT, 
            appType VARCHAR(32), 
            appAge INTEGER, 
            appMan VARCHAR(32), 
            desc VARCHAR(300), 
            createdAt TEXT,
            completed INTEGER,
            userId INTEGER,
             FOREIGN KEY(userId) REFERENCES users(id)
             );`
			await this.db.run(sql)
			return this
		})()
	}

	async add(formData) {
		try {
			const {type, age, manufacturer, desc, user, createdAt} = formData
			if(type.length === 0) throw new Error('missing type')
			if(age.length === 0) throw new Error('missing age')
			if(manufacturer.length === 0) throw new Error('missing manufacturer')
			if(desc.length === 0) throw new Error('missing desc')
			if(user.length === 0) throw new Error('missing user')
			if(createdAt.length === 0) throw new Error('missing timestamp')
			const sql = `INSERT INTO jobs (appType, appAge, appMan, desc, createdAt, completed, userId) 
            VALUES ("${type}","${age}","${manufacturer}","${desc}","${createdAt}", 0, "${user}");`
			await this.db.run(sql)
			return true
		} catch (err) {
			throw err
		}
	}

	async getAll() {
		const sql = 'SELECT * FROM jobs'
		return await this.db.all(sql)
	}

	async getByUser(userId) {
		try {
			if (userId.length === 0) throw new Error('no argument passed')
			const sql = `SELECT * FROM jobs WHERE userId='${userId}';`
			const result = await this.db.all(sql)
			if(result.length === 0) {
				return null
			}
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
			if(result === undefined) {
				return { msg: 'Not found' }
			}
			return result
		} catch (err) {
			throw err
		}
	}

	async markCompleted(id) {
		try {
			let sql = `SELECT COUNT(id) as jobs FROM jobs WHERE id='${id}';`
			const data = await this.db.get(sql)
			if (data.jobs === 0) {
				throw new Error(`no such job found`)
			}else{
				sql = `UPDATE jobs SET completed = 1 WHERE id='${id}';`
				await this.db.run(sql)
				return true
			}
		} catch (err) {
			throw err
		}
	}

}
