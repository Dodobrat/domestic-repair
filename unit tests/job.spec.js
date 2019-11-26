'use strict'

const Jobs = require('../models/job.js')

describe('add()', () => {
	test('add a valid job', async done => {
		expect.assertions(1)
		const job = await new Jobs()
		const result = await job.add({
			appType: 'Washer',
			appAge: 3,
			appMan: 'Bosch',
			desc: 'test',
			lat: '12.1231232',
			lng: '123.2134124',
			userId: 1,
			createdAt: '31.12.2019 23:59:59'
		})
		expect(result).toBe(true)
		done()
	})

	test('add job without type', async done => {
		expect.anything()
		const job = await new Jobs()
		await expect( job.add({
			appType: '',
			appAge: 3,
			appMan: 'Bosch',
			desc: 'test',
			lat: '12.1231232',
			lng: '123.2134124',
			userId: 1,
			createdAt: '31.12.2019 23:59:59'
		}) )
			.rejects.toEqual( Error('missing type') )
		done()
	})

	test('add job without desc', async done => {
		expect.anything()
		const job = await new Jobs()
		await expect( job.add({
			appType: 'Washer',
			appAge: 3,
			appMan: 'Bosch',
			desc: '',
			lat: '12.1231232',
			lng: '123.2134124',
			userId: 1,
			createdAt: '31.12.2019 23:59:59'
		}) )
			.rejects.toEqual( Error('missing desc') )
		done()
	})

	test('add job without appliance age', async done => {
		expect.anything()
		const job = await new Jobs()
		await expect( job.add({
			appType: 'Washer',
			appAge: '',
			appMan: 'Bosch',
			desc: 'test',
			lat: '12.1231232',
			lng: '123.2134124',
			userId: 1,
			createdAt: '31.12.2019 23:59:59'
		}) )
			.rejects.toEqual( Error('missing age') )
		done()
	})

	test('add job without manufacturer', async done => {
		expect.anything()
		const job = await new Jobs()
		await expect( job.add({
			appType: 'Washer',
			appAge: 3,
			appMan: '',
			desc: 'test',
			lat: '12.1231232',
			lng: '123.2134124',
			userId: 1,
			createdAt: '31.12.2019 23:59:59'
		}) )
			.rejects.toEqual( Error('missing manufacturer') )
		done()
	})

	test('add job without userId', async done => {
		expect.anything()
		const job = await new Jobs()
		await expect( job.add({
			appType: 'Washer',
			appAge: 3,
			appMan: 'Bosch',
			desc: 'test',
			lat: '12.1231232',
			lng: '123.2134124',
			userId: '',
			createdAt: '31.12.2019 23:59:59'
		}) )
			.rejects.toEqual( Error('missing user') )
		done()
	})

	test('add job without lat', async done => {
		expect.anything()
		const job = await new Jobs()
		await expect( job.add({
			appType: 'Washer',
			appAge: 3,
			appMan: 'Bosch',
			desc: 'test',
			lat: '',
			lng: '123.2134124',
			userId: 1,
			createdAt: '31.12.2019 23:59:59'
		}) )
			.rejects.toEqual( Error('missing user latitude location') )
		done()
	})

	test('add job without lng', async done => {
		expect.anything()
		const job = await new Jobs()
		await expect( job.add({
			appType: 'Washer',
			appAge: 3,
			appMan: 'Bosch',
			desc: 'test',
			lat: '123.2134124',
			lng: '',
			userId: 1,
			createdAt: '31.12.2019 23:59:59'
		}) )
			.rejects.toEqual( Error('missing user longitude location') )
		done()
	})

	test('add job without timestamp', async done => {
		expect.anything()
		const job = await new Jobs()
		await expect( job.add({
			appType: 'Washer',
			appAge: 3,
			appMan: 'Bosch',
			desc: 'test',
			lat: '12.1231232',
			lng: '123.2134124',
			userId: 1,
			createdAt: ''
		}) )
			.rejects.toEqual( Error('missing timestamp') )
		done()
	})
})

