'use strict'

const sqlite = require('sqlite-async')

module.exports = class Appliance {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
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
			if (type.length === 0) throw new Error('missing type')
			const sql = `INSERT INTO appliances (type) 
            VALUES ("${type}");`
			await this.db.run(sql)
			return true
		} catch (err) {
			throw err
		}
	}

	async getAll() {
		const sql = 'SELECT * FROM appliances'
		return await this.db.all(sql)
	}
}
