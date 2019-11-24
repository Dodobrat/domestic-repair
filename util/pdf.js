#!/usr/bin/env node

//Routes File

'use strict'

// Define font files
// const fonts = {
// 	Roboto: {
// 		normal: 'public/fonts/Roboto-Regular.ttf',
// 		bold: 'public/fonts/Roboto-Medium.ttf',
// 		italics: 'public/fonts/Roboto-Italic.ttf',
// 		bolditalics: 'public/fonts/Roboto-MediumItalic.ttf'
// 	}
// }

/* MODULE IMPORTS */
const Router = require('koa-router')
// const PdfPrinter = require('pdfmake')
// const printer = new PdfPrinter(fonts)
// const fs = require('fs-extra')
// const Timestamp = require('./timestamp')

/* IMPORT CUSTOM MODULES */
// const Quote = require('../models/quote')
// const Job = require('../models/job')
// const User = require('../models/user')
// const Technician = require('../models/technician')

const router = new Router

// const dbName = 'website.db'

// const createPDF = async(data) => {
// 	const content = {
// 		content: [
// 			'Assigned Unfinished Jobs Schedule'
// 		]
// 	}
// 	return content
// }

const docDefinition = {
	content: [
		{text: 'Assigned Unfinished Jobs Schedule', style: 'header'},

		{text: 'Job 1', style: 'subheader'},
		{
			style: 'tableExample',
			table: {
				widths: [70, 75, 40, 85, 60, '*'],
				body: [
					[
						{text: 'due Date', style: 'tableHeader'},
						{text: 'Time', style: 'tableHeader'},
						{text: 'Price', style: 'tableHeader'},
						{text: 'Appliance', style: 'tableHeader'},
						{text: 'Age', style: 'tableHeader'},
						{text: 'Manufacturer', style: 'tableHeader'}
					],
					['01.01.2019', '10:00 - 12:00', '250', 'Refrigerator', '10 years', 'Bosch']
				]
			},
		},
		{text: 'Job 1 Description', style: 'subheader'},
		`Lorem Ipsum is simply dummy text of the printing and typesetting industry.
		Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
		when an unknown printer took a galley of type and scrambled it to make a type specimen book.`,
		{text: 'Address: ', style: 'subheader'},
		{text: 'Open Google Maps', link: 'http://google.com', color: 'blue'}
	],
	styles: {
		header: {
			fontSize: 18,
			bold: true,
			margin: [0, 0, 0, 10]
		},
		subheader: {
			fontSize: 15,
			bold: true,
			margin: [0, 10, 0, 5]
		},
		tableHeader: {
			bold: true,
			fontSize: 13,
			color: 'black'
		}
	}
}

/**
 * Provide PDF for a technician to download.
 *
 * @name Provide PDF
 * @route {POST} /tech/schedule
 * @authentication This route requires cookie-based authentication.
 */
router.post('/tech/schedule/:id', async ctx => {
	// const data = {}
	// const tech = await new Technician(dbName)
	// const time = await new Timestamp()
	// const quote = await new Quote(dbName)
	// const job = await new Job(dbName)
	// data.technician = await tech.getById(ctx.params.id)
	// data.quotes = await quote.getAllApprovedQuotesByTechId(ctx.params.id)
	// data.jobs = await job.getTechAssignedJobs(data.quotes)

	// const pdfDoc = printer.createPdfKitDocument(docDefinition)
	// pdfDoc.pipe(fs.createWriteStream(`${await time.generateFileStamp()}.pdf`))
	// pdfDoc.end()
	ctx.redirect('back')
})


module.exports = router
