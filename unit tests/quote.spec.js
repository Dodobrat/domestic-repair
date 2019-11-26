
'use strict'

const Quote = require('../models/quote.js')

describe('provideQuote()', () => {
	test('provide quote', async done => {
		expect.assertions(1)
		const app = await new Quote()
		const add = await app.provideQuote({
			techId: 1,
			createdAt: '31.12.2019 23:59:59',
			jobId: 1,
			formData: {
				date: '2019-11-13',
				time: '13:00 - 15:00',
				price: '560'
			}
		})
		expect(add).toBe(true)
		done()
	})

	test('provide quote without jobId', async done => {
		expect.assertions(1)
		const app = await new Quote()
		await expect( app.provideQuote({
			techId: 1,
			createdAt: '31.12.2019 23:59:59',
			jobId: '',
			formData: {
				date: '2019-11-13',
				time: '13:00 - 15:00',
				price: '560'
			}
		}) )
			.rejects.toEqual( Error('missing jobId') )
		done()
	})

	test('provide quote without timestamp', async done => {
		expect.assertions(1)
		const app = await new Quote()
		await expect( app.provideQuote({
			techId: 1,
			createdAt: '',
			jobId: 1,
			formData: {
				date: '2019-11-13',
				time: '13:00 - 15:00',
				price: '560'
			}
		}) )
			.rejects.toEqual( Error('missing timestamp') )
		done()
	})

	test('provide quote without date', async done => {
		expect.assertions(1)
		const app = await new Quote()
		await expect( app.provideQuote({
			techId: 1,
			createdAt: '31.12.2019 23:59:59',
			jobId: 1,
			formData: {
				date: '',
				time: '13:00 - 15:00',
				price: '560'
			}
		}) )
			.rejects.toEqual( Error('missing job execution date') )
		done()
	})

	test('provide quote without time block', async done => {
		expect.assertions(1)
		const app = await new Quote()
		await expect( app.provideQuote({
			techId: 1,
			createdAt: '31.12.2019 23:59:59',
			jobId: 1,
			formData: {
				date: '2019-11-13',
				time: '',
				price: '560'
			}
		}) )
			.rejects.toEqual( Error('missing job execution time block') )
		done()
	})

	test('provide quote without price', async done => {
		expect.assertions(1)
		const app = await new Quote()
		await expect( app.provideQuote({
			techId: 1,
			createdAt: '31.12.2019 23:59:59',
			jobId: 1,
			formData: {
				date: '2019-11-13',
				time: '13:00 - 15:00',
				price: ''
			}
		}) )
			.rejects.toEqual( Error('missing job price') )
		done()
	})

	test('more than 3 quotes', async done => {
		expect.assertions(1)
		const app = await new Quote()
		await app.provideQuote({
			techId: 1,
			createdAt: '31.12.2019 23:59:59',
			jobId: 1,
			formData: {
				date: '2019-11-13',
				time: '13:00 - 15:00',
				price: '560'
			}
		})
		await app.provideQuote({
			techId: 1,
			createdAt: '31.12.2019 23:59:59',
			jobId: 2,
			formData: {
				date: '2019-11-13',
				time: '13:00 - 15:00',
				price: '560'
			}
		})
		await app.provideQuote({
			techId: 1,
			createdAt: '31.12.2019 23:59:59',
			jobId: 3,
			formData: {
				date: '2019-11-13',
				time: '13:00 - 15:00',
				price: '560'
			}
		})
		const fourth = await app.provideQuote({
			techId: 1,
			createdAt: '31.12.2019 23:59:59',
			jobId: 4,
			formData: {
				date: '2019-11-13',
				time: '13:00 - 15:00',
				price: '560'
			}
		})
		expect(fourth ).toEqual( { err: 'You can\'t have more than 3 pending jobs' } )
		done()
	})
})



describe('getQuoteById()', () => {
	test('get quote by ID', async done => {
		expect.anything()
		const app = await new Quote()
		await app.provideQuote({
			techId: 1,
			createdAt: '31.12.2019 23:59:59',
			jobId: 3,
			formData: {
				date: '2019-11-13',
				time: '13:00 - 15:00',
				price: '560'
			}
		})
		const valid = await app.getQuoteById(1)
		expect(valid).toEqual({
			approved: 0,
			createdAt: '31.12.2019 23:59:59',
			executionDate: '2019-11-13',
			executionTime: '13:00 - 15:00',
			id: 1,
			jobId: 3,
			price: 560,
			techId: 1
		})
		done()
	})

	test('get quote by invalid ID', async done => {
		expect.anything()
		const app = await new Quote()
		await app.provideQuote({
			techId: 1,
			createdAt: '31.12.2019 23:59:59',
			jobId: 3,
			formData: {
				date: '2019-11-13',
				time: '13:00 - 15:00',
				price: '560'
			}
		})
		await expect(app.getQuoteById()).rejects.toEqual( Error('missing parameter') )

		done()
	})
})

