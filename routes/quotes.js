#!/usr/bin/env node

//Routes File

'use strict'

/* MODULE IMPORTS */
const Router = require('koa-router')
const Timestamp = require('../util/timestamp')

/* IMPORT CUSTOM MODULES */
const Quote = require('../models/quote')
const Job = require('../models/job')
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
	data.jobId = ctx.params.id
	data.techId = ctx.session.tech.id
	data.formData = ctx.request.body
	data.createdAt = await timestamp.generateTimestamp()
	const quote = await new Quote(dbName)
	const result = await quote.provideQuote(data)
	if(!result.err) {
		const jobModel = await new Job(dbName)
		const quoteModel = await new Quote(dbName)
		const quoteRes = await quoteModel.getQuoteByJobId(data.jobId)
		await jobModel.setPending(data.jobId, quoteRes.id)
		await ctx.redirect('back')
		const mailer = await new Mailer()
		const {user, quote} = await gatherMailData(quoteRes.jobId)
		await mailer.mail(user, ctx.session.tech, quote)
	} else await ctx.redirect(`/tech/report/${data.jobId}?err=${result.err}`)
})

module.exports = router
