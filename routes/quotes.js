#!/usr/bin/env node

//Routes File

'use strict'

/* MODULE IMPORTS */
const Router = require('koa-router')
const Timestamp = require('../util/timestamp')

/* IMPORT CUSTOM MODULES */
const Quote = require('../models/quote')
const Job = require('../models/job')
const Log = require('../models/log')
const User = require('../models/user')
const Mailer = require('../Mail/mailer')

const router = new Router

const dbName = 'website.db'

const gatherMailData = async(jobId) => {
	const mailData = {}
	const job = await new Job(dbName)
	const jobRes = await job.getById(jobId)
	const quote = await new Quote(dbName)
	const user = await new User(dbName)
	mailData.user = await user.getById(jobRes.userId)
	mailData.quote = await quote.getQuoteByJobId(jobId)
	return mailData
}

const genLog = async(jobId) => {
	const timestamp = await new Timestamp()
	const newLog = {
		desc: 'A quote has been provided',
		createdAt: await timestamp.generateTimestamp(),
		jobId: jobId
	}
	const log = await new Log(dbName)
	await log.addLog(newLog)
}

const onQuoteSuccess = async(data) => {
	const jobModel = await new Job(dbName)
	const quoteModel = await new Quote(dbName)
	const quoteRes = await quoteModel.getQuoteByJobId(data.jobId)
	await jobModel.setPending(data.jobId, quoteRes.id)
	await genLog(data.jobId)
	const mailer = await new Mailer()
	const {user, quote} = await gatherMailData(quoteRes.jobId)
	await mailer.mail(user, data.techId , quote)
}

/**
 * Provide Quote for a Job and automatically send e-mail.
 *
 * @name Provide Quote
 * @route {POST} /tech/quote/:id
 * @authentication This route requires cookie-based authentication.
 */
router.post('/tech/quote/:id', async ctx => {
	const data = {}
	const timestamp = await new Timestamp()
	data.jobId = parseInt(ctx.params.id)
	data.techId = ctx.session.tech.id
	data.formData = ctx.request.body
	data.createdAt = await timestamp.generateTimestamp()
	const quote = await new Quote(dbName)
	const result = await quote.provideQuote(data)
	if(result === true) {
		await onQuoteSuccess(data)
		await ctx.redirect('back')
	} else {
		await ctx.redirect(`/tech/report/${data.jobId}?err=${result.err}`)
	}
	ctx.redirect('back')
})

module.exports = router