describe('getAllAvailable()', () => {
	test('get all jobs', async done => {
		expect.anything()
		const job = await new Jobs()
		await job.add({
			appType: 'Washer',
			appAge: 3,
			appMan: 'Bosch',
			desc: 'test',
			lat: '12.1231232',
			lng: '123.2134124',
			userId: 1,
			createdAt: '31.12.2019 23:59:59'
		})
		const valid = await job.getAllAvailable()
		expect(valid).toEqual([
			{
				appAge: 3,
				appMan: 'Bosch',
				appType: 'Washer',
				assigned: null,
				createdAt: '31.12.2019 23:59:59',
				desc: 'test',
				id: 1,
				lat: '12.1231232',
				lng: '123.2134124',
				quoteId: null,
				status: 0,
				userId: 1
			}
		])
		done()
	})

	test('get if no jobs', async done => {
		expect.anything()
		const job = await new Jobs()
		const valid = await job.getAllAvailable()
		expect(valid).toEqual([])
		done()
	})
})

describe('getByUser()', () => {
	test('get job with valid user id', async done => {
		expect.anything()
		const job = await new Jobs()
		await job.add({
			appType: 'Washer',
			appAge: 3,
			appMan: 'Bosch',
			desc: 'test',
			lat: '12.1231232',
			lng: '123.2134124',
			userId: 1,
			createdAt: '31.12.2019 23:59:59'
		})
		const valid = await job.getByUser(1)
		expect(valid).toEqual([
			{
				appAge: 3,
				appMan: 'Bosch',
				appType: 'Washer',
				assigned: null,
				createdAt: '31.12.2019 23:59:59',
				desc: 'test',
				id: 1,
				lat: '12.1231232',
				lng: '123.2134124',
				quoteId: null,
				status: 0,
				userId: 1
			}
		])
		done()
	})

	test('get job with invalid user id', async done => {
		expect.anything()
		const job = await new Jobs()
		await job.add({
			appType: 'Washer',
			appAge: 3,
			appMan: 'Bosch',
			desc: 'test',
			lat: '12.1231232',
			lng: '123.2134124',
			userId: 1,
			createdAt: '31.12.2019 23:59:59'
		})
		const valid = await job.getByUser(10)
		expect(valid).toEqual(null)
		done()
	})

	test('get job with no user id', async done => {
		expect.anything()
		const job = await new Jobs()
		await job.add({
			appType: 'Washer',
			appAge: 3,
			appMan: 'Bosch',
			desc: 'test',
			lat: '12.1231232',
			lng: '123.2134124',
			userId: 1,
			createdAt: '31.12.2019 23:59:59'
		})
		await expect( job.getByUser('') )
			.rejects.toEqual( Error('no argument passed') )
		done()
	})
})

describe('getByUserApproved()', () => {
	test('get all user jobs that are assigned and not completed by userId', async done => {
		expect.anything()
		const job = await new Jobs()
		await job.add({
			appType: 'Washer',
			appAge: 3,
			appMan: 'Bosch',
			desc: 'test',
			lat: '12.1231232',
			lng: '123.2134124',
			userId: 1,
			createdAt: '31.12.2019 23:59:59'
		})
		await job.markAssigned(1)
		const valid = await job.getByUserApproved(1)
		expect(valid).toEqual([{
			appAge: 3,
			appMan: 'Bosch',
			appType: 'Washer',
			assigned: 1,
			createdAt: '31.12.2019 23:59:59',
			desc: 'test',
			id: 1,
			lat: '12.1231232',
			lng: '123.2134124',
			quoteId: null,
			status: 0,
			userId: 1
		}])
		done()
	})

	test('get all user jobs that are assigned and not completed by INVALID userId', async done => {
		expect.anything()
		const job = await new Jobs()
		await job.add({
			appType: 'Washer',
			appAge: 3,
			appMan: 'Bosch',
			desc: 'test',
			lat: '12.1231232',
			lng: '123.2134124',
			userId: 1,
			createdAt: '31.12.2019 23:59:59'
		})
		await job.markAssigned(1)
		const valid = await job.getByUserApproved(10)
		expect(valid).toEqual(null)
		done()
	})

	test('get technician assigned to job with no id', async done => {
		expect.anything()
		const job = await new Jobs()
		await job.add({
			appType: 'Washer',
			appAge: 3,
			appMan: 'Bosch',
			desc: 'test',
			lat: '12.1231232',
			lng: '123.2134124',
			userId: 1,
			createdAt: '31.12.2019 23:59:59'
		})
		await expect( job.getByUserApproved('') )
			.rejects.toEqual( Error('no argument passed') )
		done()
	})
})

