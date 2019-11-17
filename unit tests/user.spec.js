
'use strict'

const Accounts = require('../models/user.js')

describe('register()', () => {

	test('register a valid account', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		const register = await account.register('deyan', 'password')
		expect(register).toEqual({
			authorised: true,
			user: {
				id: 1,
				user: 'deyan'
			}
		})
		done()
	})

	test('register a duplicate username', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('deyan', 'password')
		await expect( account.register('deyan', 'password') )
			.rejects.toEqual( Error('username "deyan" already in use') )
		done()
	})

	test('error if blank username', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('', 'password') )
			.rejects.toEqual( Error('missing username') )
		done()
	})

	test('error if blank password', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('deyan', '') )
			.rejects.toEqual( Error('missing password') )
		done()
	})

})

describe('uploadPicture()', () => {
	// this would have to be done by mocking the file system
	// perhaps using mock-fs?

})

describe('login()', () => {
	test('log in with valid credentials', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('deyan', 'password')
		const valid = await account.login('deyan', 'password')
		expect(valid).toEqual({
			authorised: true,
			user: {
				id: 1,
				user: 'deyan'
			}
		})
		done()
	})

	test('invalid username', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password')
		await expect( account.login('roej', 'password') )
			.rejects.toEqual( Error('username "roej" not found') )
		done()
	})

	test('invalid password', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password')
		await expect( account.login('doej', 'bad') )
			.rejects.toEqual( Error('invalid password for account "doej"') )
		done()
	})

})

describe('getById()', () => {
	test('get user with valid id', async done => {
		expect.anything()
		const account = await new Accounts()
		await account.register('deyan', 'password')
		const valid = await account.getById(1)
		expect(valid).toEqual({
			id: 1,
			user: 'deyan'
		})
		done()
	})

	test('get user with invalid id', async done => {
		expect.anything()
		const account = await new Accounts()
		await account.register('deyan', 'password')
		await expect( account.getById(10) )
			.rejects.toEqual( Error('user not found') )
		done()
	})
})
