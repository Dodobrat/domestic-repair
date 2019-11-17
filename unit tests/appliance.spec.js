
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
		const man = await new Appliance()
		await man.add('Washer')
		const valid = await man.getAll()
		expect(valid).toEqual([
			{
				'id': 1,
				'type': 'Washer'
			}
		])
		done()
	})
})
