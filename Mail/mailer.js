#!/usr/bin/env node

'use strict'

const nodemailer = require('nodemailer')

module.exports = class Mailer {
	async message(user, tech, quote) {
		return `<h3>Hi ${user.user}</h3>
			<br>
			<p>We are happy to work with you and happy to inform you that ${tech.user} has been assigned
			to work with you!</p>
			<br>
			<p>Upon completion of job '${quote.jobId}', which will take place on ${quote.executionDate} 
			at ${quote.executionTime},
			you will have to pay £ ${quote.price}.</p>
			<br>
			<p>Hope everything goes well!</p>
			<br>
			<p>Regards,</p>
			<br>
			<p>Domestic Repair Team</p>`
	}

	async finishedMsg(jobId, tech,user) {
		return `<h3>Hi ${user.user}</h3>
			<br>
			<p>We are happy to inform you that job '${jobId}' was executed successfully. Everything is fixed now!</p>
			<br>
			<p>Hope everything went well!</p>
			<br>
			<p>Regards from Domestic Repair Team and ${tech.user}</p>`
	}


	async mail(user, tech, quote) {
		const transporter = nodemailer.createTransport({
			host: 'smtp.mailtrap.io',
			port: 2525,
			auth: {
				user: 'd0c80fa6e29572',
				pass: '49aef1f003a410'
			}
		})
		const mailOptions = {
			from: `${tech.email}`,
			to: `${user.email}`,
			subject: `Quote for job ${quote.jobId}`,
			html: await this.message(user, tech, quote)
		}
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) console.log(error)
			else console.log(`Email sent: ${info.response}`)
		})
	}

	async finishMail(jobId, tech,user) {
		const transporter = nodemailer.createTransport({
			host: 'smtp.mailtrap.io',
			port: 2525,
			auth: {
				user: 'd0c80fa6e29572',
				pass: '49aef1f003a410'
			}
		})
		const mailOptions = {
			from: `${tech.email}`,
			to: `${user.email}`,
			subject: `Job ${jobId} Finished`,
			html: await this.finishedMsg(jobId, tech,user)
		}
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) console.log(error)
			else console.log(`Email sent: ${info.response}`)
		})
	}
}
