#!/usr/bin/env node
'use strict'
/* MODULE IMPORTS */
const Router = require('koa-router')
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
/* IMPORT CUSTOM MODULES */
const Technician = require('../models/technician')
const User = require('../models/user')
const Job = require('../models/job')
const Appliance = require('../models/appliance')
const Manufacturer = require('../models/manufacturer')
const Mailer = require('../Mail/mailer')
const router = Router({
	prefix: '/tech'
})
const dbName = 'website.db'
// The secure home page.
const dataPass = async() => {
	const dataObj = {}
	const appliance = await new Appliance(dbName)
	const appliances = await appliance.getAll()
	const manufacturer = await new Manufacturer(dbName)
	const manufacturers = await manufacturer.getAll()
	if(appliances.length !== 0) dataObj.appliances = appliances
	if(manufacturers.length !== 0) dataObj.manufacturers = manufacturers
	return dataObj
}
// Technician Dashboard
router.get('/dashboard', async ctx => {
	try {
		const data = {}
		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=unauthorized')
		if(ctx.query.msg) data.success = ctx.query.msg
		const job = await new Job(dbName)
		data.tech = ctx.session.tech
		data.jobs = await job.getAllUnassigned()
		data.techJobs = await job.getTechAssigned(data.tech.id)
		data.extra = await dataPass()
		await ctx.render('tech_home',data)
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})
// The user registration page.
router.get('/register', async ctx => await ctx.render('tech_add'))
// The script to process new user registrations.
router.post('/register', koaBody, async ctx => {
	try {
		const {user, email, pass} = ctx.request.body
		const tech = await new Technician(dbName)
		ctx.session = await tech.register(user, email, pass)
		ctx.redirect('/tech/dashboard?msg=user added')
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})
// Login page
router.get('/login', async ctx => {
	const data = {}
	if(ctx.query.msg) data.error = ctx.query.msg
	await ctx.render('tech_login', data)
})
// Login user
router.post('/login', async ctx => {
	try {
		const {user, pass} = ctx.request.body
		const tech = await new Technician(dbName)
		ctx.session = await tech.login(user, pass)
		return ctx.redirect('/tech/dashboard?msg=welcome back')
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})
// Logout user
router.get('/logout', async ctx => {
	ctx.session.authorised = null
	ctx.session.tech = null
	ctx.redirect('/tech/login')
})
// Get job page
router.get('/report/:id', async ctx => {
	const data = {}
	if(ctx.query.err) data.error = ctx.query.err
	const job = await new Job(dbName)
	const jobResult = await job.getById(ctx.params.id)
	const user = await new User(dbName)
	const users = await user.getById(jobResult.userId)
	data.tech = ctx.session.tech
	data.job = jobResult
	data.jobUser = users
	await ctx.render('tech_report', data)
})
// Mark as Complete
router.get('/check/:id', async ctx => {
	const techJob = await new Job(dbName)
	await techJob.markCompleted(ctx.params.id)
	await ctx.redirect('back')
})
const gatherMailData = async(jobId) => {
	const mailData = {}
	const job = await new Job(dbName)
	const jobRes = await job.getById(jobId)
	const user = await new User(dbName)
	mailData.user = await user.getById(jobRes.userId)
	mailData.job = jobRes
	return mailData
}
// Provide Quote
router.post('/quote/:id', async ctx => {
	const data = {}
	data.jobId = ctx.params.id
	data.techId = ctx.session.tech.id
	data.formData = ctx.request.body
	const techJob = await new Job(dbName)
	const result = await techJob.provideQuote(data)
	if(result === undefined) {
		await ctx.redirect('back')
		const mailer = await new Mailer()
		const {user, job} = await gatherMailData(data.jobId)
		await mailer.mail(user, ctx.session.tech, job)
	} else await ctx.redirect(`/tech/report/${data.jobId}?err=${result.err}`)
})
// Add Appliance
router.post('/appliance', async ctx => {
	const appliance = await new Appliance(dbName)
	await appliance.add(ctx.request.body.type)
	await ctx.redirect('/tech/dashboard')
})
// Add Manufacturer
router.post('/manufacturer', async ctx => {
	const manufacturer = await new Manufacturer(dbName)
	await manufacturer.add(ctx.request.body.name)
	await ctx.redirect('/tech/dashboard')
})
module.exports = router

