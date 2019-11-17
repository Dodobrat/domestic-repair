'use strict'

const sqlite = require('sqlite-async')

module.exports = class Appliance {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = `CREATE TABLE IF NOT EXISTS appliances (
			id INTEGER PRIMARY KEY AUTOINCREMENT, 
            type TEXT
             );`
			await this.db.run(sql)
			return this
		})()
	}

	async add(type) {
		try {
			const sql = `INSERT INTO appliances (type) 
            VALUES ("${type}");`
			await this.db.run(sql)
		} catch (err) {
			throw err
		}
	}

	async getAll() {
		try {
			const sql = 'SELECT * FROM appliances'
			return await this.db.all(sql)
		} catch (err) {
			throw err
		}
	}
}
