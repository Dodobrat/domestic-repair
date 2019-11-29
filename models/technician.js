'use strict'

const bcrypt = require('bcryptjs')
const sqlite = require('sqlite-async')
const saltRounds = 10

module.exports = class Technician {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			const sql = `CREATE TABLE IF NOT EXISTS technicians (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			user TEXT, 
			email TEXT UNIQUE, 
			pass TEXT);`
			await this.db.run(sql)
			return this
		})()
	}

	async validateTechRegData(user, email, pass) {
		if (!user) throw new Error('missing username')
		if (!email) throw new Error('missing email')
		if (!pass) throw new Error('missing password')
		return true
	}

	async register(user, email, pass) {
		try {
			await this.validateTechRegData(user, email, pass)
			let sql = `SELECT COUNT(id) as records FROM technicians WHERE user="${user}";`
			const data = await this.db.get(sql)
			if (data.records !== 0) throw new Error(`username "${user}" already in use`)
			pass = await bcrypt.hash(pass, saltRounds)
			sql = `INSERT INTO technicians(user, email, pass) VALUES("${user}", "${email}", "${pass}")`
			await this.db.run(sql)
			sql = `SELECT id,user,email FROM technicians WHERE email="${email}";`
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
			sql = `SELECT id,user,email FROM technicians WHERE user="${user}";`
			const loggedTech = await this.db.get(sql)
			return {
				authorised: true,
				tech: loggedTech
			}
		} catch (err) {
			throw err
		}
	}


	async getById(id) {
		let sql = `SELECT count(id) AS count FROM technicians WHERE id="${id}";`
		const exists = await this.db.get(sql)
		if (!exists.count) return null
		sql = `SELECT id,user,email FROM technicians WHERE id="${id}";`
		return await this.db.get(sql)
	}
}