describe('getByUserCompleted()', () => {
	test('get all user jobs that are assigned and completed by userId', async done => {
		expect.anything()
		const job = await new Jobs()
		await job.add({
			appType: 'Washer',
			appAge: 3,
			appMan: 'Bosch',
			desc: 'test',
			lat: '12.1231232',
			lng: '123.2134124',
			userId: 1,
			createdAt: '31.12.2019 23:59:59'
		})
		await job.markAssigned(1)
		await job.markCompleted(1)
		const valid = await job.getByUserCompleted(1)
		expect(valid).toEqual([{
			appAge: 3,
			appMan: 'Bosch',
			appType: 'Washer',
			assigned: 1,
			createdAt: '31.12.2019 23:59:59',
			desc: 'test',
			id: 1,
			lat: '12.1231232',
			lng: '123.2134124',
			quoteId: null,
			status: 1,
			userId: 1
		}])
		done()
	})

	test('get all user jobs that are assigned and completed by INVALID userId', async done => {
		expect.anything()
		const job = await new Jobs()
		await job.add({
			appType: 'Washer',
			appAge: 3,
			appMan: 'Bosch',
			desc: 'test',
			lat: '12.1231232',
			lng: '123.2134124',
			userId: 1,
			createdAt: '31.12.2019 23:59:59'
		})
		await job.markAssigned(1)
		await job.markCompleted(1)
		const valid = await job.getByUserCompleted(10)
		expect(valid).toEqual(null)
		done()
	})

	test('get technician assigned to job with no id', async done => {
		expect.anything()
		const job = await new Jobs()
		await job.add({
			appType: 'Washer',
			appAge: 3,
			appMan: 'Bosch',
			desc: 'test',
			lat: '12.1231232',
			lng: '123.2134124',
			userId: 1,
			createdAt: '31.12.2019 23:59:59'
		})
		await expect( job.getByUserCompleted('') )
			.rejects.toEqual( Error('no argument passed') )
		done()
	})
})

describe('getTechPendingJobs()', () => {
	test('get all tech pending jobs by mapping all quotes', async done => {
		expect.anything()
		const job = await new Jobs()
		const quote = [{
			id: 1,
			executionDate: '2019-11-13',
			executionTime: '13:00 - 15:00',
			price: 500,
			jobId: 1,
			techId: 1,
			createdAt: '31.12.2019 23:59:59'
		}]
		await job.add({
			appType: 'Washer',
			appAge: 3,
			appMan: 'Bosch',
			desc: 'test',
			lat: '12.1231232',
			lng: '123.2134124',
			userId: 1,
			createdAt: '31.12.2019 23:59:59'
		})
		await job.setPending(1, 1)
		const valid = await job.getTechPendingJobs(quote)
		expect(valid).toEqual([{
			appAge: 3,
			appMan: 'Bosch',
			appType: 'Washer',
			assigned: null,
			createdAt: '31.12.2019 23:59:59',
			desc: 'test',
			id: 1,
			lat: '12.1231232',
			lng: '123.2134124',
			quoteId: 1,
			status: 0,
			userId: 1
		}])
		done()
	})

	test('get all tech pending jobs without param', async done => {
		expect.anything()
		const job = await new Jobs()
		await job.add({
			appType: 'Washer',
			appAge: 3,
			appMan: 'Bosch',
			desc: 'test',
			lat: '12.1231232',
			lng: '123.2134124',
			userId: 1,
			createdAt: '31.12.2019 23:59:59'
		})
		await job.setPending(1, 1)
		await expect( job.getTechPendingJobs() )
			.rejects.toEqual( Error('no argument passed') )
		done()
	})

	test('get all tech pending jobs with invalid param', async done => {
		expect.anything()
		const job = await new Jobs()
		await job.add({
			appType: 'Washer',
			appAge: 3,
			appMan: 'Bosch',
			desc: 'test',
			lat: '12.1231232',
			lng: '123.2134124',
			userId: 1,
			createdAt: '31.12.2019 23:59:59'
		})
		await expect( job.getByUserCompleted('') )
			.rejects.toEqual( Error('no argument passed') )
		done()
	})
})

