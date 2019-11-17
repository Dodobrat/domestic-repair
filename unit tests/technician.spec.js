
'use strict'

const Technicians = require('../models/technician.js')

describe('register()', () => {

	test('register a valid technician account', async done => {
		expect.assertions(1)
		const technician = await new Technicians()
		const register = await technician.register('tech', '123456')
		expect(register).toEqual({
			authorised: true,
			tech: {
				id: 1,
				user: 'tech'
			}
		})
		done()
	})

	test('register a duplicate technician username', async done => {
		expect.assertions(1)
		const account = await new Technicians()
		await account.register('tech', '123456')
		await expect( account.register('tech', '123456') )
			.rejects.toEqual( Error('username "tech" already in use') )
		done()
	})

	test('error if blank technician username', async done => {
		expect.assertions(1)
		const account = await new Technicians()
		await expect( account.register('', 'password') )
			.rejects.toEqual( Error('missing username') )
		done()
	})

	test('error if blank technician password', async done => {
		expect.assertions(1)
		const account = await new Technicians()
		await expect( account.register('tech', '') )
			.rejects.toEqual( Error('missing password') )
		done()
	})

})

describe('login()', () => {
	test('technician log in with valid credentials', async done => {
		expect.assertions(1)
		const account = await new Technicians()
		await account.register('tech', '123456')
		const valid = await account.login('tech', '123456')
		expect(valid).toEqual({
			authorised: true,
			tech: {
				id: 1,
				user: 'tech'
			}
		})
		done()
	})

	test('invalid technician username', async done => {
		expect.assertions(1)
		const account = await new Technicians()
		await account.register('tech', 'password')
		await expect( account.login('techy', 'password') )
			.rejects.toEqual( Error('username "techy" not found') )
		done()
	})

	test('invalid technician password', async done => {
		expect.assertions(1)
		const account = await new Technicians()
		await account.register('tech', 'password')
		await expect( account.login('tech', 'bad') )
			.rejects.toEqual( Error('invalid password for account "tech"') )
		done()
	})

})
