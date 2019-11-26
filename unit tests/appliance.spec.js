
'use strict'

const Appliance = require('../models/appliance.js')

describe('add()', () => {
	test('add supported appliance', async done => {
		expect.assertions(1)
		const app = await new Appliance()
		const add = await app.add('Washer')
		expect(add).toBe(true)
		done()
	})

	test('add supported appliance empty field', async done => {
		expect.assertions(1)
		const app = await new Appliance()
		await expect( app.add('') )
			.rejects.toEqual( Error('missing type') )
		done()
	})
})

describe('getAll()', () => {
	test('get all supported appliances', async done => {
		expect.anything()
		const app = await new Appliance()
		await app.add('Washer')
		const valid = await app.getAll()
		expect(valid).toEqual([
			{
				'id': 1,
				'type': 'Washer'
			}
		])
		done()
	})
})

describe('remove()', () => {
	test('remove appliances with valid id', async done => {
		expect.anything()
		const app = await new Appliance()
		await app.add('Washer')
		const valid = await app.remove(1)
		expect(valid).toBe(true)
		done()
	})

	test('remove appliances with invalid id', async done => {
		expect.anything()
		const app = await new Appliance()
		await app.add('Washer')
		await expect( app.remove('') )
			.rejects.toEqual( Error('missing id') )
		done()
	})
})