describe('getTechAssignedJobs()', () => {
	test('get all tech assigned jobs by mapping all quotes', async done => {
		expect.anything()
		const job = await new Jobs()
		const quote = [{
			id: 1,
			executionDate: '2019-11-13',
			executionTime: '13:00 - 15:00',
			price: 500,
			jobId: 1,
			techId: 1,
			createdAt: '31.12.2019 23:59:59'
		}]
		await job.add({
			appType: 'Washer',
			appAge: 3,
			appMan: 'Bosch',
			desc: 'test',
			lat: '12.1231232',
			lng: '123.2134124',
			userId: 1,
			createdAt: '31.12.2019 23:59:59'
		})
		await job.setPending(1, 1)
		await job.markAssigned(1)
		const valid = await job.getTechAssignedJobs(quote)
		expect(valid).toEqual([{
			appAge: 3,
			appMan: 'Bosch',
			appType: 'Washer',
			assigned: 1,
			createdAt: '31.12.2019 23:59:59',
			desc: 'test',
			id: 1,
			lat: '12.1231232',
			lng: '123.2134124',
			quoteId: 1,
			status: 0,
			userId: 1
		}])
		done()
	})

	test('get all tech assigned jobs without param', async done => {
		expect.anything()
		const job = await new Jobs()
		await job.add({
			appType: 'Washer',
			appAge: 3,
			appMan: 'Bosch',
			desc: 'test',
			lat: '12.1231232',
			lng: '123.2134124',
			userId: 1,
			createdAt: '31.12.2019 23:59:59'
		})
		await job.setPending(1, 1)
		await job.markAssigned(1)
		await expect( job.getTechPendingJobs() )
			.rejects.toEqual( Error('no argument passed') )
		done()
	})
})

describe('getById()', () => {
	test('get job by id', async done => {
		expect.anything()
		const job = await new Jobs()
		await job.add({
			appType: 'Washer',
			appAge: 3,
			appMan: 'Bosch',
			desc: 'test',
			lat: '12.1231232',
			lng: '123.2134124',
			userId: 1,
			createdAt: '31.12.2019 23:59:59'
		})
		const valid = await job.getById(1)
		expect(valid).toEqual({
			appAge: 3,
			appMan: 'Bosch',
			appType: 'Washer',
			assigned: null,
			createdAt: '31.12.2019 23:59:59',
			desc: 'test',
			id: 1,
			lat: '12.1231232',
			lng: '123.2134124',
			quoteId: null,
			status: 0,
			userId: 1
		})
		done()
	})

	test('get job with invalid id', async done => {
		expect.anything()
		const job = await new Jobs()
		await job.add({
			appType: 'Washer',
			appAge: 3,
			appMan: 'Bosch',
			desc: 'test',
			lat: '12.1231232',
			lng: '123.2134124',
			userId: 1,
			createdAt: '31.12.2019 23:59:59'
		})
		const valid = await job.getById(10)
		expect(valid).toEqual({ msg: 'Not found' })
		done()
	})

	test('get job with no id', async done => {
		expect.anything()
		const job = await new Jobs()
		await job.add({
			appType: 'Washer',
			appAge: 3,
			appMan: 'Bosch',
			desc: 'test',
			lat: '12.1231232',
			lng: '123.2134124',
			userId: 1,
			createdAt: '31.12.2019 23:59:59'
		})
		await expect( job.getById('') )
			.rejects.toEqual( Error('no argument passed') )
		done()
	})
})




describe('setQuoteToNull()', () => {
	test('user refused quote with valid id', async done => {
		expect.anything()
		const job = await new Jobs()
		await job.add({
			appType: 'Washer',
			appAge: 3,
			appMan: 'Bosch',
			desc: 'test',
			lat: '12.1231232',
			lng: '123.2134124',
			userId: 1,
			createdAt: '31.12.2019 23:59:59'
		})
		await job.setPending(1,1)
		const valid = await job.setQuoteToNull(1)
		expect(valid).toBe(true)
		done()
	})

	test('user refused quote with no arg', async done => {
		expect.anything()
		const job = await new Jobs()
		await job.add({
			appType: 'Washer',
			appAge: 3,
			appMan: 'Bosch',
			desc: 'test',
			lat: '12.1231232',
			lng: '123.2134124',
			userId: 1,
			createdAt: '31.12.2019 23:59:59'
		})
		await job.setPending(1,1)
		await expect( job.setQuoteToNull() )
			.rejects.toEqual( Error('no argument passed') )
		done()
	})
})

