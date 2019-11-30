#!/usr/bin/env node

'use strict'

/* MODULE IMPORTS */
const Router = require('koa-router')
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})

/* IMPORT CUSTOM MODULES */
const Technician = require('../models/technician')
const Job = require('../models/job')
const Quote = require('../models/quote')
const Appliance = require('../models/appliance')
const Manufacturer = require('../models/manufacturer')

const router = Router({
	prefix: '/tech'
})

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
 * The secure Technician Dashboard page.
 *
 * @name Technician Dashboard Page
 * @route {GET} /tech/dashboard
 * @authentication This route requires cookie-based authentication.
 */
router.get('/dashboard', async ctx => {
	try {
		const data = {}
		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=unauthorized')
		if(ctx.query.msg) data.success = ctx.query.msg
		data.tech = ctx.session.tech
		const job = await new Job(dbName)
		const quote = await new Quote(dbName)
		const techAssignedQuotes = await quote.getAllApprovedQuotesByTechId(data.tech.id)
		const techPendingQuotes = await quote.getAllPendingQuotesByTechId(data.tech.id)
		data.jobs = await job.getAllAvailable()
		data.techJobs = await job.getTechAssignedJobs(techAssignedQuotes)
		data.techPendingJobs = await job.getTechPendingJobs(techPendingQuotes)
		data.extra = await dataPass()
		await ctx.render('tech_home',data)
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

/**
 * The Technician Register page.
 *
 * @name Technician Register Page
 * @route {GET} /tech/register
 */
router.get('/register', async ctx => await ctx.render('tech_add'))

/**
 * The script to process new technician registrations.
 *
 * @name Technician Register Script
 * @route {POST} /tech/register
 */
router.post('/register', koaBody, async ctx => {
	try {
		const {user, email, pass} = ctx.request.body
		const tech = await new Technician(dbName)
		ctx.session = await tech.register(user, email, pass)
		ctx.redirect('/tech/dashboard')
	} catch(err) {
		await ctx.render('tech_add', {error: err.message})
	}
})

/**
 * The Technician Login page.
 *
 * @name Technician Login Page
 * @route {GET} /tech/login
 */
router.get('/login', async ctx => await ctx.render('tech_login'))

/**
 * The script to process technician login.
 *
 * @name Technician Login Script
 * @route {POST} /tech/login
 */
router.post('/login', async ctx => {
	try {
		const {user, pass} = ctx.request.body
		const tech = await new Technician(dbName)
		ctx.session = await tech.login(user, pass)
		return ctx.redirect('/tech/dashboard?msg=welcome back')
	} catch(err) {
		await ctx.render('tech_login', {error: err.message})
	}
})

/**
 * Deleting technician info on logout.
 *
 * @name Logout
 * @route {GET} /tech/logout
 */
router.get('/logout', async ctx => {
	ctx.session.authorised = null
	ctx.session.tech = null
	ctx.redirect('/tech/login')
})

/**
 * Script for adding appliances.
 *
 * @name Appliance
 * @route {POST} /tech/appliance
 */
router.post('/appliance', async ctx => {
	const appliance = await new Appliance(dbName)
	const type = ctx.request.body.type
	await appliance.add(type)
	await ctx.redirect('/tech/dashboard')
})

/**
 * Script for adding manufacturers.
 *
 * @name Manufacturer
 * @route {POST} /tech/manufacturer
 */
router.post('/manufacturer', async ctx => {
	const manufacturer = await new Manufacturer(dbName)
	const name = ctx.request.body.name
	await manufacturer.add(name)
	await ctx.redirect('/tech/dashboard')
})
/**
 * Script for deleting appliances.
 *
 * @name Appliance
 * @route {GET} /tech/remove-app/:id
 */
router.get('/remove-app/:id', async ctx => {
	const app = await new Appliance(dbName)
	await app.remove(ctx.params.id)
	await ctx.redirect('/tech/dashboard')
})
/**
 * Script for deleting manufacturers.
 *
 * @name Manufacturer
 * @route {GET} /tech/remove-man/:id
 */
router.get('/remove-man/:id', async ctx => {
	const man = await new Manufacturer(dbName)
	await man.remove(ctx.params.id)
	await ctx.redirect('/tech/dashboard')
})

/**
 * Routes for resetting the database / Uncomment for use
 *
 * @route {GET} /drop/table/q   ||   /drop/table/j
 */

// router.get('/drop/table/q', async ctx => {
// 	const quote = await new Quote(dbName)
// 	await quote.dropQuoteTable()
// 	ctx.body = 'quotes table dropped'
// })
//
// router.get('/drop/table/j', async ctx => {
// 	const job = await new Job(dbName)
// 	await job.dropJobsTable()
// 	ctx.body = 'jobs table dropped'
// })

module.exports = router

