#!/usr/bin/env node

//Routes File

'use strict'

/* MODULE IMPORTS */
const Router = require('koa-router')
const Timestamp = require('../util/timestamp')
const Mailer = require('../Mail/mailer')

/* IMPORT CUSTOM MODULES */
const Job = require('../models/job')
const Log = require('../models/log')
const Quote = require('../models/quote')
const User = require('../models/user')
const Technician = require('../models/technician')

const router = new Router
const dbName = 'website.db'

/**
 * Processing form data to add a Job.
 *
 * @name Add a Job Script
 * @route {POST} /report
 * @authentication This route requires cookie-based authentication.
 */
router.post('/report', async ctx => {
	try{
		const timestamp = await new Timestamp()
		const {type, age, manufacturer, desc, user, lat, lng} = ctx.request.body
		const newJob = {
			desc: desc, appType: type,
			appAge: age, appMan: manufacturer,
			lat: lat, lng: lng,
			userId: user,
			createdAt: await timestamp.generateTimestamp()
		}
		const job = await new Job(dbName)
		await job.add(newJob)
		ctx.redirect('/?msg=job added')
	} catch (err) {
		throw err
	}
})

/**
 * Job View page.
 *
 * @name View Job
 * @route {GET} /report/:id
 * @authentication This route requires cookie-based authentication.
 */
router.get('/report/:id', async ctx => {
	const data = {}
	if(ctx.session.authorised === true) data.user = ctx.session.user
	const job = await new Job(dbName)
	const log = await new Log(dbName)
	const quote = await new Quote(dbName)
	const tech = await new Technician(dbName)
	const jobRes = await job.getById(ctx.params.id)
	data.logs = await log.getLogsByJobId(ctx.params.id)
	const quoteRes = await quote.getQuoteByJobId(ctx.params.id)
	let techRes
	if(quoteRes !== undefined )	techRes = await tech.getById(quoteRes.techId)
	if(techRes !== null) data.tech = techRes
	if(jobRes.length !== 0) data.job = jobRes
	data.quote = quoteRes
	await ctx.render('report', data)
})

/**
 * Technicians Job View page.
 *
 * @name View Job
 * @route {GET} /tech/report/:id
 * @authentication This route requires cookie-based authentication.
 */
router.get('/tech/report/:id', async ctx => {
	const data = {}
	if(ctx.query.err) data.error = ctx.query.err
	const job = await new Job(dbName)
	const log = await new Log(dbName)
	const jobResult = await job.getById(ctx.params.id)
	const user = await new User(dbName)
	const quote = await new Quote(dbName)
	const quoteRes = await quote.getQuoteByJobId(ctx.params.id)
	const users = await user.getById(jobResult.userId)
	data.logs = await log.getLogsByJobId(ctx.params.id)
	data.tech = ctx.session.tech
	data.job = jobResult
	data.quote = quoteRes
	data.jobUser = users
	await ctx.render('tech_report', data)
})

/**
 * Mark job as assigned.
 *
 * @name Mark Job Assigned
 * @route {GET} /assigned/:id
 * @authentication This route requires cookie-based authentication.
 */
router.get('/assign/:id/:qid', async ctx => {
	const techJob = await new Job(dbName)
	const techQuote = await new Quote(dbName)
	await techJob.markAssigned(ctx.params.id)
	await techQuote.approveQuote(ctx.params.qid)
	const timestamp = await new Timestamp()
	const newLog = {
		desc: 'Job assigned',
		createdAt: await timestamp.generateTimestamp(),
		jobId: ctx.params.id
	}
	const log = await new Log(dbName)
	await log.addLog(newLog)
	await ctx.redirect('back')
})

/**
 * Refuse job quote and put back as available.
 *
 * @name Refuse job Quote
 * @route {GET} /terminate/:id
 * @authentication This route requires cookie-based authentication.
 */
router.get('/terminate/:id', async ctx => {
	const job = await new Job(dbName)
	const quote = await new Quote(dbName)
	const quoteRes = await quote.getQuoteById(ctx.params.id)
	await job.setQuoteToNull(quoteRes.jobId)
	await quote.deleteQuote(ctx.params.id)
	const timestamp = await new Timestamp()
	const newLog = {
		desc: 'Job quote refused',
		createdAt: await timestamp.generateTimestamp(),
		jobId: ctx.params.id
	}
	const log = await new Log(dbName)
	await log.addLog(newLog)
	await ctx.redirect('back')
})

/**
 * Mark job as completed.
 *
 * @name Mark Job Completed
 * @route {GET} /tech/check/:id
 * @authentication This route requires cookie-based authentication.
 */
router.get('/tech/check/:id', async ctx => {
	const techJob = await new Job(dbName)
	const userModel = await new User(dbName)
	await techJob.markCompleted(ctx.params.id)
	const jobData = await techJob.getById(ctx.params.id)
	const user = await userModel.getById(jobData.userId)
	const timestamp = await new Timestamp()
	const newLog = {
		desc: 'Job marked complete',
		createdAt: await timestamp.generateTimestamp(),
		jobId: ctx.params.id
	}
	const log = await new Log(dbName)
	await log.addLog(newLog)
	const mailer = await new Mailer()
	await mailer.finishMail(ctx.params.id, ctx.session.tech ,user)
	await ctx.redirect('back')
})

module.exports = router
