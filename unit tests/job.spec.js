'use strict'

const Jobs = require('../models/job.js')

describe('add()', () => {
	test('add a valid job', async done => {
		expect.assertions(1)
		const job = await new Jobs()
		const result = await job.add({
			desc: 'test',
			type: 'Washer',
			age: 3,
			manufacturer: 'Bosch',
			user: 1,
			createdAt: '31.12.2019 23:59:59'
		})
		expect(result).toBe(true)
		done()
	})

	test('add job without type', async done => {
		expect.anything()
		const job = await new Jobs()
		await expect( job.add({
			desc: 'test',
			type: '',
			age: 3,
			manufacturer: 'Bosch',
			user: 1,
			createdAt: '31.12.2019 23:59:59'
		}) )
			.rejects.toEqual( Error('missing type') )
		done()
	})

	test('add job without desc', async done => {
		expect.anything()
		const job = await new Jobs()
		await expect( job.add({
			desc: '',
			type: 'Washer',
			age: 3,
			manufacturer: 'Bosch',
			user: 1,
			createdAt: '31.12.2019 23:59:59'
		}) )
			.rejects.toEqual( Error('missing desc') )
		done()
	})

	test('add job without age', async done => {
		expect.anything()
		const job = await new Jobs()
		await expect( job.add({
			desc: 'test',
			type: 'Washer',
			age: '',
			manufacturer: 'Bosch',
			user: 1,
			createdAt: '31.12.2019 23:59:59'
		}) )
			.rejects.toEqual( Error('missing age') )
		done()
	})

	test('add job without manufacturer', async done => {
		expect.anything()
		const job = await new Jobs()
		await expect( job.add({
			desc: 'test',
			type: 'Washer',
			age: 3,
			manufacturer: '',
			user: 1,
			createdAt: '31.12.2019 23:59:59'
		}) )
			.rejects.toEqual( Error('missing manufacturer') )
		done()
	})

	test('add job without user', async done => {
		expect.anything()
		const job = await new Jobs()
		await expect( job.add({
			desc: 'test',
			type: 'Washer',
			age: 3,
			manufacturer: 'Bosch',
			user: '',
			createdAt: '31.12.2019 23:59:59'
		}) )
			.rejects.toEqual( Error('missing user') )
		done()
	})

	test('add job without timestamp', async done => {
		expect.anything()
		const job = await new Jobs()
		await expect( job.add({
			desc: 'test',
			type: 'Washer',
			age: 3,
			manufacturer: 'Bosch',
			user: 1,
			createdAt: ''
		}) )
			.rejects.toEqual( Error('missing timestamp') )
		done()
	})
})

describe('getAll()', () => {
	test('get all jobs', async done => {
		expect.anything()
		const job = await new Jobs()
		await job.add({
			desc: 'test',
			type: 'Washer',
			age: 3,
			manufacturer: 'Bosch',
			user: 1,
			createdAt: '31.12.2019 23:59:59'
		})
		const valid = await job.getAll()
		expect(valid).toEqual([
			{
				appAge: 3,
				appMan: 'Bosch',
				appType: 'Washer',
				completed: 0,
				createdAt: '31.12.2019 23:59:59',
				desc: 'test',
				id: 1,
				userId: 1
			}
		])
		done()
	})

	test('get if no jobs', async done => {
		expect.anything()
		const job = await new Jobs()
		const valid = await job.getAll()
		expect(valid).toEqual([])
		done()
	})
})

describe('getByUser()', () => {
	test('get job with valid user id', async done => {
		expect.anything()
		const job = await new Jobs()
		await job.add({
			desc: 'test',
			type: 'Washer',
			age: 3,
			manufacturer: 'Bosch',
			user: 1,
			createdAt: '31.12.2019 23:59:59'
		})
		const valid = await job.getByUser(1)
		expect(valid).toEqual([
			{
				appAge: 3,
				appMan: 'Bosch',
				appType: 'Washer',
				completed: 0,
				createdAt: '31.12.2019 23:59:59',
				desc: 'test',
				id: 1,
				userId: 1
			}
		])
		done()
	})

	test('get job with invalid user id', async done => {
		expect.anything()
		const job = await new Jobs()
		await job.add({
			desc: 'test',
			type: 'Washer',
			age: 3,
			manufacturer: 'Bosch',
			user: 1,
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
			desc: 'test',
			type: 'Washer',
			age: 3,
			manufacturer: 'Bosch',
			user: 1,
			createdAt: '31.12.2019 23:59:59'
		})
		await expect( job.getByUser('') )
			.rejects.toEqual( Error('no argument passed') )
		done()
	})
})

describe('getById()', () => {
	test('get job by id', async done => {
		expect.anything()
		const job = await new Jobs()
		await job.add({
			desc: 'test',
			type: 'Washer',
			age: 3,
			manufacturer: 'Bosch',
			user: 1,
			createdAt: '31.12.2019 23:59:59'
		})
		const valid = await job.getById(1)
		expect(valid).toEqual({
			appAge: 3,
			appMan: 'Bosch',
			appType: 'Washer',
			completed: 0,
			createdAt: '31.12.2019 23:59:59',
			desc: 'test',
			id: 1,
			userId: 1
		})
		done()
	})

	test('get job with invalid id', async done => {
		expect.anything()
		const job = await new Jobs()
		await job.add({
			desc: 'test',
			type: 'Washer',
			age: 3,
			manufacturer: 'Bosch',
			user: 1,
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
			desc: 'test',
			type: 'Washer',
			age: 3,
			manufacturer: 'Bosch',
			user: 1,
			createdAt: '31.12.2019 23:59:59'
		})
		await expect( job.getById('') )
			.rejects.toEqual( Error('no argument passed') )
		done()
	})
})

describe('markCompleted()', () => {
	test('mark completed with valid id', async done => {
		expect.anything()
		const job = await new Jobs()
		await job.add({
			desc: 'test',
			type: 'Washer',
			age: 3,
			manufacturer: 'Bosch',
			user: 1,
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
			desc: 'test',
			type: 'Washer',
			age: 3,
			manufacturer: 'Bosch',
			user: 1,
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
			desc: 'test',
			type: 'Washer',
			age: 3,
			manufacturer: 'Bosch',
			user: 1,
			createdAt: '31.12.2019 23:59:59'
		})
		await expect( job.markCompleted() )
			.rejects.toEqual( Error('no such job found') )
		done()
	})
})


