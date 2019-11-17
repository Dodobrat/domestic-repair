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
			const sql = `INSERT INTO jobs (appType, appAge, appMan, desc, createdAt, completed, userId) 
            VALUES ("${type}","${age}","${manufacturer}","${desc}","${createdAt}", 0, "${user}");`
			await this.db.run(sql)
		} catch (err) {
			throw err
		}
	}

	async getAll() {
		try {
			const sql = 'SELECT * FROM jobs'
			return await this.db.all(sql)
		} catch (err) {
			throw err
		}
	}

	async getByUser(userId) {
		try {
			const sql = `SELECT * FROM jobs WHERE userId='${userId}';`
			return await this.db.all(sql)
		} catch (err) {
			throw err
		}
	}

	async getById(id) {
		try {
			const sql = `SELECT * FROM jobs WHERE id='${id}';`
			return await this.db.get(sql)
		} catch (err) {
			throw err
		}
	}

	async markCompleted(id) {
		try {
			const sql = `UPDATE jobs SET completed = 1 WHERE id='${id}';`
			return await this.db.get(sql)
		} catch (err) {
			throw err
		}
	}

}
