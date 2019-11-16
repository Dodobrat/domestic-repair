#!/usr/bin/env node

//Routes File

'use strict'

/* MODULE IMPORTS */
const Router = require('koa-router')
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})

/* IMPORT CUSTOM MODULES */
const User = require('../models/user')
const Job = require('../models/job')

const router = new Router

const dbName = 'website.db'

/**
 * The secure home page.
 *
 * @name Home Page
 * @route {GET} /
 * @authentication This route requires cookie-based authentication.
 */
router.get('/', async ctx => {
	try {
		const data = {}
		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=unauthorized')
		if(ctx.query.msg) data.success = ctx.query.msg
		data.user = ctx.session.user
		const job = await new Job(dbName)
		data.userJobs = await job.getByUser(data.user.id)
		// console.log(data.userJobs)
		await ctx.render('index',data)
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
router.get('/register', async ctx => await ctx.render('register'))

/**
 * The script to process new user registrations.
 *
 * @name Register Script
 * @route {POST} /register
 */
router.post('/register', koaBody, async ctx => {
	try {
		// extract the data from the request
		const body = ctx.request.body
		const {path, type} = ctx.request.files.avatar
		// call the functions in the module
		const user = await new User(dbName)
		// await user.uploadPicture(path, type)
		// redirect to the home page
		ctx.session = await user.register(body.user, body.pass)
		ctx.redirect('/?msg=user added')
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

router.get('/login', async ctx => {
	const data = {}
	if(ctx.query.msg) data.error = ctx.query.msg
	if(ctx.query.user) data.user = ctx.query.user
	await ctx.render('login', data)
})

router.post('/login', async ctx => {
	try {
		const body = ctx.request.body
		const user = await new User(dbName)
		ctx.session = await user.login(body.user, body.pass)
		return ctx.redirect('/?msg=welcome back')
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

router.get('/logout', async ctx => {
	ctx.session.authorised = null
	ctx.session.user = null
	ctx.redirect('/login')
})

router.post('/report', async ctx => {
	try{
		const {type, age, manufacturer, desc, user} = ctx.request.body
		const newJob = {
			desc: desc,
			type: type,
			age: age,
			manufacturer: manufacturer,
			user: user,
			createdAt: Date.now()
		}
		const job = await new Job(dbName)
		await job.add(newJob)
		ctx.redirect('/?msg=job added')
	} catch (err) {
		throw err
	}
})

router.get('/report/:id', async ctx => {
	const job = await new Job(dbName)
	const data = {
		user: ctx.session.user,
		job: await job.getById(ctx.params.id)
	}
	await ctx.render('report', data)
})

module.exports = router
