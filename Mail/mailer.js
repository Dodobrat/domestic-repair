#!/usr/bin/env node

'use strict'

const nodemailer = require('nodemailer')

module.exports = class Mailer {
	async message(user, tech, job) {
		return `<h3>Hi ${user.user}</h3>
			<br>
			<p>We are happy to work with you and happy to inform you that ${tech.user} has been assigned
			to work with you!</p>
			<br>
			<p>Upon completion of job '${job.id}', which will take place on ${job.executionDate} 
			at ${job.executionTime},
			you will have to pay ${job.price}.</p>
			<br>
			<p>Hope everything went well!</p>
			<br>
			<p>Regards,</p>
			<br>
			<p>Domestic Repair Team</p>`
	}


	async mail(user, tech, job) {
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
			subject: `Quote for job ${job.id}`,
			html: await this.message(user, tech, job)
		}
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) console.log(error)
			else console.log(`Email sent: ${info.response}`)
		})
	}
}
