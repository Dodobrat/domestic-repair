
'use strict'

const Manufacturer = require('../models/manufacturer.js')

describe('add()', () => {
	test('add supported manufacturer', async done => {
		expect.assertions(1)
		const man = await new Manufacturer()
		const add = await man.add('Bosch')
		expect(add).toBe(true)
		done()
	})

	test('add supported manufacturer empty field', async done => {
		expect.assertions(1)
		const man = await new Manufacturer()
		await expect( man.add('') )
			.rejects.toEqual( Error('missing name') )
		done()
	})
})

describe('getAll()', () => {
	test('get all supported manufacturers', async done => {
		expect.anything()
		const man = await new Manufacturer()
		await man.add('Bosch')
		const valid = await man.getAll()
		expect(valid).toEqual([
			{
				'id': 1,
				'name': 'Bosch'
			}
		])
		done()
	})
})
