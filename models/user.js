'use strict'

const bcrypt = require('bcryptjs')
const fs = require('fs-extra')
const mime = require('mime-types')
const sqlite = require('sqlite-async')
const saltRounds = 10

module.exports = class User {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			const sql = `CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT, 
			user TEXT, 
			email TEXT UNIQUE, 
			pass TEXT, 
			avatar TEXT);`
			await this.db.run(sql)
			return this
		})()
	}

	async regCheck(user, email, pass, avatar) {
		if (!user) throw new Error('missing username')
		if (!email) throw new Error('missing email')
		if (!pass) throw new Error('missing password')
		if (!avatar) throw new Error('missing avatar')
		return true
	}

	async register(user, email, pass, avatar) {
		try {
			await this.regCheck(user, email, pass, avatar)
			let sql = `SELECT COUNT(id) as records FROM users WHERE user="${user}";`
			const data = await this.db.get(sql)
			if (data.records !== 0) throw new Error(`username "${user}" already in use`)
			pass = await bcrypt.hash(pass, saltRounds)
			sql = `INSERT INTO users(user, email, pass, avatar) VALUES("${user}", "${email}", "${pass}", "${avatar}")`
			await this.db.run(sql)
			sql = `SELECT id,user,avatar,email FROM users WHERE user="${user}";`
			const loggedUser = await this.db.get(sql)
			return {
				authorised: true,
				user: loggedUser
			}
		} catch (err) {
			throw err
		}
	}

	async uploadPicture(path, mimeType, user) {
		if (!mimeType) throw new Error('missing file extension')
		const extension = mime.extension(mimeType)
		if (!path) throw new Error('missing file name')
		const imgName = 'avatar'
		await fs.copy(path, `public/avatars/${imgName}_${user}.${extension}`)
		return `./avatars/${imgName}_${user}.${extension}`
	}

	async login(user, pass) {
		try {
			let sql = `SELECT count(id) AS count FROM users WHERE user="${user}";`
			const records = await this.db.get(sql)
			if (!records.count) throw new Error(`username "${user}" not found`)
			sql = `SELECT pass FROM users WHERE user = "${user}";`
			const record = await this.db.get(sql)
			const valid = await bcrypt.compare(pass, record.pass)
			if (valid === false) throw new Error(`invalid password for account "${user}"`)
			sql = `SELECT id,user,avatar,email FROM users WHERE user="${user}";`
			const loggedUser = await this.db.get(sql)
			return {
				authorised: true,
				user: loggedUser
			}
		} catch (err) {
			throw err
		}
	}

	async getById(id) {
		try {
			let sql = `SELECT count(id) AS count FROM users WHERE id="${id}";`
			const exists = await this.db.get(sql)
			if (!exists.count) throw new Error('user not found')
			sql = `SELECT id,user,avatar,email FROM users WHERE id="${id}";`
			return await this.db.get(sql)
		} catch (err) {
			throw err
		}
	}
}
