'use strict'

const sqlite = require('sqlite-async')

module.exports = class Manufacturer {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			const sql = `CREATE TABLE IF NOT EXISTS manufacturers (
			id INTEGER PRIMARY KEY AUTOINCREMENT, 
            name TEXT
             );`
			await this.db.run(sql)
			return this
		})()
	}

	async add(name) {
		try {
			if (name.length === 0) throw new Error('missing name')
			const sql = `INSERT INTO manufacturers (name) 
            VALUES ("${name}");`
			await this.db.run(sql)
			return true
		} catch (err) {
			throw err
		}
	}

	async getAll() {
		const sql = 'SELECT * FROM manufacturers'
		return await this.db.all(sql)
	}
}
