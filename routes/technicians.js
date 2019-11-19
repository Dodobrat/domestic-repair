#!/usr/bin/env node

//Routes File

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

const router = Router({
	prefix: '/tech'
})

const dbName = 'website.db'

/**
 * The secure home page.
 *
 * @name Home Page
 * @route {GET} /
 * @authentication This route requires cookie-based authentication.
 */
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

router.get('/dashboard', async ctx => {
	try {
		const data = {}
		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=unauthorized')
		if(ctx.query.msg) data.success = ctx.query.msg
		data.tech = ctx.session.tech
		const job = await new Job(dbName)
		const jobs = await job.getAll()
		if(jobs.length !== 0) data.jobs = jobs
		data.extra = await dataPass()
		await ctx.render('tech_home',data)
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

/**
 * The user registration page.
 *
 * @name Register Page
 * @route {GET} /register
 */
router.get('/register', async ctx => await ctx.render('tech_add'))

/**
 * The script to process new user registrations.
 *
 * @name Register Script
 * @route {POST} /register
 */
router.post('/register', koaBody, async ctx => {
	try {
		const body = ctx.request.body
		const tech = await new Technician(dbName)
		ctx.session = await tech.register(body.user, body.pass)
		ctx.redirect('/tech/dashboard?msg=user added')
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

router.get('/login', async ctx => {
	const data = {}
	if(ctx.query.msg) data.error = ctx.query.msg
	if(ctx.query.user) data.user = ctx.query.user
	await ctx.render('tech_login', data)
})

router.post('/login', async ctx => {
	try {
		const body = ctx.request.body
		const tech = await new Technician(dbName)
		ctx.session = await tech.login(body.user, body.pass)
		return ctx.redirect('/tech/dashboard?msg=welcome back')
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

router.get('/logout', async ctx => {
	ctx.session.authorised = null
	ctx.session.tech = null
	ctx.redirect('/tech/login')
})

router.get('/report/:id', async ctx => {
	const job = await new Job(dbName)
	const jobResult = await job.getById(ctx.params.id)
	const user = await new User(dbName)
	const users = await user.getById(jobResult.userId)
	const data = {
		tech: ctx.session.tech,
		job: jobResult,
		jobUser: users
	}
	await ctx.render('tech_report', data)
})

router.get('/check/:id', async ctx => {
	const job = await new Job(dbName)
	await job.markCompleted(ctx.params.id)
	await ctx.redirect('back')
})

router.post('/appliance', async ctx => {
	const appliance = await new Appliance(dbName)
	await appliance.add(ctx.request.body.type)
	await ctx.redirect('back')
})

router.post('/manufacturer', async ctx => {
	const manufacturer = await new Manufacturer(dbName)
	await manufacturer.add(ctx.request.body.name)
	await ctx.redirect('back')
})

module.exports = router