describe('setPending()', () => {
	test('set pending with valid ids', async done => {
		expect.anything()
		const job = await new Jobs()
		await job.add({
			appType: 'Washer',
			appAge: 3,
			appMan: 'Bosch',
			desc: 'test',
			lat: '12.1231232',
			lng: '123.2134124',
			userId: 1,
			createdAt: '31.12.2019 23:59:59'
		})
		const valid = await job.setPending(1,1)
		expect(valid).toBe(true)
		done()
	})

	test('set pending with no JobId', async done => {
		expect.anything()
		const job = await new Jobs()
		await job.add({
			appType: 'Washer',
			appAge: 3,
			appMan: 'Bosch',
			desc: 'test',
			lat: '12.1231232',
			lng: '123.2134124',
			userId: 1,
			createdAt: '31.12.2019 23:59:59'
		})
		await expect( job.setPending('',1) )
			.rejects.toEqual( Error('no jobId passed') )
		done()
		done()
	})

	test('set pending with no quoteId', async done => {
		expect.anything()
		const job = await new Jobs()
		await job.add({
			appType: 'Washer',
			appAge: 3,
			appMan: 'Bosch',
			desc: 'test',
			lat: '12.1231232',
			lng: '123.2134124',
			userId: 1,
			createdAt: '31.12.2019 23:59:59'
		})
		await expect( job.setPending(1,'') )
			.rejects.toEqual( Error('no quoteId passed') )
		done()
		done()
	})
})


describe('markAssigned()', () => {
	test('mark assigned with valid id', async done => {
		expect.anything()
		const job = await new Jobs()
		await job.add({
			appType: 'Washer',
			appAge: 3,
			appMan: 'Bosch',
			desc: 'test',
			lat: '12.1231232',
			lng: '123.2134124',
			userId: 1,
			createdAt: '31.12.2019 23:59:59'
		})
		const valid = await job.markAssigned(1)
		expect(valid).toBe(true)
		done()
	})

	test('mark assigned with invalid id', async done => {
		expect.anything()
		const job = await new Jobs()
		await job.add({
			appType: 'Washer',
			appAge: 3,
			appMan: 'Bosch',
			desc: 'test',
			lat: '12.1231232',
			lng: '123.2134124',
			userId: 1,
			createdAt: '31.12.2019 23:59:59'
		})
		await expect( job.markAssigned(10) )
			.rejects.toEqual( Error('no such job found') )
		done()
	})

	test('mark assigned with no id', async done => {
		expect.anything()
		const job = await new Jobs()
		await job.add({
			appType: 'Washer',
			appAge: 3,
			appMan: 'Bosch',
			desc: 'test',
			lat: '12.1231232',
			lng: '123.2134124',
			userId: 1,
			createdAt: '31.12.2019 23:59:59'
		})
		await expect( job.markAssigned() )
			.rejects.toEqual( Error('no such job found') )
		done()
	})
})

describe('markCompleted()', () => {
	test('mark completed with valid id', async done => {
		expect.anything()
		const job = await new Jobs()
		await job.add({
			appType: 'Washer',
			appAge: 3,
			appMan: 'Bosch',
			desc: 'test',
			lat: '12.1231232',
			lng: '123.2134124',
			userId: 1,
			createdAt: '31.12.2019 23:59:59'
		})
		const valid = await job.markCompleted(1)
		expect(valid).toBe(true)
		done()
	})

	test('mark completed with invalid id', async done => {
		expect.anything()
		const job = await new Jobs()
		await job.add({
			appType: 'Washer',
			appAge: 3,
			appMan: 'Bosch',
			desc: 'test',
			lat: '12.1231232',
			lng: '123.2134124',
			userId: 1,
			createdAt: '31.12.2019 23:59:59'
		})
		await expect( job.markCompleted(10) )
			.rejects.toEqual( Error('no such job found') )
		done()
	})

	test('mark completed with no id', async done => {
		expect.anything()
		const job = await new Jobs()
		await job.add({
			appType: 'Washer',
			appAge: 3,
			appMan: 'Bosch',
			desc: 'test',
			lat: '12.1231232',
			lng: '123.2134124',
			userId: 1,
			createdAt: '31.12.2019 23:59:59'
		})
		await expect( job.markCompleted() )
			.rejects.toEqual( Error('no such job found') )
		done()
	})
})


