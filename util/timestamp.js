#!/usr/bin/env node

'use strict'

const ten = 10

module.exports = class Timestamp {

	// GENERATE CORRECTLY FORMATTED TIMESTAMP
	async formatDate(date) {
		const day = date.getDate() < ten ? `0${date.getDate()}` : date.getDate()
		const month = date.getMonth() < ten ? `0${date.getMonth()}` : date.getMonth()
		const year = date.getFullYear()
		return `${day}.${month}.${year}`
	}

	async formatTime(date) {
		const hours = date.getHours() < ten ? `0${date.getHours()}` : date.getHours()
		const minutes = date.getMinutes() < ten ? `0${date.getMinutes()}` : date.getMinutes()
		const seconds = date.getSeconds() < ten ? `0${date.getSeconds()}` : date.getSeconds()
		return `${hours}:${minutes}:${seconds}`
	}

	async generateTimestamp() {
		const date = new Date()
		const timeDMY = await this.formatDate(date)
		const timeHMS = await this.formatTime(date)
		return `${timeDMY} ${timeHMS}`
	}

	async generateFileStamp() {
		const date = new Date()
		const timeDMY = await this.formatDate(date)
		return `${timeDMY}`
	}
}
