
'use strict'

const Log = require('../models/log.js')

describe('addLog()', () => {
	test('add log', async done => {
		expect.assertions(1)
		const app = await new Log()
		const add = await app.addLog({
			desc: 'test',
			createdAt: '31.12.2019 23:59:59',
			jobId: 1
		})
		expect(add).toBe(true)
		done()
	})

	test('add log without jobId', async done => {
		expect.assertions(1)
		const app = await new Log()
		await expect( app.addLog({
			desc: 'test',
			createdAt: '31.12.2019 23:59:59',
			jobId: ''
		}) )
			.rejects.toEqual( Error('missing jobId') )
		done()
	})

	test('add log without desc', async done => {
		expect.assertions(1)
		const app = await new Log()
		await expect( app.addLog({
			desc: '',
			createdAt: '31.12.2019 23:59:59',
			jobId: 1
		}) )
			.rejects.toEqual( Error('missing desc') )
		done()
	})

	test('add log without timestamp', async done => {
		expect.assertions(1)
		const app = await new Log()
		await expect( app.addLog({
			desc: 'test',
			createdAt: '',
			jobId: 1
		}) )
			.rejects.toEqual( Error('missing timestamp') )
		done()
	})
})

describe('getLogsByJobId()', () => {
	test('get all supported appliances', async done => {
		expect.anything()
		const app = await new Log()
		await app.addLog({
			desc: 'test',
			createdAt: '31.12.2019 23:59:59',
			jobId: 1
		})
		const valid = await app.getLogsByJobId(1)
		expect(valid).toEqual([
			{
				id: 1,
				desc: 'test',
				createdAt: '31.12.2019 23:59:59',
				jobId: 1
			}
		])
		done()
	})

	test('get all supported appliances with no arg', async done => {
		expect.anything()
		const app = await new Log()
		await app.addLog({
			desc: 'test',
			createdAt: '31.12.2019 23:59:59',
			jobId: 1
		})
		await expect( app.getLogsByJobId() )
			.rejects.toEqual( Error('missing jobId') )
		done()
	})
})
