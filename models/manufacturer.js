'use strict'

const sqlite = require('sqlite-async')

module.exports = class Manufacturer {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
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
			const sql = `INSERT INTO manufacturers (name) 
            VALUES ("${name}");`
			await this.db.run(sql)
		} catch (err) {
			throw err
		}
	}

	async getAll() {
		try {
			const sql = 'SELECT * FROM manufacturers'
			return await this.db.all(sql)
		} catch (err) {
			throw err
		}
	}
}
