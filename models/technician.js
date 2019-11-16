'use strict'

const bcrypt = require('bcrypt-promise')
const sqlite = require('sqlite-async')
const saltRounds = 10

module.exports = class Technician {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = 'CREATE TABLE IF NOT EXISTS technicians (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, pass TEXT);'
			await this.db.run(sql)
			return this
		})()
	}

	async register(user, pass) {
		try {
			if (user.length === 0) throw new Error('missing username')
			if (pass.length === 0) throw new Error('missing password')
			let sql = `SELECT COUNT(id) as records FROM technicians WHERE user="${user}";`
			const data = await this.db.get(sql)
			if (data.records !== 0) throw new Error(`username "${user}" already in use`)
			pass = await bcrypt.hash(pass, saltRounds)
			sql = `INSERT INTO technicians(user, pass) VALUES("${user}", "${pass}")`
			await this.db.run(sql)
			sql = `SELECT * FROM technicians WHERE user="${user}";`
			const loggedTech = await this.db.get(sql)
			return {
				authorised: true,
				tech: loggedTech
			}
		} catch (err) {
			throw err
		}
	}

	async login(user, pass) {
		try {
			let sql = `SELECT count(id) AS count FROM technicians WHERE user="${user}";`
			const records = await this.db.get(sql)
			if (!records.count) throw new Error(`username "${user}" not found`)
			sql = `SELECT pass FROM technicians WHERE user = "${user}";`
			const record = await this.db.get(sql)
			const valid = await bcrypt.compare(pass, record.pass)
			if (valid === false) throw new Error(`invalid password for account "${user}"`)
			sql = `SELECT * FROM technicians WHERE user="${user}";`
			const loggedTech = await this.db.get(sql)
			return {
				authorised: true,
				tech: loggedTech
			}
		} catch (err) {
			throw err
		}
	}
}