describe('getQuoteByJobId()', () => {
	test('get quote by jobID', async done => {
		expect.anything()
		const app = await new Quote()
		await app.provideQuote({
			techId: 1,
			createdAt: '31.12.2019 23:59:59',
			jobId: 1,
			formData: {
				date: '2019-11-13',
				time: '13:00 - 15:00',
				price: '560'
			}
		})
		const valid = await app.getQuoteByJobId(1)
		expect(valid).toEqual({
			approved: 0,
			createdAt: '31.12.2019 23:59:59',
			executionDate: '2019-11-13',
			executionTime: '13:00 - 15:00',
			id: 1,
			jobId: 1,
			price: 560,
			techId: 1
		})
		done()
	})

	test('get quote by invalid jobID', async done => {
		expect.anything()
		const app = await new Quote()
		await app.provideQuote({
			techId: 1,
			createdAt: '31.12.2019 23:59:59',
			jobId: 1,
			formData: {
				date: '2019-11-13',
				time: '13:00 - 15:00',
				price: '560'
			}
		})
		await expect(app.getQuoteByJobId()).rejects.toEqual( Error('missing parameter') )
		done()
	})
})

describe('deleteQuote()', () => {
	test('delete quote by ID', async done => {
		expect.anything()
		const app = await new Quote()
		await app.provideQuote({
			techId: 1,
			createdAt: '31.12.2019 23:59:59',
			jobId: 1,
			formData: {
				date: '2019-11-13',
				time: '13:00 - 15:00',
				price: '560'
			}
		})
		const valid = await app.deleteQuote(1)
		expect(valid).toBe(true)
		done()
	})

	test('delete quote by invalid ID', async done => {
		expect.anything()
		const app = await new Quote()
		await app.provideQuote({
			techId: 1,
			createdAt: '31.12.2019 23:59:59',
			jobId: 1,
			formData: {
				date: '2019-11-13',
				time: '13:00 - 15:00',
				price: '560'
			}
		})
		await expect( app.deleteQuote()).rejects.toEqual( Error('missing parameter') )
		done()
	})
})

describe('getAllPendingQuotesByTechId()', () => {
	test('get all pending quotes', async done => {
		expect.anything()
		const app = await new Quote()
		await app.provideQuote({
			techId: 1,
			createdAt: '31.12.2019 23:59:59',
			jobId: 1,
			formData: {
				date: '2019-11-13',
				time: '13:00 - 15:00',
				price: '560'
			}
		})
		const valid = await app.getAllPendingQuotesByTechId(1)
		expect(valid).toEqual([
			{
				approved: 0,
				createdAt: '31.12.2019 23:59:59',
				executionDate: '2019-11-13',
				executionTime: '13:00 - 15:00',
				id: 1,
				jobId: 1,
				price: 560,
				techId: 1
			}
		])
		done()
	})

	test('get quote by invalid ID', async done => {
		expect.anything()
		const app = await new Quote()
		await app.provideQuote({
			techId: 1,
			createdAt: '31.12.2019 23:59:59',
			jobId: 1,
			formData: {
				date: '2019-11-13',
				time: '13:00 - 15:00',
				price: '560'
			}
		})
		await expect( app.getAllPendingQuotesByTechId()).rejects.toEqual( Error('missing parameter') )
		done()
	})
})

describe('getAllApprovedQuotesByTechId()', () => {
	test('get all approved by ID', async done => {
		expect.anything()
		const app = await new Quote()
		await app.provideQuote({
			techId: 1,
			createdAt: '31.12.2019 23:59:59',
			jobId: 1,
			formData: {
				date: '2019-11-13',
				time: '13:00 - 15:00',
				price: '560'
			}
		})
		await app.approveQuote(1)
		const valid = await app.getAllApprovedQuotesByTechId(1)
		expect(valid).toEqual([
			{
				approved: 1,
				createdAt: '31.12.2019 23:59:59',
				executionDate: '2019-11-13',
				executionTime: '13:00 - 15:00',
				id: 1,
				jobId: 1,
				price: 560,
				techId: 1
			}
		])
		done()
	})

	test('delete quote by invalid ID', async done => {
		expect.anything()
		const app = await new Quote()
		await app.provideQuote({
			techId: 1,
			createdAt: '31.12.2019 23:59:59',
			jobId: 1,
			formData: {
				date: '2019-11-13',
				time: '13:00 - 15:00',
				price: '560'
			}
		})
		await expect( app.getAllApprovedQuotesByTechId()).rejects.toEqual( Error('missing parameter') )
		done()
	})
})

describe('approveQuote()', () => {
	test('approve all approved by ID', async done => {
		expect.anything()
		const app = await new Quote()
		await app.provideQuote({
			techId: 1,
			createdAt: '31.12.2019 23:59:59',
			jobId: 1,
			formData: {
				date: '2019-11-13',
				time: '13:00 - 15:00',
				price: '560'
			}
		})
		await app.approveQuote(1)
		const valid = await app.approveQuote(1)
		expect(valid).toBe(true)
		done()
	})

	test('approve by invalid ID', async done => {
		expect.anything()
		const app = await new Quote()
		await app.provideQuote({
			techId: 1,
			createdAt: '31.12.2019 23:59:59',
			jobId: 1,
			formData: {
				date: '2019-11-13',
				time: '13:00 - 15:00',
				price: '560'
			}
		})
		await expect( app.approveQuote()).rejects.toEqual( Error('missing parameter') )
		done()
	})
})
