#!/usr/bin/env node

//Routes File

'use strict'

// Define font files
const fonts = {
	Roboto: {
		normal: 'public/fonts/Roboto-Regular.ttf',
		bold: 'public/fonts/Roboto-Medium.ttf',
		italics: 'public/fonts/Roboto-Italic.ttf',
		bolditalics: 'public/fonts/Roboto-MediumItalic.ttf'
	}
}

/* MODULE IMPORTS */
const Router = require('koa-router')
const PdfPrinter = require('pdfmake')
const printer = new PdfPrinter(fonts)
const fs = require('fs-extra')

/* IMPORT CUSTOM MODULES */
const Quote = require('../models/quote')
const Job = require('../models/job')
const Technician = require('../models/technician')

const router = new Router

const dbName = 'website.db'

const seventy = 70
const seventyFive = 70
const eightyFive = 70
const sixty = 70
const ten = 10
const five = 5

const fillInJobData = async(job) => [
	{text: `Job ${job.id}`, style: 'subheader'},
	{style: 'tableExample',
		table: {
			widths: [seventy, seventyFive, '*', eightyFive, sixty, '*'],
			body: [
				[
					{text: 'due Date', style: 'tableHeader'},
					{text: 'Time', style: 'tableHeader'},
					{text: 'Price', style: 'tableHeader'},
					{text: 'Appliance', style: 'tableHeader'},
					{text: 'Age', style: 'tableHeader'},
					{text: 'Manufacturer', style: 'tableHeader'}
				],
				[
					`${job.quote.executionDate}`,
					`${job.quote.executionTime}`,
					`${job.quote.price}`,
					`${job.appType}`,
					`${job.appAge}`,
					`${job.appMan}`
				]
			]
		},
	},
	{text: `Job ${job.id} Description`, style: 'subheader'},
	`${job.desc}`,
	{text: 'Address: ', style: 'subheader'},
	{
		text: 'Open Google Maps',
		link: `https://www.google.com/maps/@${job.lat},${job.lng},20z?hl=en-US`,
		color: 'blue'
	},
	'----------------------------------------------------------------------------------'
]

const jobInfo = async(data) => {
	if (data.jobs !== undefined) {
		const readyToDisplayJobs = []
		const quote = await new Quote(dbName)
		for (const job of data.jobs) {
			if (job.status !== 1) {
				job.quote = await quote.getQuoteByJobId(job.id)
				readyToDisplayJobs.push(await fillInJobData(job))
			}
		}
		return readyToDisplayJobs
	}
}

const generatePDF = async(data) => {
	const jobs = await jobInfo(data)
	const file = {
		content: [
			{text: 'Assigned Unfinished Jobs Schedule', style: 'header'},
			[jobs]
		],
		styles: {
			header: {
				fontSize: 18,
				bold: true,
				margin: [0, 0, 0, ten]
			},
			subheader: {
				fontSize: 15,
				bold: true,
				margin: [0, ten, 0, five]
			},
			tableHeader: {
				bold: true,
				fontSize: 13,
				color: 'black'
			}
		}
	}
	return file
}


/**
 * Provide PDF for a technician to download.
 *
 * @name Provide PDF
 * @route {POST} /tech/schedule
 * @authentication This route requires cookie-based authentication.
 */
router.get('/tech/schedule/:id', async ctx => {
	const data = {}
	const tech = await new Technician(dbName)
	const job = await new Job(dbName)
	const quote = await new Quote(dbName)
	const quoteRes = await quote.getAllApprovedQuotesByTechId(ctx.params.id)
	data.technician = await tech.getById(ctx.params.id)
	data.jobs = await job.getTechAssignedJobs(quoteRes)
	const pdfDoc = printer.createPdfKitDocument(await generatePDF(data))
	const path = `public/pdfs/tech_${ctx.params.id}.pdf`
	pdfDoc.pipe(fs.createWriteStream(path))
	pdfDoc.end()
	ctx.body = fs.createReadStream(path)
	ctx.set('Content-type', 'application/pdf')
	ctx.attachment(`tech_${ ctx.params.id }.pdf`)
	fs.unlink(path, (err) => {
		if (err) throw err
		// if no error, file has been deleted successfully
		console.log('File deleted!')
	})
})


module.exports = router
