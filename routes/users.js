#!/usr/bin/env node

//Routes File

'use strict'

/* MODULE IMPORTS */
const Router = require('koa-router')
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})

/* IMPORT CUSTOM MODULES */
const User = require('../models/user')
const Job = require('../models/job')
const Appliance = require('../models/appliance')
const Manufacturer = require('../models/manufacturer')

const router = new Router

const dbName = 'website.db'

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
		data.extra = await dataPass()
		await ctx.render('index', data)
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
		const {user, email, pass} = ctx.request.body
		const {path, type} = ctx.request.files.avatar
		const userModel = await new User(dbName)
		const avatar = await userModel.uploadPicture(path, type)
		ctx.session = await userModel.register(user, email, pass, avatar)
		ctx.redirect('/?msg=user added')
	} catch(err) {
		await ctx.render('register', {error: err.message})
	}
})
/**
 * The user login page.
 *
 * @name Login Page
 * @route {GET} /login
 */
router.get('/login', async ctx => await ctx.render('login'))
/**
 * The script to process user login.
 *
 * @name Login Script
 * @route {POST} /login
 */
router.post('/login', async ctx => {
	try {
		const {user, pass} = ctx.request.body
		const userModel = await new User(dbName)
		ctx.session = await userModel.login(user, pass)
		return ctx.redirect('/?msg=welcome back')
	} catch(err) {
		await ctx.render('login', {error: err.message})
	}
})
/**
 * Deleting user info on logout.
 *
 * @name Logout
 * @route {GET} /logout
 */
router.get('/logout', async ctx => {
	ctx.session.authorised = null
	ctx.session.user = null
	ctx.redirect('/login')
})

module.exports = router
